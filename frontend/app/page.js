"use client"
import Image from "next/image";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { useRouter } from 'next/navigation'
import { assets } from "@/Assets/assets";

export default function Home() {

  const router = useRouter()
  const [posts, setPosts] = useState([]);
  const getPosts = async () => {
    const response = await fetch(`http://localhost:8000/api/v1/cards`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('token'),
      },
    });

    const json = await response.json();
    setPosts(json.data);
  };
  useEffect(() => {
    if (localStorage.getItem('token')) {
      getPosts();
    }
    else {
      router.push('/login')
    }
    // eslint-disable-next-line
  }, [])

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

  return (
    <div className="mx-auto my-4">
      <div className="flex flex-col w-[32rem] gap-6 border-x-[1px] border-gray-500">
        {posts.map((post) => {
          return (<div key={post._id} className="w-full bg-white">
            <div className="flex flex-row items-center text-center gap-3 pb-2">
              <Image src={assets.user} width={40} height={40} className="rounded-lg" alt="User_Icon" />
              <Link href="">{post.owner.username}</Link>
            </div>
            <div className="flex flex-col gap-2 justify-center items-center border-y-[1px] border-gray-500">
              {detectCloudinaryFileType(post.file) == "image" && <img src={post.file} className="w-[100%] h-[95%]" alt="Post_Image" />}
              {detectCloudinaryFileType(post.file) == "video" && <video src={post.file} />}
            </div>
            <Link href="" className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold pl-2">
                <span className="font-medium gap-5">
                  <span>{(new Date(post.createdAt).toLocaleString(undefined, { timeZone: 'Asia/Kolkata' })).split(",")[0]}</span>
                </span> {post.title}
              </h2>
              <p>{post.description.length > 150 ? post.description.substring(0, 150) + "..." : post.description}</p>
            </Link>
          </div>);
        })}


      </div>
    </div>
  );
}
