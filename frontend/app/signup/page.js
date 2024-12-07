"use client"
import { assets } from '@/Assets/assets';
import Image from 'next/image';
import Link from 'next/link'
import React, { useState } from 'react'

const page = () => {
    const [credentials, setCredentials] = useState({ name: "", email: "", password: "", cpassword: "", image: "" });

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }
    return (
        <div className='flex flex-col gap-10 m-auto justify-center items-center'>
            <h2 className='font-bold text-4xl '>Welcome To CoderStack!</h2>
            <form className='flex flex-col gap-2' onSubmit={() => { }}>

                <div className="mb-3">
                    <input type="text" className="form-control border-2 border-[#848484] p-3 rounded-sm w-80" placeholder='Name' value={credentials.name} onChange={onChange} id="name" name="name" />
                </div>
                <div className="mb-3">
                    <input type="email" className="form-control border-2 border-[#848484] p-3 rounded-sm w-80" placeholder='Email' value={credentials.email} onChange={onChange} id="email" name="email" />
                </div>
                <div className="mb-3">
                    <input type="password" className="form-control border-2 border-[#848484] p-3 rounded-sm w-80" placeholder='Password' value={credentials.password} onChange={onChange} id="password" name="password" />
                </div>
                <div className="mb-3">
                    <input type="password" className="form-control border-2 border-[#848484] p-3 rounded-sm w-80" placeholder='Confirm Password' value={credentials.cpassword} onChange={(onChange)} id="cpassword" name='cpassword' />
                </div>

                <button type="submit" className="btn bg-red-500 px-4 py-2 text-lg text-white border rounded-md">Signup</button>
            </form>

            <div className='h-[0.5px] bg-slate-500 w-1/2'></div>
            <div className='w-full text-center text-[16px] flex flex-row justify-center'><p>Already sign up, click here to </p> <Link href='/login' className='pl-1 font-semibold underline'> Login</Link></div>
        </div>

    )
}

export default page