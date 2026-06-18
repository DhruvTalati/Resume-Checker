const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const interviewController = require("../controllers/interview.controller");
const uploads = require("../middlewares/file.middleware");

const interviewRouter = express.Router();

/**
 * @route POST /api/interview/
 * @description Generate new  interview report based on the candidate's resume and job description
 * #access  private
 */
interviewRouter.post(
  "/",
  authMiddleware.authUser,
  uploads.single("resume"),
  interviewController.generateInterviewReportController,
);

module.exports = interviewRouter;
