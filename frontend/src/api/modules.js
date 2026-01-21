import api from "./axios";

// ✅ Get modules for a course (admin)
export const getAdminModules = (courseId) =>
  api.get(`/admin/courses/${courseId}/modules/`);

// ✅ Add new module (FIXED ✅)
export const addModule = (courseId, data) =>
  api.post(`/admin/courses/${courseId}/modules/`, data);

// ✅ Get module detail (for EditModule page)
export const getModuleDetail = (moduleId) =>
  api.get(`/admin/modules/${moduleId}/`);

// ✅ Update module (FIXED ✅)
export const editModule = (moduleId, data) =>
  api.put(`/admin/modules/${moduleId}/`, data); // or patch

// ✅ Delete module (FIXED ✅)
export const deleteModule = (moduleId) =>
  api.delete(`/admin/modules/${moduleId}/`);
