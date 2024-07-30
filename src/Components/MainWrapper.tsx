import React, { FC, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import useStore from "../store/useUser";
import Header from "./UI/Header";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faBars } from "@fortawesome/free-solid-svg-icons";
import LeftSiderbar from "./LeftSiderbar";
import { Helmet } from "react-helmet";

import kingLogo from "../assets/white-king.png"

const MainWrapper: FC = () => {
  const fetchUser = useStore((state) => state.fetchUser);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <React.Fragment>
      <Helmet>
      <title>
        VeeChess</title>
        {/* <meta property="og:image" content={`${process.env.REACT_APP_PUBLIC_URL}/meta-image.jpg`} /> */}
        <link rel="icon" href={`${process.env.REACT_APP_PUBLIC_URL}/favicon.png`} />

      
      </Helmet>
      <div className="h-screen ">
        <Header />
        <div className="flex flex-1 pt-16">
          <aside
            className={`bg-chessDark2 height_without_header fixed top-16 z-10 px-2 transition-transform duration-300 ${
              isMenuOpen
                ? "transform-none"
                : "-translate-x-full lg:translate-x-0"
            } lg:block`}
          >
            <LeftSiderbar />
          </aside>

          <main className="flex-1 lg:ml-64 p-4 overflow-y-auto">
            <button
              className="lg:hidden px-3 py-2 bg-chessDark2 text-white fixed top-16 left-2 z-20 m-2 rounded-lg"
              onClick={toggleMenu}
            >
              {isMenuOpen ? (
                <FontAwesomeIcon icon={faXmark} />
              ) : (
                <FontAwesomeIcon icon={faBars} />
              )}
            </button>
            <Outlet />
          </main>
        </div>
      </div>
    </React.Fragment>
  );
};

export default MainWrapper;
