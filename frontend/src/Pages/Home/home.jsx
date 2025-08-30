import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const Home = () => {
  const UserData  = useSelector((state) => state?.user)
  console.log("UserData", UserData.user)
  return (
    <div className='h-[100vh] w-100 flex flex-col justify-center items-center'>
      <h1>Go to chat page</h1>
      {UserData?.user ? <h2>Welcome, {UserData?.user?.userName}</h2> : <h2>Please log in</h2>}
      <button className='mt-4 px-4 py-2 bg-blue-500 text-white rounded'>
        <Link to="/chatPage">Go to Chat Page</Link>
      </button>
      </div>
  )
}

export default Home