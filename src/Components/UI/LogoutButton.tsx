import React from "react";
import useStore from "../../store/useUser";

const LogoutButton = () => {
  const logout = useStore((state) => state.logout);
  return (
    <div>
      <button
        onClick={logout}
        className="w-full right-4 p-2 rounded-lg shadow-md border-chessGreen border hover:bg-gray-300 hover:text-stone-900 "
      >
        <div className="flex justify-between items-center">
          Log out
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-10V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2h4a2 2 0 002-2v-1"
            />
          </svg>
        </div>
      </button>
    </div>
  );
};

export default LogoutButton;
