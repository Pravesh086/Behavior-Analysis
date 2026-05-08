import mongoose from "mongoose";

import { StudentProfile, SurveySubmission, User } from "../models/index.js";
import { AppError } from "../utils/http.js";
import { analyzeSavedSubmission } from "./analysisService.js";

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const toObjectId = (id, label = "id") => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(`Invalid ${label}.`, 400);
  }

  return new mongoose.Types.ObjectId(id);
};

const getPerformanceLabel = (score) => {
  if (score === null || score === undefined) {
    return "Not submitted";
  }

  if (score >= 420) {
    return "High";
  }

  if (score >= 315) {
    return "Moderate";
  }

  return "Needs attention";
};

const serializeStudent = (item, rank = null) => {
  const profile = item.profile || null;
  const submission = item.submission || null;

  return {
    id: item._id.toString(),
    username: item.username,
    role: item.role || "student",
    isBlocked: Boolean(item.isBlocked),
    createdAt: item.createdAt?.toISOString?.() || item.createdAt,
    updatedAt: item.updatedAt?.toISOString?.() || item.updatedAt,
    profile: profile
      ? {
          id: profile._id.toString(),
          name: profile.name,
          age: profile.age,
          collegeName: profile.collegeName,
          courseName: profile.courseName,
          stream: profile.stream,
          rollNumber: profile.rollNumber,
          gender: profile.gender,
          createdAt: profile.createdAt?.toISOString?.() || profile.createdAt,
          updatedAt: profile.updatedAt?.toISOString?.() || profile.updatedAt,
        }
      : null,
    submission: submission
      ? {
          id: submission._id.toString(),
          totalScore: submission.totalScore,
          averageScore: submission.averageScore,
          answeredCount: submission.answers?.length || 0,
          createdAt: submission.createdAt?.toISOString?.() || submission.createdAt,
          updatedAt: submission.updatedAt?.toISOString?.() || submission.updatedAt,
          performance: getPerformanceLabel(submission.totalScore),
        }
      : null,
    submissionStatus: submission ? "submitted" : "not-submitted",
    rank,
  };
};

const buildStudentPipeline = ({ search, status, performance, minScore, maxScore, sortBy, sortOrder }) => {
  const pipeline = [
    { $match: { $or: [{ role: "student" }, { role: { $exists: false } }] } },
    {
      $lookup: {
        from: "studentprofiles",
        localField: "_id",
        foreignField: "userId",
        as: "profile",
      },
    },
    { $unwind: { path: "$profile", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "surveysubmissions",
        localField: "_id",
        foreignField: "userId",
        as: "submission",
      },
    },
    { $unwind: { path: "$submission", preserveNullAndEmptyArrays: true } },
  ];

  const match = {};

  if (search) {
    const searchRegex = new RegExp(escapeRegExp(search), "i");
    const numericSearch = Number(search);
    match.$or = [
      { username: searchRegex },
      { "profile.name": searchRegex },
      ...(Number.isNaN(numericSearch) ? [] : [{ "submission.totalScore": numericSearch }]),
    ];
  }

  if (status === "submitted") {
    match["submission._id"] = { $exists: true };
  }

  if (status === "not-submitted") {
    match["submission._id"] = { $exists: false };
  }

  if (minScore !== undefined || maxScore !== undefined) {
    match["submission.totalScore"] = {};

    if (minScore !== undefined) {
      match["submission.totalScore"].$gte = minScore;
    }

    if (maxScore !== undefined) {
      match["submission.totalScore"].$lte = maxScore;
    }
  }

  if (performance) {
    if (performance === "high") {
      match["submission.totalScore"] = { ...(match["submission.totalScore"] || {}), $gte: 420 };
    } else if (performance === "moderate") {
      match["submission.totalScore"] = { ...(match["submission.totalScore"] || {}), $gte: 315, $lt: 420 };
    } else if (performance === "needs-attention") {
      match["submission.totalScore"] = { ...(match["submission.totalScore"] || {}), $lt: 315 };
    }
  }

  if (Object.keys(match).length > 0) {
    pipeline.push({ $match: match });
  }

  const sortFields = {
    name: "profile.name",
    email: "username",
    score: "submission.totalScore",
    submittedAt: "submission.updatedAt",
    createdAt: "createdAt",
  };
  const selectedSort = sortFields[sortBy] || sortFields.createdAt;
  const direction = sortOrder === "asc" ? 1 : -1;

  pipeline.push({ $sort: { [selectedSort]: direction, _id: 1 } });

  return pipeline;
};

const parsePositiveInteger = (value, fallback, max) => {
  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed < 1) {
    return fallback;
  }

  return Math.min(parsed, max);
};

const parseOptionalScore = (value) => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  const parsed = Number(value);

  if (Number.isNaN(parsed)) {
    throw new AppError("Score filters must be valid numbers.", 400);
  }

  return parsed;
};

const getAdminStudents = async (query) => {
  const page = parsePositiveInteger(query.page, 1, 100000);
  const limit = parsePositiveInteger(query.limit, 10, 100);
  const skip = (page - 1) * limit;
  const pipeline = buildStudentPipeline({
    search: query.search?.trim(),
    status: query.status,
    performance: query.performance,
    minScore: parseOptionalScore(query.minScore),
    maxScore: parseOptionalScore(query.maxScore),
    sortBy: query.sortBy,
    sortOrder: query.sortOrder,
  });

  const [result] = await User.aggregate([
    ...pipeline,
    {
      $facet: {
        items: [{ $skip: skip }, { $limit: limit }],
        total: [{ $count: "count" }],
      },
    },
  ]);

  const total = result?.total?.[0]?.count || 0;

  return {
    students: (result?.items || []).map((item) => serializeStudent(item)),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getAdminStudentDetails = async (userId) => {
  const id = toObjectId(userId, "user id");
  const [user, profile, submission, analysis] = await Promise.all([
    User.findOne({ _id: id, $or: [{ role: "student" }, { role: { $exists: false } }] })
      .select("_id username role isBlocked createdAt updatedAt")
      .lean(),
    StudentProfile.findOne({ userId: id }).lean(),
    SurveySubmission.findOne({ userId: id }).lean(),
    analyzeSavedSubmission(id),
  ]);

  if (!user) {
    throw new AppError("Student not found.", 404);
  }

  return {
    student: serializeStudent({ ...user, profile, submission }),
    submissionHistory: submission
      ? [
          {
            id: submission._id.toString(),
            totalScore: submission.totalScore,
            averageScore: submission.averageScore,
            answers: submission.answers,
            createdAt: submission.createdAt?.toISOString?.() || submission.createdAt,
            updatedAt: submission.updatedAt?.toISOString?.() || submission.updatedAt,
          },
        ]
      : [],
    analysis,
  };
};

const getAdminStats = async () => {
  const [totalUsers, totalSubmissions, submissionStats] = await Promise.all([
    User.countDocuments({ $or: [{ role: "student" }, { role: { $exists: false } }] }),
    SurveySubmission.countDocuments(),
    SurveySubmission.aggregate([
      {
        $group: {
          _id: null,
          averageScore: { $avg: "$totalScore" },
          highestScore: { $max: "$totalScore" },
          lowestScore: { $min: "$totalScore" },
        },
      },
    ]),
  ]);

  const stats = submissionStats[0] || {};

  return {
    totalUsers,
    totalSubmissions,
    averageScore: stats.averageScore ? Number(stats.averageScore.toFixed(2)) : 0,
    highestScore: stats.highestScore || 0,
    lowestScore: stats.lowestScore || 0,
  };
};

const getAdminLeaderboard = async (query) => {
  const limit = parsePositiveInteger(query.limit, 10, 100);
  const submissions = await SurveySubmission.find()
    .sort({ totalScore: -1, updatedAt: 1 })
    .limit(limit)
    .populate("userId", "_id username role isBlocked")
    .lean();

  const profileMap = new Map(
    (
      await StudentProfile.find({
        userId: { $in: submissions.map((submission) => submission.userId?._id).filter(Boolean) },
      }).lean()
    ).map((profile) => [profile.userId.toString(), profile]),
  );

  return submissions.map((submission, index) =>
    serializeStudent(
      {
        ...submission.userId,
        profile: profileMap.get(submission.userId._id.toString()) || null,
        submission,
      },
      index + 1,
    ),
  );
};

const deleteAdminSubmission = async (submissionId) => {
  const id = toObjectId(submissionId, "submission id");
  const submission = await SurveySubmission.findByIdAndDelete(id);

  if (!submission) {
    throw new AppError("Submission not found.", 404);
  }

  return {
    id: submission._id.toString(),
    userId: submission.userId.toString(),
  };
};

const updateAdminUserBlockStatus = async (adminUserId, userId, isBlocked) => {
  const id = toObjectId(userId, "user id");

  if (adminUserId === userId && isBlocked) {
    throw new AppError("Admins cannot suspend their own account.", 400);
  }

  if (typeof isBlocked !== "boolean") {
    throw new AppError("isBlocked must be a boolean.", 400);
  }

  const user = await User.findOneAndUpdate(
    { _id: id, $or: [{ role: "student" }, { role: { $exists: false } }] },
    { isBlocked },
    { new: true, runValidators: true },
  ).select("_id username role isBlocked createdAt updatedAt");

  if (!user) {
    throw new AppError("Student not found.", 404);
  }

  return serializeStudent(user.toObject());
};

export {
  deleteAdminSubmission,
  getAdminLeaderboard,
  getAdminStats,
  getAdminStudentDetails,
  getAdminStudents,
  updateAdminUserBlockStatus,
};
