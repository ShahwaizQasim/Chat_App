import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import Home from './Pages/Home/home'
import { useDispatch, useSelector } from 'react-redux'
import ChatInterface from './Pages/ChatPage/ChatPage'
import Cookies from 'js-cookie'
import { useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'
import { login } from './redux/slices/userSlice'
import Login from './Pages/Auth/Login/Login'
import AuthForm from './Pages/Auth/SignUp/Signup'

function App() {
  const UserData = useSelector((state) => state?.user)
  const GetToken = Cookies.get("token");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (GetToken) {
      const TokenDecoded = jwtDecode(GetToken);
      dispatch(login(TokenDecoded))
    }
  }, [GetToken])

  useEffect(() => {
    if (UserData?.user?._id) {
      navigate("/")
    } else {
      navigate("/login")
    }
  }, [UserData])

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          {/* <Route path='/chatPage' element={UserData?.user ? <ChatInterface />: <Navigate to={'/login'} />} />
           */}
          <Route path='/chatPage' element={<ChatInterface />} />
          <Route path='/register' element={<AuthForm />} />
          <Route path='/login' element={<Login/>} />

        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
