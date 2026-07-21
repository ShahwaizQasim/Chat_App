import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { logout } from "../../redux/slices/userSlice";

const Home = () => {
  const UserData = useSelector((state) => state?.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove("token", { path: "/" });
    dispatch(logout()); // Redux clear karo
    navigate("/login");
  };
  return (
    <div className="h-[100vh] w-100 flex flex-col justify-center items-center">
      {UserData?.user ? (
        <>
          <h2 className="text-2xl">
            Welcome <span className="font-bold">{UserData?.user?.user}👋</span>
          </h2>
          <button
            onClick={() => navigate("/chatPage")}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded transform hover:scale-95 transition"
          >
            Go to Chat Page
          </button>
          <button
            onClick={() => handleLogout()}
            className="border font-semibold border-black p-2 px-3 mt-5 rounded hover:bg-black hover:text-white transition transform hover:scale-95"
          >
            Logout
          </button>
        </>
      ) : (
        <div class="flex flex-col items-center">
          {/* <!-- Loader --> */}
          <div class="w-16 h-16 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
          <p class="mt-6 text-gray-400 text-lg font-medium">Loading...</p>
        </div>
      )}
    </div>
  );
};

export default Home;
