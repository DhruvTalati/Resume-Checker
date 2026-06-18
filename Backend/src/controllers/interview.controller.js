const pdfParse = require("pdf-parse");

console.log("pdfParse =", pdfParse);
const generateInterviewReport = require("../services/ai.service");
const { GenerateImagesResponse } = require("@google/genai");
const interviewReportModel = require("../models/interviewReport.model");

async function generateInterviewReportController(req, res) {
  try {
    const resumeFile = req.file;

    const pdfData = await pdfParse(req.file.buffer);
    const resumeContent = pdfData.text;
    const { selfDescription, jobDescription } = req.body;

    let interviewReportByAI;

    try {
      interviewReportByAI = await generateInterviewReport({
        resume: resumeContent,
        selfDescription,
        jobDescription,
      });
    } catch (error) {
      console.error("Gemini Error:", error);
      return res.status(500).json({
        message: error.message,
      });
    }

    const interviewReport = await interviewReportModel.create({
      user: req.user._id,
      resume: resumeContent,
      selfDescription,
      jobDescription,
      ...interviewReportByAI,
    });

    return res.status(201).json({
      message: "Interview report generated successfully",
      interviewReport,
    });
  } catch (error) {
    console.error("CONTROLLER ERROR:", error);

    return res.status(500).json({
      message: error.message,
      error,
    });
  }
}

module.exports = {
  generateInterviewReportController,
};
