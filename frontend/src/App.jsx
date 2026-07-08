import { lazy, Suspense } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Home from "./Pages/Home/home";
import { useDispatch, useSelector } from "react-redux";
const ChatInterface = lazy(() => import("./Pages/ChatPage/ChatPage"));
import Cookies from "js-cookie";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { login } from "./redux/slices/userSlice";
const Login = lazy(() => import("./Pages/Auth/Login/Login"));
const AuthForm = lazy(() => import("./Pages/Auth/SignUp/Signup"));

function App() {
  const UserData = useSelector((state) => state?.user);
  const GetToken = Cookies.get("token");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!GetToken) return;

    try {
      const TokenDecoded = jwtDecode(GetToken);
      dispatch(login(TokenDecoded));
    } catch (error) {
      console.log("Invalid token:", error);
      Cookies.remove("token", { path: "/" });
    }
  }, [GetToken, dispatch]);

  useEffect(() => {
    const publicRoutes = ["/login", "/register"];

    if (UserData?.user?._id) {
      if (publicRoutes.includes(location.pathname)) {
        navigate("/");
      }
      return;
    }

    if (!publicRoutes.includes(location.pathname)) {
      navigate("/login");
    }
  }, [UserData, location.pathname, navigate]);

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chatPage" element={<ChatInterface />} />
          <Route path="/register" element={<AuthForm />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
