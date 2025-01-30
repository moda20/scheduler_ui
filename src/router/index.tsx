import { Outlet, RouterProvider } from "react-router"
import { NavLink, createBrowserRouter } from "react-router-dom"
import MainPage from "@/app/dashboard/mainPage"
import App from "@/App"
import JobsPage from "@/features/jobsTable/jobsPage"
import Dashboard from "@/features/dashboard/dashboard"

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
    ],
  },
])

export default router
