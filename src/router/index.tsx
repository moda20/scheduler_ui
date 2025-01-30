import { Outlet, RouterProvider } from "react-router"
import { NavLink, createBrowserRouter } from "react-router-dom"
import MainPage from "@/app/dashboard/mainPage"
import App from "@/App"
import JobsPage from "@/features/jobsTable/jobsPage"
import Dashboard from "@/features/dashboard/dashboard"
import DatabaseDashboard from "@/features/system/database"

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainPage />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "/jobs",
        index: true,
        element: <JobsPage />,
      },
      {
        path: "/db_backups",
        index: true,
        element: <DatabaseDashboard />,
      },
    ],
  },
])

export default router
