import React from "react"
import { createRoot } from "react-dom/client"
import { Provider } from "react-redux"
import { Toaster } from "@/components/ui/toaster"

import App from "./App"
import { store } from "./app/store"
import "./index.css"
import "./styles/global.css"
import "./styles/scss/index.scss"
import { RouterProvider } from "react-router"
import router from "./router"
import { ThemeProvider } from "@/components/theme-provider"
import { initializeStore } from "@/utils/initializer"
import Authentication from "@/features/auth/authentication"

const container = document.getElementById("root")

if (container) {
  const root = createRoot(container)
  initializeStore()

  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <Toaster />
        <Authentication />
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <RouterProvider router={router} />
        </ThemeProvider>
      </Provider>
    </React.StrictMode>,
  )
} else {
  throw new Error(
    "Root element with ID 'root' was not found in the document. Ensure there is a corresponding HTML element with the ID 'root' in your HTML file.",
  )
}
