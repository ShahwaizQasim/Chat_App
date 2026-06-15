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
        <h2 className="text-2xl">
          Welcome <span className="font-bold">{UserData?.user?.user}👋</span>
        </h2>
      ) : (
        <h2>Please log in</h2>
      )}
      <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded transform hover:scale-95 transition">
        <Link to="/chatPage">Go to Chat Page</Link>
      </button>
      <button
        onClick={() => handleLogout()}
        className="border font-semibold border-black p-2 px-3 mt-5 rounded hover:bg-black hover:text-white transition transform hover:scale-95"
      >
        Logout
      </button>
    </div>
  );
};

export default Home;
