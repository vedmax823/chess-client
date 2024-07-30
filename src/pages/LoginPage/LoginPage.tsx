import React, {useState} from "react";

import Header from "../../Components/UI/Header";
import LoginBlock from "../../Components/LoginBlock";
import MainBlockLoginPage from "./Components/MainBlockLoginPage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";

const LoginPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 pt-16">
      <aside
          className={`bg-chessDark2 height_without_header fixed top-16 z-10 px-2 transition-transform duration-300 ${
            isMenuOpen ? 'transform-none' : '-translate-x-full lg:translate-x-0'
          } lg:block`}
        >
          <LoginBlock />
        </aside>
        <main className="flex-1 lg:ml-64 p-4 overflow-y-auto">
          <button
            className="lg:hidden px-3 py-2 bg-chessDark2 text-white fixed top-16 left-2 z-20 m-2 rounded-lg"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <FontAwesomeIcon icon={faXmark}/> : <FontAwesomeIcon icon={faBars}/>}
          </button>
          <MainBlockLoginPage />
        </main>
      </div>
    </div>
  );
};

export default LoginPage;
