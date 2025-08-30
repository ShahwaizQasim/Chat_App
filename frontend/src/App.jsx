import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Home from './Pages/Home/home'
import AuthForm from './Pages/Auth/SignUp/signup'
import Login from './Pages/Auth/Login/login'
import { useSelector } from 'react-redux'

function App() {
  const UserData  = useSelector((state) => state?.user)

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={UserData?.user ? <Home />: <Navigate to={'/login'} />} />:
          <Route path='/register' element={<AuthForm />} />
          <Route path='/login' element={<Login />} />
          
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
