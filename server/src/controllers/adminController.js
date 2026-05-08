import {
  deleteAdminSubmission,
  getAdminLeaderboard,
  getAdminStats,
  getAdminStudentDetails,
  getAdminStudents,
  updateAdminUserBlockStatus,
} from "../services/adminService.js";

const listStudents = async (request, response) => {
  const result = await getAdminStudents(request.query);

  response.status(200).json({
    success: true,
    message: "Students fetched successfully.",
    data: result,
  });
};

const getStudentDetails = async (request, response) => {
  const result = await getAdminStudentDetails(request.params.userId);

  response.status(200).json({
    success: true,
    message: "Student details fetched successfully.",
    data: result,
  });
};

const getStats = async (_request, response) => {
  const result = await getAdminStats();

  response.status(200).json({
    success: true,
    message: "Admin statistics fetched successfully.",
    data: result,
  });
};

const getLeaderboard = async (request, response) => {
  const result = await getAdminLeaderboard(request.query);

  response.status(200).json({
    success: true,
    message: "Leaderboard fetched successfully.",
    data: result,
  });
};

const removeSubmission = async (request, response) => {
  const result = await deleteAdminSubmission(request.params.submissionId);

  response.status(200).json({
    success: true,
    message: "Submission deleted successfully.",
    data: result,
  });
};

const updateUserBlockStatus = async (request, response) => {
  const result = await updateAdminUserBlockStatus(request.user.id, request.params.userId, request.body.isBlocked);

  response.status(200).json({
    success: true,
    message: result.isBlocked ? "User suspended successfully." : "User restored successfully.",
    data: result,
  });
};

export { getLeaderboard, getStats, getStudentDetails, listStudents, removeSubmission, updateUserBlockStatus };
