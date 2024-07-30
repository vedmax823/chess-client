
import {
    createBrowserRouter
} from "react-router-dom";

import GamePage from "../pages/GamePage/GamePage";
import MainWrapper from "../Components/MainWrapper";
import MainPage from "../pages/MainPage/MainPage";
import { RouteObject } from "react-router-dom";
import PrivateRoutes from "../Components/PrivateRoutes";
import LoginPage from "../pages/LoginPage/LoginPage";
import MyGames from "../pages/MyGamesPage/MyGames";

export const privateRoutes: RouteObject[] = [
  {path : "/",
    element : <MainWrapper/>,
    children : [
      {
        path : "live/:gameId",
        element: <GamePage />,
      },
      {
        path : "/",
        element: <MainPage />,
      },
      {
        path : 'mygames',
        element : <MyGames />
      },
      {
        path : "*",
        element : <div className="w-full height_without_header flex justify-center items-center">Page Not Found</div>
      }
    ]
  }

]




  const routes: RouteObject[] = [
    {
      path: '/',
      element: <PrivateRoutes/>,
      children : [
        ...privateRoutes
      ]
    },

    {
      path : '/login',
      element : <LoginPage />
    }

  ];



  
  
  export const router = createBrowserRouter(routes);