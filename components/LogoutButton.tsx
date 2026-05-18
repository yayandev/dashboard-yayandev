"use client";

import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const logout = () => {
    Cookies.remove("token");

    router.push("/auth/login");
  };

  return (
    <button
      onClick={logout}
      className="flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 hover:bg-[#f8f8f8] w-full text-left text-sm text-[#4c4546]"
    >
      Sign Out
    </button>
  );
}
