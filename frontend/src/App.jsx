import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useContext } from "react";
import { ThemeContext } from "./context/ThemeContext";

import Landing from "./pages/Landing";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import Courses from "./pages/courses/Courses";
import CourseDetail from "./pages/courses/CourseDetail";
import Progress from "./pages/courses/Progress";
import ModuleDetail from "./pages/module/ModuleDetail";
import QuizPage from "./pages/quiz/QuizPage";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCourses from "./pages/admin/Courses/AdminCourses";
import AddCourse from "./pages/admin/Courses/AddCourse";
import EditCourse from "./pages/admin/Courses/EditCourse";
import AdminModules from "./pages/admin/Modules/AdminModules";
import AddModule from "./pages/admin/Modules/AddModule";
import EditModule from "./pages/admin/Modules/EditModule";
import ManageUsers from "./pages/admin/Users/ManageUsers";
import AdminLessons from "./pages/admin/Lessons/AdminLessons";
import AddLesson from "./pages/admin/Lessons/AddLesson";
import EditLesson from "./pages/admin/Lessons/EditLesson";



function Layout({ children }) {
  const location = useLocation();
  const { dark } = useContext(ThemeContext);

  const hideNavbar = ["/login", "/register"].includes(location.pathname);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: dark ? "#111827" : "#ffffff",
        color: dark ? "#e5e7eb" : "#111827",
      }}
    >
      {!hideNavbar && <Navbar />}
      {children}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* 🌐 PUBLIC */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* 👩‍🎓 STUDENT */}
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
            path="/courses/:courseId/modules/:moduleId"
            element={
              <ProtectedRoute>
                <ModuleDetail />
              </ProtectedRoute>
            }
          />

          <Route
            path="/courses/:courseId/modules/:moduleId/quiz"
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

          {/* 🛠 ADMIN (ROLE BASED) */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="courses" element={<AdminCourses />} />
            <Route path="courses/add" element={<AddCourse />} />
            <Route path="courses/:id/edit" element={<EditCourse />} />

            {/* ✅ MODULE MANAGEMENT */}
            <Route path="courses/:courseId/modules" element={<AdminModules />} />
            <Route path="courses/:courseId/modules/add" element={<AddModule />} />
            <Route path="modules/:moduleId/edit" element={<EditModule />} />

            <Route path="users" element={<ManageUsers />} />
          </Route>
          <Route path="/admin/courses" element={<AdminRoute><AdminCourses /></AdminRoute>} />
          <Route path="/admin/courses/add" element={<AdminRoute><AddCourse /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><ManageUsers /></AdminRoute>} />
          <Route path="/admin/courses/:courseId/modules" element={<AdminRoute><AdminModules /></AdminRoute>} />
          <Route path="/admin/courses/:courseId/modules/add" element={<AddModule />} />
          <Route path="/admin/courses/:courseId/modules/edit/:moduleId" element={<EditModule />} />
          <Route path="/admin/modules/:moduleId/lessons" element={<AdminLessons />} />
          <Route path="/admin/modules/:moduleId/lessons/add" element={<AddLesson />} />
          <Route path="/admin/modules/:moduleId/lessons/edit/:lessonId" element={<EditLesson />} />






        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
