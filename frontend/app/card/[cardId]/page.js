"use client"
import React, { useEffect, useState } from 'react'
import axios from 'axios';

const page = ({ params }) => {

  const detectCloudinaryFileType = (cloudinaryUrl) => {
    try {
      // Check resource type in the URL
      const urlParts = cloudinaryUrl.split("/");
      const resourceType = urlParts[4]; // Typically, resource type is at index 4

      // Check file extension
      const fileExtension = cloudinaryUrl.split(".").pop().toLowerCase();

      const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp"];
      const videoExtensions = ["mp4", "mov", "avi", "webm"];

      if (resourceType === "image" || imageExtensions.includes(fileExtension)) return "image";
      if (resourceType === "video" || videoExtensions.includes(fileExtension)) return "video";

      return "unknown"; // If neither matches
    } catch (error) {
      console.error("Error detecting file type:", error.message);
      return null;
    }
  };

  const [title, setTitle] = useState("");
  const [file, setFile] = useState("");
  const [desc, setdesc] = useState("");

  const fetchBlogData = async () => {
    const cardId = await params;
    // const response = await axios.get(`http://localhost:8000/api/v1/cards/$`, {
    // params: {
    //   id: params.id
    // }
    // });
    // setData(response.data);
    const value = Object.values(cardId)
    const response = await axios.get(`http://localhost:8000/api/v1/cards/${value[0]}`);
    // console.log(datśa);
    // console.log(data);
    // console.log(response);
    var data = String(response.data.data.title);
    var data1 = String(response.data.data.file);
    var data2 = String(response.data.data.description);
    // data1 = response.data.data.title;
    console.log(data);
    console.log(data1);
    console.log(data2);
    setTitle(data);
    setFile(data1);
    setdesc(data2);
    // data2 = response.data.data.title;
    // print(data,data1,data2)
  }

  useEffect(() => {
    fetchBlogData();
  }, []);

  return (
    <div className='my-2'>
      <div className='mx-auto px-20 items-center justify-center flex flex-col gap-4'>
        <h1 className='text-4xl font-bold'>{title}</h1>
        {detectCloudinaryFileType(file) == "image" && <img src={file} alt="data_Image" className='w-[30rem] h-80' />}
        {detectCloudinaryFileType(file) == "video" && <video src={file} controls />}
        <p className='px-40'>{desc}</p>
      </div>
    </div>
  )
}

export default page