const pdfParse = require("pdf-parse");
const {
  generateInterviewReport,
  generateResumePdf,
} = require("../services/ai.service");
const interviewReportModel = require("../models/interviewReport.model");

/**
 * @description Controller to generate interview report based on user self description, resume and job description.
 */
async function generateInterViewReportController(req, res) {
  try {
    let resumeText = "";
    console.log("Step 1 : Request Received");

    if (req.file) {
      const resumeContent = await pdfParse(req.file.buffer);
      resumeText = resumeContent.text;
      console.log("Step 2 : PDF Parsed");
    }
    const { selfDescription, jobDescription } = req.body;
    console.log("Step 3 : Calling Gemini");

    const interViewReportByAi = await generateInterviewReport({
      resume: resumeText,
      selfDescription,
      jobDescription,
    });
    console.log("Step 4 : Gemini Response Received");

    console.log("AI RESPONSE:");
    console.log(JSON.stringify(interViewReportByAi, null, 2));
    console.log("Step 5 : Saving MongoDB");
    const interviewReport = await interviewReportModel.create({
      user: req.user.id,
      resume: resumeText,
      selfDescription,
      jobDescription,
      ...interViewReportByAi,
      title: interViewReportByAi?.title || "Interview Report",
    });
    console.log("Step 6 : MongoDB Saved");
    res.status(201).json({
      message: "Interview report generated successfully.",
      interviewReport,
    });
  } catch (error) {
    console.error("Generate Interview Report Error:");
    console.error(error);

    if (error.status === 503) {
      return res.status(503).json({
        success: false,
        message:
          "Our AI service is currently experiencing high demand. Please try again in a few minutes.",
      });
    }
    res.status(500).json({
      message: "Failed to generate interview report.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}

/**
 * @description Controller to get interview report by interviewId.
 */
async function getInterviewReportByIdController(req, res) {
  const { interviewId } = req.params;

  const interviewReport = await interviewReportModel.findOne({
    _id: interviewId,
    user: req.user.id,
  });

  if (!interviewReport) {
    return res.status(404).json({
      message: "Interview report not found.",
    });
  }

  res.status(200).json({
    message: "Interview report fetched successfully.",
    interviewReport,
  });
}

/**
 * @description Controller to get all interview reports of logged in user.
 */
async function getAllInterviewReportsController(req, res) {
  const interviewReports = await interviewReportModel
    .find({ user: req.user.id })
    .sort({ createdAt: -1 })
    .select(
      "-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan",
    );

  res.status(200).json({
    message: "Interview reports fetched successfully.",
    interviewReports,
  });
}

/**
 * @description Controller to generate resume PDF based on user self description, resume and job description.
 */
async function generateResumePdfController(req, res) {
  const { interviewReportId } = req.params;

  const interviewReport =
    await interviewReportModel.findById(interviewReportId);

  if (!interviewReport) {
    return res.status(404).json({
      message: "Interview report not found.",
    });
  }

  const { resume, jobDescription, selfDescription } = interviewReport;

  const pdfBuffer = await generateResumePdf({
    resume,
    jobDescription,
    selfDescription,
  });

  res.set({
    "Content-Type": "application/pdf",
    "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`,
  });

  res.send(pdfBuffer);
}

/**
 * @description Controller to delete the interview report genrated in the past.
 */
async function deleteInterviewReportController(req, res) {
  const report = await interviewReportModel.findOneAndDelete({
    _id: req.params.interviewId,
    user: req.user.id,
  });

  if (!report) {
    return res.status(404).json({
      message: "Report not found",
    });
  }

  res.status(200).json({
    message: "Report deleted successfully",
  });
}

module.exports = {
  generateInterViewReportController,
  getInterviewReportByIdController,
  getAllInterviewReportsController,
  generateResumePdfController,
  deleteInterviewReportController,
};
