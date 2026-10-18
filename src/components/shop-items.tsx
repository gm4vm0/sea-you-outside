// import Image from "next/image";
import { Fish } from "@/lib/types";
export default function ShopItem({ fish }: { fish: Fish }) {
  return (
    <>
      <div className="mx-2 px-3">
        {/* <Image
        src={"/image1.jpg"}
        alt={fish.name || "Gallery item"}
        width={30}
        height={30}
        className=""
      /> */}
        <p className="text-5xl text-center">{fish.emoji}</p>
      </div>
      <div className="flex flex-col justify-center items-center">
        {/* Top angled surface */}
        <div
          className="h-3 w-full rounded-t-md rounded-b-sm bg-blue-800"
          style={{
            transform: "perspective(250px) rotateX(25deg)",
            transformOrigin: "bottom",
          }}
        />
        {/* Cast shadow against the wall */}
        <div className="w-[80%] h-25 bg-sky-50 flex flex-col items-center justify-center ">
          <p className="text-center">{fish.name}</p>
          <p>{fish.price} points</p>
        </div>
        <div className="h-2 w-[80%] rounded-full bg-black/5 blur-sm" />
      </div>
    </>
  );
}
