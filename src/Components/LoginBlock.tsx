import React from "react";
import GoogleLogo from "../assets/social/icons8-google.svg";
import FacebookLogo from "../assets/social/icons8-facebook.svg";

const LoginBlock = () => {
  const handleGoogleLogin = () => {
    window.open(`${process.env.REACT_APP_BACKEND_URL}/auth/google`, "_self");
  };
  const handleFacebookLogin = () => {
    window.open(`${process.env.REACT_APP_BACKEND_URL}/auth/facebook`, "_self");
    // window.location.href = 'http://localhost:5000/auth/facebook';
  };
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center text-chessGreen">
          Log in to play online
        </h2>
        <button
          className="flex items-center justify-center w-full bg-white text-gray-700 border border-gray-300 py-2 px-4 rounded mb-4 hover:bg-gray-100 max-w-xs"
          onClick={handleGoogleLogin}
        >
          <div className="flex items-center mr-2">
            <img src={GoogleLogo} alt="Google logo" className="w-8 h-8 mr-2" />
          </div>
          <span className="text-black">Log in with Google</span>
        </button>
        <button
          className="flex items-center justify-center w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          onClick={handleFacebookLogin}
        >
          <img src={FacebookLogo} alt="Google logo" className="w-9 h-9 mr-2" />
          Log in with Facebook
        </button>
      </div>
    </div>
  );
};

export default LoginBlock;
