import { buildReportBuffer } from "../services/reportService.js";

const downloadReport = async (request, response) => {
  const pdfBuffer = await buildReportBuffer(request.user.id);

  response.setHeader("Content-Type", "application/pdf");
  response.setHeader("Content-Disposition", "attachment; filename=\"student-report.pdf\"");
  response.status(200).send(pdfBuffer);
};

export { downloadReport };
