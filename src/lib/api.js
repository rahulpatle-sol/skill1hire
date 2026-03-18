import axios from "axios";
import Cookies from "js-cookie";

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

const api = axios.create({ baseURL: BASE, timeout: 15000 });

api.interceptors.request.use((c) => {
  const t = Cookies.get("accessToken");
  if (t) c.headers.Authorization = `Bearer ${t}`;
  return c;
});

api.interceptors.response.use(
  (r) => r,
  async (err) => {
    const orig = err.config;
    if (err.response?.status === 401 && !orig._retry) {
      orig._retry = true;
      try {
        const rt = Cookies.get("refreshToken");
        if (!rt) throw new Error("no refresh");
        const { data } = await axios.post(`${BASE}/auth/refresh-token`, { refreshToken: rt });
        const newToken = data?.data?.accessToken || data?.accessToken;
        Cookies.set("accessToken", newToken, { expires: 7 });
        orig.headers.Authorization = `Bearer ${newToken}`;
        return api(orig);
      } catch {
        Cookies.remove("accessToken"); Cookies.remove("refreshToken");
        if (typeof window !== "undefined") window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  }
);

const safe = (res) => res?.data?.data ?? res?.data ?? {};

export const authAPI = {
  register: (d) => api.post("/auth/register", d),
  login: (d) => api.post("/auth/login", d),
  logout: () => api.post("/auth/logout"),
  getMe: () => api.get("/auth/me"),
  forgotPassword: (email) => api.post("/auth/forgot-password", { email }),
  resetPassword: (token, password) => api.post(`/auth/reset-password/${token}`, { password }),
  refreshToken: (token) => api.post("/auth/refresh-token", { refreshToken: token }),
  verifyEmail: (token) => api.get(`/auth/verify-email/${token}`),
};

export const candidateAPI = {
  getProfile: () => api.get("/candidate/profile"),
  updateProfile: (d) => api.put("/candidate/profile", d),
  updateSkills: (d) => api.put("/candidate/skills", d),
  updateSocialLinks: (d) => api.put("/candidate/social-links", d),
  getPublicProfile: (slug) => api.get(`/candidate/public/${slug}`),
  submitCapstone: (d) => api.post("/candidate/capstone", d),
  getScorecard: () => api.get("/candidate/scorecard"),
  getAssessments: () => api.get("/candidate/assessments"),
  getAssessmentById: (id) => api.get(`/candidate/assessments/${id}`),
  submitAssessment: (id, d) => api.post(`/candidate/assessments/${id}/submit`, d),
  getJobFeed: (p) => api.get("/candidate/job-feed", { params: p }),
  getMyApplications: (p) => api.get("/candidate/my-applications", { params: p }),
  withdrawApplication: (id) => api.delete(`/candidate/applications/${id}`),
};

export const jobsAPI = {
  getJobs: (p) => api.get("/jobs", { params: p }),
  getJobBySlug: (slug) => api.get(`/jobs/${slug}`),
  applyToJob: (id, d) => api.post(`/jobs/${id}/apply`, d),
};

export const hrAPI = {
  getProfile: () => api.get("/hr/profile"),
  updateProfile: (d) => api.put("/hr/profile", d),
  postJob: (d) => api.post("/hr/jobs", d),
  getMyJobs: (p) => api.get("/hr/jobs", { params: p }),
  updateJob: (id, d) => api.put(`/hr/jobs/${id}`, d),
  getJobApplications: (jobId, p) => api.get(`/hr/jobs/${jobId}/applications`, { params: p }),
  updateApplication: (id, d) => api.put(`/hr/applications/${id}`, d),
};

export const mentorAPI = {
  getAllMentors: (p) => api.get("/mentor", { params: p }),
  getProfile: () => api.get("/mentor/profile"),
  updateProfile: (d) => api.put("/mentor/profile", d),
  bookSession: (mentorId, d) => api.post(`/mentor/${mentorId}/book`, d),
  getMySessions: (p) => api.get("/mentor/sessions", { params: p }),
  updateSession: (id, d) => api.put(`/mentor/sessions/${id}`, d),
  rateSession: (id, d) => api.post(`/mentor/sessions/${id}/rate`, d),
};

export const adminAPI = {
  getDashboard: () => api.get("/admin/dashboard"),
  getAllUsers: (p) => api.get("/admin/users", { params: p }),
  verifyUser: (id, d) => api.put(`/admin/verify/${id}`, d),
  getPendingVerifications: (role) => api.get(`/admin/pending/${role}`),
  toggleUserActive: (id) => api.put(`/admin/users/${id}/toggle-active`),
  getDomains: () => api.get("/admin/domains"),
  createDomain: (d) => api.post("/admin/domains", d),
  updateDomain: (id, d) => api.put(`/admin/domains/${id}`, d),
  getSkills: (p) => api.get("/admin/skills", { params: p }),
  createSkill: (d) => api.post("/admin/skills", d),
  getAssessments: () => api.get("/admin/assessments"),
  createAssessment: (d) => api.post("/admin/assessments", d),
};

export { safe };
export default api;
