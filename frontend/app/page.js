import { assets } from "@/Assets/assets";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="mx-auto my-2">
      <div className="flex flex-col w-[30rem] p-2 gap-6">
        <div className="w-full bg-white">
          <div className="flex flex-row items-center text-center gap-3 pb-2">
            <Image src={assets.user} width={40} height={40} className="rounded-lg" alt="User_Icon" />
            <Link href="">username</Link>
          </div>
          <div className="flex flex-col gap-2 justify-center items-center">
            <Image src={assets.img} alt="" />
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-semibold pl-4">Khelega firefree max</h2>
            <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eaque, accusamus. Saepe nisi velit ratione ullam deleniti aliquid. Corporis laborum voluptas quas! Inventore, voluptates sed deleniti ipsa, sit amet iusto omnis, quisquam dolor quae ea.</p>
            <Link href="" className="bg-black py-2 px-4 text-white w-fit">Read More</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
