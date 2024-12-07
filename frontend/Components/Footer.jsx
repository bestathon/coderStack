import Image from 'next/image'
import React from 'react'

const Footer = () => {
  return (
    <div className='flex justify-around flex-col gap-2 sm:gap-0 sm:flex-row bg-black py-5 items-center'>
      <p className='text-sm text-white'>All right reserved. Copyright @blogger</p>
      <div className='flex'>
        <a href="">
        <img src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/x-social-media-logo-icon.png" width="44" height="44" alt="X Social Media Logo icon" title="X Social Media Logo icon">
        </a>
      </div>
    </div>
  )
}

export default Footer