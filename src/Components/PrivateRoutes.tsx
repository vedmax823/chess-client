
import { useEffect } from "react";
import useStore from "../store/useUser";
import { Outlet } from "react-router-dom";
// import { router } from "../routes/route";
import LoginPage from "../pages/LoginPage/LoginPage";

const PrivateRoutes = () => {
  const fetchUser = useStore((state) => state.fetchUser);
  const user = useStore((state) => state.user);
    
    // const { authLogin } = /* some auth state provider */;
    useEffect(() => {
      fetchUser();
    }, [fetchUser]);
  
  
    return user 
      ? <Outlet />
      : <LoginPage />
  }

export default PrivateRoutes;