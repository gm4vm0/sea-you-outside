"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoFishOutline, IoPersonCircleOutline } from "react-icons/io5";
import { BsListTask } from "react-icons/bs";
import { AiOutlineShop } from "react-icons/ai";

const LINKS = [
  { href: "/dares", label: "Dares", Icon: BsListTask },
  { href: "/sea", label: "Sea", Icon: IoFishOutline },
  { href: "/shop", label: "Shop", Icon: AiOutlineShop },
  { href: "/settings", label: "Me", Icon: IoPersonCircleOutline },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main"
      className="sticky bottom-0 flex items-center justify-center border-t border-sky-500 bg-white px-5 py-1"
    >
      <ul className="flex w-screen justify-between">
        {LINKS.map(({ href, label, Icon }) => {
          const current = pathname.startsWith(href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={current ? "page" : undefined}
                className={`flex min-h-11 min-w-11 flex-col items-center justify-center rounded-lg px-2 text-sm focus-visible:outline-2 focus-visible:outline-sky-700 ${
                  current ? "font-bold text-sky-800" : "text-slate-700"
                }`}
              >
                <Icon aria-hidden="true" className="size-6 text-sky-700" />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
