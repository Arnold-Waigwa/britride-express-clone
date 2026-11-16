import { Outlet, useLoaderData } from "react-router-dom";
import type { requireAuth } from "@/loaders/authLoader";

const ProtectedLayout = () => {
  const user = useLoaderData<typeof requireAuth>();
  return <Outlet context={user} />;
};

export default ProtectedLayout;
