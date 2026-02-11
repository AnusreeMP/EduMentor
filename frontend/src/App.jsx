import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useContext } from "react";
import { ThemeContext } from "./context/ThemeContext";

/* ✅ PUBLIC PAGES */
import Landing from "./pages/Landing";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

/* ✅ STUDENT PAGES */
import Courses from "./pages/courses/Courses";
import CourseDetail from "./pages/courses/CourseDetail";
import Progress from "./pages/courses/Progress";
import ModuleDetail from "./pages/module/ModuleDetail";
import QuizPage from "./pages/quiz/QuizPage";
import StudentDashboard from "./pages/student/StudentDashboard";
import LessonPlayer from "./pages/lesson/LessonPlayer";
import Certificate from "./pages/certificate/Certificate";

/* ✅ ADMIN PAGES */
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";

import AdminCourses from "./pages/admin/Courses/AdminCourses";
import AddCourse from "./pages/admin/Courses/AddCourse";
import EditCourse from "./pages/admin/Courses/EditCourse";

import AdminModules from "./pages/admin/Modules/AdminModules";
import AddModule from "./pages/admin/Modules/AddModule";
import EditModule from "./pages/admin/Modules/EditModule";

import ManageUsers from "./pages/admin/Users/ManageUsers";

import Lessons from "./pages/admin/Lessons/Lessons";
import AddLesson from "./pages/admin/Lessons/AddLesson";
import EditLesson from "./pages/admin/Lessons/EditLesson";

import AdminLessons from "./pages/admin/Lessons/AdminLessons";

/* ✅ COMPONENTS */
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";


/*quiz*/
import AdminQuiz from "./pages/admin/Quiz/AdminQuiz";
import AddQuiz from "./pages/admin/Quiz/AddQuiz";
import EditQuiz from "./pages/admin/Quiz/EditQuiz";


/* ✅ LAYOUT WRAPPER */
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
      <div className="pt-16">{children}</div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* ========================================================= */}
          {/* ✅ PUBLIC ROUTES */}
          {/* ========================================================= */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ========================================================= */}
          {/* ✅ STUDENT ROUTES */}
          {/* ========================================================= */}
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
            path="/student/dashboard"
            element={
              <ProtectedRoute>
                <StudentDashboard />
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




          <Route
            path="/lessons/:lessonId"
            element={
              <ProtectedRoute>
                <LessonPlayer />
              </ProtectedRoute>
            }
          />

          <Route
            path="/courses/:courseId/certificate"
            element={
              <ProtectedRoute>
                <Certificate />
              </ProtectedRoute>
            }
          />

          {/* ========================================================= */}
          {/* ✅ ADMIN ROUTES (Nested Layout ✅) */}
          {/* ========================================================= */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            {/* ✅ ADMIN DASHBOARD */}
            <Route path="dashboard" element={<AdminDashboard />} />

            {/* ✅ COURSES */}
            <Route path="courses" element={<AdminCourses />} />
            <Route path="courses/add" element={<AddCourse />} />
            <Route path="courses/:id/edit" element={<EditCourse />} />

            {/* ✅ MODULES */}
            <Route path="courses/:courseId/modules" element={<AdminModules />} />
            <Route path="courses/:courseId/modules/add" element={<AddModule />} />
            <Route path="modules/:moduleId/edit" element={<EditModule />} />

            {/* ✅ MODULE LESSONS (✅ correct flow Course → Module → Lessons) */}
            <Route
              path="courses/:courseId/modules/:moduleId/lessons"
              element={<AdminLessons />}
            />
            <Route
              path="courses/:courseId/modules/:moduleId/lessons/add"
              element={<AddLesson />}
            />
            <Route
              path="courses/:courseId/modules/:moduleId/lessons/edit/:lessonId"
              element={<EditLesson />}
            />


            {/* ✅ USERS */}
            <Route path="users" element={<ManageUsers />} />

            {/*  Quiz */}
            <Route path="courses/:courseId/modules/:moduleId/quiz" element={<AdminQuiz />} />
            <Route path="courses/:courseId/modules/:moduleId/quiz/add/:quizId" element={<AddQuiz />} />
            <Route path="courses/:courseId/modules/:moduleId/quiz/edit/:questionId" element={<EditQuiz />} />



          </Route>

        </Routes>
      </Layout>
    </BrowserRouter >
  );
}
