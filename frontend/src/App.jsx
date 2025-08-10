import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './Pages/Home/home'
import { Login } from './Pages/Auth/Login/login'
import Signup from './Pages/Auth/SignUp/signup'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login/>} />
          <Route path='/signUp' element={<Signup />} />

        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
