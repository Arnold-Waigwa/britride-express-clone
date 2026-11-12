import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import CreateRide from "./pages/CreateRide.tsx";
import MyRides from "./pages/MyRides.tsx";

import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/rides" replace /> },
  { path: "/rides", element: <App /> },
  {
    path: "/create-ride",
    element: <CreateRide />,
  },
  { path: "/my-rides", element: <MyRides /> },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
