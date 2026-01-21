// src/api/quiz.js
import api from "./axios";

// ✅ Get quiz for module
export const getModuleQuiz = (moduleId) =>
  api.get(`/modules/${moduleId}/quiz/`);

// ✅ Create quiz for module (only once)
export const createModuleQuiz = (moduleId) =>
  api.post(`/modules/${moduleId}/quiz/create/`, {
    title: `Module ${moduleId} Quiz`,
    module: Number(moduleId),
  });

// ✅ Get questions for quiz
export const getQuizQuestions = (quizId) =>
  api.get(`/quizzes/${quizId}/questions/`);

// ✅ Add question to quiz
export const addQuizQuestion = (quizId, data) =>
  api.post(`/quizzes/${quizId}/questions/add/`, data);

// ✅ Get single question detail (IF your backend supports it)
// If not available, we will handle in component using "questions list"
export const getQuestionDetail = (questionId) =>
  api.get(`/admin/quiz/${questionId}/`);

// ✅ Update question (IF your backend supports it)
export const updateQuizQuestion = (questionId, data) =>
  api.put(`/admin/quiz/${questionId}/edit/`, data);

// ✅ Delete question (YOU MUST HAVE BACKEND ENDPOINT)
// If backend doesn't have it, you must add it.
export const deleteQuizQuestion = (questionId) =>
  api.delete(`/admin/quiz/${questionId}/delete/`);
