import api from "../../../api/axios";

export const generateInterviewReport = async ({
  jobDescription,
  selfDescription,
  resumeFile,
}) => {
  const formData = new FormData();

  formData.append("jobDescription", jobDescription);

  if (selfDescription)
    formData.append("selfDescription", selfDescription);

  if (resumeFile)
    formData.append("resume", resumeFile);

  const { data } = await api.post("/api/interview/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};

export const getAllInterviewReports = async () => {
  const { data } = await api.get("/api/interview/?page=1&limit=20");

  return data;
};

export const getInterviewReportById = async (id) => {
  const { data } = await api.get(`/api/interview/report/${id}`);

  return data;
};

export const deleteInterviewReport = async (id) => {
  const { data } = await api.delete(`/api/interview/${id}`);

  return data;
};

export const generateResumePdf = async (id) => {
  const { data } = await api.post(
    `/api/interview/resume/pdf/${id}`,
    {},
    {
      responseType: "arraybuffer",
    }
  );

  return data;
};