import React from "react";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  return (
    <header className="w-full bg-chessDark text-chessLight flex items-center shadow-md h-16 fixed top-0 z-10 border-b border-gray-600">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/">
          <h1 className="text-2xl font-bold text-chessGreen ml-4 xl:ml-2">
            Chess
          </h1>
        </Link>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <a
                href="https://www.example.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn max
              </a>
            </li>
            <li></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
