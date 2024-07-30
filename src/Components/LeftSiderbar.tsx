import React from "react";
import UserProfile from "./UI/UserProfile";
import useStore from "../store/useUser";
import { Link } from "react-router-dom";
import LogoutButton from "./UI/LogoutButton";

const LeftSiderbar = () => {
  const user = useStore((state) => state.user);
  

  if (!user) return <>User Not Found</>;
  return (
    <div className="w-full flex flex-col justify-between height_without_header">
      <div className="mt-10 lg:mt-2 text-chessLight">
        <UserProfile image={user.image} displayName={user.displayName} />
        <nav className="p-4">
          <ul>
            <li className="mb-4">
              <Link to="/">Play</Link>
            </li>
            <li className="mb-4">
              <Link to="/mygames">My games</Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="p-2 py-8 text-chessLight">
        <LogoutButton />
      </div>
    </div>
  );
};

export default LeftSiderbar;
