import { createOrUpdateStudentProfile, getStudentProfileByUserId } from "../services/studentService.js";

const upsertStudentProfile = async (request, response) => {
  const profile = await createOrUpdateStudentProfile(request.user.id, request.body);

  response.status(200).json({
    success: true,
    message: "Student profile saved successfully.",
    data: profile,
  });
};

const getStudentProfile = async (request, response) => {
  const profile = await getStudentProfileByUserId(request.user.id);

  response.status(200).json({
    success: true,
    message: profile ? "Student profile fetched successfully." : "Student profile not created yet.",
    data: profile,
  });
};

export { getStudentProfile, upsertStudentProfile };
