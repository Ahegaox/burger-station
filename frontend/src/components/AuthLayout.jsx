import { Outlet } from "react-router";

import BackgroundOrbs from "./BackgroundOrbs";
import Logo from "./Logo";

export default function AuthLayout() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-4 py-10">
      <BackgroundOrbs variant="strong" />
      <div className="mb-7">
        <Logo />
      </div>
      <Outlet />
    </div>
  );
}