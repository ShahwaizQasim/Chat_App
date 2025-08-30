import React from 'react'
import { useSelector } from 'react-redux'

const Home = () => {
  const UserData  = useSelector((state) => state?.user)
  console.log("UserData", UserData.user)
  return (
    <div className='h-[100vh] w-100 flex flex-col justify-center items-center'>
      <h1>Go to chat page</h1>
      {UserData?.user ? <h2>Welcome, {UserData?.user?.userName}</h2> : <h2>Please log in</h2>}
      </div>
  )
}

export default Home