import api from "./axios";

// 🔹 Get modules for a course (admin)
export const getAdminModules = (courseId) =>
  api.get(`/admin/courses/${courseId}/modules/`);

// 🔹 Add new module
export const addModule = (courseId, data) =>
  api.post(`/admin/courses/${courseId}/modules/add/`, data);

// 🔹 Edit module
export const editModule = (moduleId, data) =>
  api.patch(`/admin/modules/${moduleId}/edit/`, data);

// 🔹 Delete module
export const deleteModule = (moduleId) =>
  api.delete(`/admin/modules/${moduleId}/delete/`);

export const getAdminModule = (moduleId) =>
  api.get(`/admin/modules/${moduleId}/`);

