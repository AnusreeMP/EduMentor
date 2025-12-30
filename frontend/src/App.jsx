import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import Courses from "./pages/courses/Courses";
import CourseDetail from "./pages/courses/CourseDetail";
import Progress from "./pages/courses/Progress";

import ModuleDetail from "./pages/module/ModuleDetail";
import QuizPage from "./pages/quiz/QuizPage";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";


function Layout({ children }) {
  const location = useLocation();
  const hideNavbar = ["/login", "/register"].includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}
      {children}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>

          {/* 🔓 Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* 🔐 Protected routes */}
          <Route
            path="/courses"
            element={
              <ProtectedRoute>
                <Courses />
              </ProtectedRoute>
            }
          />

          <Route
            path="/courses/:courseId"
            element={
              <ProtectedRoute>
                <CourseDetail />
              </ProtectedRoute>
            }
          />

          <Route
            path="/modules/:moduleId"
            element={
              <ProtectedRoute>
                <ModuleDetail />
              </ProtectedRoute>
            }
          />

          <Route
            path="/courses/:courseId/modules/:moduleId"
            element={<ModuleDetail />}
          />

          <Route
            path="/courses/:courseId/modules/:moduleId/quiz"
            element={<QuizPage />}
          />







          <Route
            path="/quiz/:quizId"
            element={
              <ProtectedRoute>
                <QuizPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/progress/:courseId"
            element={
              <ProtectedRoute>
                <Progress />
              </ProtectedRoute>
            }
          />

        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
