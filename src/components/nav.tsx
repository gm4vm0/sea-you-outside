import Link from "next/link";
import { IoFishOutline } from "react-icons/io5";
import { BsListTask } from "react-icons/bs";
import { AiOutlineShop } from "react-icons/ai";

export default function Nav() {
  return (
    <nav className="flex justify-center items-center sticky bottom-0 bg-white border-t border-sky-500 py-1 px-5  h-[7vh]">
      <ul className="flex justify-between w-screen">
        <li>
          <Link className="text-sm flex flex-col items-center" href="/dares">
            <BsListTask className="text-sky-500 size-6" />
            Dares
          </Link>
        </li>

        <li>
          <Link className="text-sm flex flex-col items-center" href="/sea">
            <IoFishOutline className="text-sky-500 size-6" />
            Sea
          </Link>
        </li>
        <li>
          <Link className="text-sm flex flex-col items-center" href="/shop">
            <AiOutlineShop className="text-sky-500 size-6" />
            Shop
          </Link>
        </li>
      </ul>
    </nav>
  );
}
