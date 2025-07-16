import { Outlet, RouterProvider } from "react-router"
import { NavLink, createBrowserRouter } from "react-router-dom"
import MainPage from "@/app/dashboard/mainPage"
import App from "@/App"
import JobsPage from "@/features/jobsTable/jobsPage"
import Dashboard from "@/features/dashboard/dashboard"
import DatabaseDashboard from "@/features/system/database"
import Proxies from "@/features/network/proxies"
import ConfigsDashboard from "@/features/system/configs"
import NotificationServices from "@/features/system/notificationServices"

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
      {
        path: "/proxies",
        index: true,
        element: <Proxies />,
      },
      {
        path: "/configs",
        index: true,
        element: <ConfigsDashboard />,
      },
      {
        path: "/notifications",
        index: true,
        element: <NotificationServices />,
      },
    ],
  },
])

export default router
