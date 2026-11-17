import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import CreateRide from "./pages/CreateRide.tsx";
import MyRides from "./pages/MyRides.tsx";
import Register from "./pages/Register.tsx";
import Login from "./pages/Login.tsx";

import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { requireAuth } from "./loaders/authLoader.ts";
import ProtectedLayout from "./components/ProtectedLayout.tsx";
import RouteError from "./components/RouteError.tsx";

const router = createBrowserRouter([
  { path: "/register", element: <Register /> },
  { path: "/login", element: <Login /> },
  {
    loader: requireAuth,
    element: <ProtectedLayout />,
    errorElement: <RouteError />,
    children: [
      { path: "/", element: <Navigate to="/rides" replace /> },
      { path: "/rides", element: <App /> },
      {
        path: "/create-ride",
        element: <CreateRide />,
      },
      { path: "/my-rides", element: <MyRides /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
