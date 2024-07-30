import React from "react";
import useStore from "../store/useUser";
import LoginBlock from "./LoginBlock";
import UserProfile from "./UI/UserProfile";
import NewGameGrid from "./UI/NewGameGrid";

const RightSidebar = () => {
  const user = useStore((state) => state.user);
  return (
    <div className='w-full md:w-2/6 mt-4 md:mt-0'>

          {/* <Chat /> */}
          <NewGameGrid />
        

    </div>
  );
};

export default RightSidebar;
