import api from "./axios";

export const getAdminCourses = () => api.get("/admin/courses/");
export const addCourse = (data) => api.post("/admin/courses/", data);
export const updateCourse = (id, data) =>
  api.put(`/admin/courses/${id}/`, data);
export const deleteCourse = (id) =>
  api.delete(`/admin/courses/${id}/`);
