import { StudentProfile } from "../models/index.js";
import { AppError } from "../utils/http.js";

const parseOptionalNumber = (value) =>
  value === "" || value === undefined || value === null ? null : Number(value);

const normalizeProfilePayload = (payload) => ({
  name: payload.name?.trim(),
  age: Number(payload.age),
  collegeName: payload.collegeName?.trim(),
  courseName: payload.courseName?.trim(),
  stream: payload.stream?.trim(),
  rollNumber: payload.rollNumber?.trim(),
  gender: payload.gender?.trim(),
  fatherJob: payload.fatherJob?.trim(),
  fatherIncome: parseOptionalNumber(payload.fatherIncome),
  class10Percentage: parseOptionalNumber(payload.class10Percentage),
  class12Percentage: parseOptionalNumber(payload.class12Percentage),
  currentSemester: parseOptionalNumber(payload.currentSemester),
  averageCgpa: parseOptionalNumber(payload.averageCgpa),
});

const validateProfilePayload = (payload, { isNewProfile }) => {
  const requiredFields = [
    "name",
    "age",
    "collegeName",
    "courseName",
    "stream",
    "rollNumber",
    "gender",
    "fatherJob",
  ];

  for (const field of requiredFields) {
    if (payload[field] === undefined || payload[field] === null || payload[field] === "") {
      throw new AppError(`${field} is required.`, 400);
    }
  }

  if (Number.isNaN(payload.age) || payload.age <= 0) {
    throw new AppError("age must be a valid positive number.", 400);
  }

  if (payload.fatherIncome !== null && (Number.isNaN(payload.fatherIncome) || payload.fatherIncome < 0)) {
    throw new AppError("fatherIncome must be a valid non-negative number.", 400);
  }

  // Academic fields: required for new profiles, optional for existing profiles
  if (isNewProfile) {
    const academicFields = ["class10Percentage", "class12Percentage", "currentSemester", "averageCgpa"];

    for (const field of academicFields) {
      if (payload[field] === null || payload[field] === undefined) {
        throw new AppError(`${field} is required for new profiles.`, 400);
      }
    }
  }

  // Validate ranges when provided
  if (payload.class10Percentage !== null) {
    if (Number.isNaN(payload.class10Percentage) || payload.class10Percentage < 0 || payload.class10Percentage > 100) {
      throw new AppError("class10Percentage must be between 0 and 100.", 400);
    }
  }

  if (payload.class12Percentage !== null) {
    if (Number.isNaN(payload.class12Percentage) || payload.class12Percentage < 0 || payload.class12Percentage > 100) {
      throw new AppError("class12Percentage must be between 0 and 100.", 400);
    }
  }

  if (payload.currentSemester !== null) {
    if (Number.isNaN(payload.currentSemester) || !Number.isInteger(payload.currentSemester) || payload.currentSemester < 1) {
      throw new AppError("currentSemester must be an integer >= 1.", 400);
    }
  }

  if (payload.averageCgpa !== null) {
    if (Number.isNaN(payload.averageCgpa) || payload.averageCgpa < 0 || payload.averageCgpa > 10) {
      throw new AppError("averageCgpa must be between 0 and 10.", 400);
    }
  }
};

const serializeProfile = (profile) => ({
  id: profile._id.toString(),
  name: profile.name,
  age: profile.age,
  collegeName: profile.collegeName,
  courseName: profile.courseName,
  stream: profile.stream,
  rollNumber: profile.rollNumber,
  gender: profile.gender,
  fatherJob: profile.fatherJob,
  fatherIncome: profile.fatherIncome,
  class10Percentage: profile.class10Percentage,
  class12Percentage: profile.class12Percentage,
  currentSemester: profile.currentSemester,
  averageCgpa: profile.averageCgpa,
  userId: profile.userId.toString(),
});

const createOrUpdateStudentProfile = async (userId, payload) => {
  const normalizedPayload = normalizeProfilePayload(payload);

  // Determine if this is a brand-new profile
  const existingProfile = await StudentProfile.findOne({ userId });
  const isNewProfile = !existingProfile;

  validateProfilePayload(normalizedPayload, { isNewProfile });

  const profile = await StudentProfile.findOneAndUpdate(
    { userId },
    {
      ...normalizedPayload,
      userId,
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    },
  );

  return serializeProfile(profile);
};

const getStudentProfileByUserId = async (userId) => {
  const profile = await StudentProfile.findOne({ userId });

  if (!profile) {
    return null;
  }

  return serializeProfile(profile);
};

export { createOrUpdateStudentProfile, getStudentProfileByUserId };
