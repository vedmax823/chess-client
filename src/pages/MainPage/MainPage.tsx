import React from "react";

import MiddlePart from "../../Components/MiddlePart";
import RightSidebar from "../../Components/RightSidebar";

const MainPage = () => {
  return (
    <div className="w-full flex flex-col-reverse md:flex-row mt-4 xl:mt-2 flex-wrap">
      <MiddlePart />
      <RightSidebar />
    </div>
  );
};

export default MainPage;
