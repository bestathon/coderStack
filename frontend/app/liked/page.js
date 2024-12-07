'use client'
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'

const page = () => {
  const router = useRouter()
  useEffect(() => {
    if (localStorage.getItem('token')) {
      // getNotes();
    }
    else {
      router.push('/login')
    }
    // eslint-disable-next-line
  }, [])
  return (
    <div>page</div>
  )
}

export default page
