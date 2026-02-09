import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="px-1 min-h-screen w-full flex items-center justify-center bg-[#09090b] relative overflow-hidden">
      

      
      <div className="absolute -top-20 -left-20 w-150 h-150 bg-purple-600/20 rounded-full blur-[100px] animate-pulse"></div>

      <div className="absolute -bottom-20 -right-20 w-150 h-150 bg-pink-600/20 rounded-full blur-[100px] animate-pulse"></div>

      <div className="relative z-10 w-full max-w-md p-4">
        <Outlet />
      </div>

    </div>
  );
}