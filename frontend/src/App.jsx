import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './Pages/Home/home'
import AuthForm from './Pages/Auth/SignUp/signup'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/register' element={<AuthForm />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
