import api from "./axios";

export const getAdminLessons = (moduleId) =>
  api.get(`/admin/modules/${moduleId}/lessons/`);

export const addLesson = (moduleId, data) =>
  api.post(`/admin/modules/${moduleId}/lessons/add/`, data);

export const getLessonDetail = (lessonId) =>
  api.get(`/lessons/${lessonId}/`);

export const updateLesson = (lessonId, data) =>
  api.put(`/admin/lessons/${lessonId}/edit/`, data);

export const deleteLesson = (lessonId) =>
  api.delete(`/admin/lessons/${lessonId}/delete/`);
