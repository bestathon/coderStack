"use client"
import Link from 'next/link'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

const page = () => {
    const [credentials, setCredentials] = useState({ email: "", password: "" });
    const router = useRouter()

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch("http://localhost:8000/api/v1/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: credentials.email, password: credentials.password }),
        });
        const json = await response.json();
        console.log(json);
        if (json.success) {
            // save the auth token
            localStorage.setItem('token', json.authToken);
            router.push('/')
            console.log("Login successfully");
            
        }
        else {
            console.log("FAILED! Login UNsuccessfully");

        }
    }

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }
    return (
        <div className='flex flex-col gap-10 m-auto justify-center items-center'>
            <h2 className='font-bold text-4xl '>Welcome To CoderStack!</h2>
            <form className='flex flex-col gap-2' onSubmit={handleSubmit}>
                <div className="mb-3">
                    <input type="email" className="form-control border-2 border-[#848484] p-3 rounded-sm w-80" placeholder='Email' value={credentials.email} onChange={onChange} id="email" name="email" />
                </div>
                <div className="mb-3">
                    <input type="password" className="form-control border-2 border-[#848484] p-3 rounded-sm w-80" placeholder='Password' value={credentials.password} onChange={(onChange)} id="password" name='password' />
                </div>

                <button type="submit" className="btn bg-red-500 px-4 py-2 text-lg text-white border rounded-md">Login</button>
            </form>

            <div className='h-[0.5px] bg-slate-500 w-1/2'></div>
            <div className='w-full text-center text-[16px] flex flex-row justify-center'><p>Not on CoderStack yet? </p> <Link href='/signup' className='pl-1 font-semibold underline'> Sign Up</Link></div>
        </div>

    )
}

export default page