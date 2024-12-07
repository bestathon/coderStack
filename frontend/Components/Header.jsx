'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'

const Navbar = () => {
    const pathName = usePathname();
    const router = useRouter()

    const handleLogOut = () => {
        localStorage.removeItem('token');
        router.push('/login')

    }

    const links = [
        { id: 1, name: "Home", path: "/" },
        { id: 2, name: "About", path: "/about" },
    ]

    const localHis = localStorage.getItem('token');

    return (
        <nav className='px-3 py-2 flex flex-row items-center justify-between md:px-6'>
            {localHis ? <div className="hidden lg:flex lg:flex-row lg:items-center gap-5">
                <Link href="/" className='text-2xl font-bold'>CoderStack.com</Link>
            </div> : <div className='text-2xl font-bold cursor-pointer'>CoderStack.com</div>}
            {localHis && <div className="flex flex-row items-center gap-5 justify-around">
                {links.map((item) => (
                    <Link key={item.id} href={item.path} className={pathName === item.path ? "text-red-700" : "text-black"}>{item.name}</Link>
                ))}
            </div>}
            {!localHis ? <Link href="/login" className='hidden lg:flex lg:flex-row lg:items-center gap-5'>
                <div className='border border-3 rounded-md bg-red-500 p-2 text-white hover:cursor-pointer'>Login for free</div>
            </Link> : <button onClick={handleLogOut} className='hidden lg:flex lg:flex-row lg:items-center gap-5'>
                <div className='border border-3 rounded-md bg-red-500 p-2 text-white hover:cursor-pointer'>Logout</div>
            </button>}
        </nav>
    )
}

export default Navbar