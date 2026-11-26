import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthLayout from "@/layouts/AuthLayout";
import DashboardLayout from "@/layouts/DashboardLayout";
import ProtectedRoute from "@/routes/ProtectedRoute";
import PublicRoute from "@/routes/PublicRoute";

const LoginPage = lazy(() => import("@/features/auth/pages/LoginPage"));
const RegisterPage = lazy(() => import("@/features/auth/pages/RegisterPage"));
const ForgotPasswordPage = lazy(
  () => import("@/features/auth/pages/ForgotPasswordPage")
);
const ResetPasswordPage = lazy(
  () => import("@/features/auth/pages/ResetPasswordPage")
);
const ProjectsPage = lazy(() => import("@/pages/ProjectsPage"));
const ProjectDetailsPage = lazy(() => import("@/pages/ProjectDetailsPage"));
const TasksPage = lazy(() => import("@/pages/TasksPage"));
const AssistantPage = lazy(() => import("@/pages/AssistantPage"));
const NotificationsPage = lazy(() => import("@/pages/NotificationsPage"));
const DashboardPage = lazy(() => import("@/pages/DashboardPage"));
const WorkspacePage = lazy(() => import("@/pages/WorkspacePage"));
const KanbanPage = lazy(() => import("@/pages/KanbanPage"));
const CalendarPage = lazy(() => import("@/pages/CalendarPage"));
const DocumentsPage = lazy(() => import("@/pages/DocumentsPage"));
const SettingsPage = lazy(() => import("@/pages/SettingsPage"));
const ProfilePage = lazy(() => import("@/pages/ProfilePage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));
const StatusPage = lazy(() => import("@/pages/StatusPage"));

const RouteLoading = () => (
  <div
    className="grid min-h-[50vh] place-items-center"
    role="status"
    aria-label="Loading page"
  >
    <span className="size-8 animate-spin rounded-full border-2 border-muted border-t-primary" />
  </div>
);

const AppRouter = () => (
  <BrowserRouter>
    <Suspense fallback={<RouteLoading />}>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/workspace" element={<WorkspacePage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:projectId" element={<ProjectDetailsPage />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/assistant" element={<AssistantPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/kanban" element={<KanbanPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/documents" element={<DocumentsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>

        <Route path="/500" element={<StatusPage kind="error" />} />
        <Route path="/offline" element={<StatusPage kind="offline" />} />
        <Route path="/maintenance" element={<StatusPage kind="maintenance" />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
);

export default AppRouter;
