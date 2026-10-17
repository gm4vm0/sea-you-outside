import Link from "next/link";

export default function Nav() {
  return (
    <nav className="border-t-2">
      <ul className="flex justify-between">
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/sea">Sea</Link>
        </li>
        <li>
          <Link href="upload">Upload</Link>
        </li>
        <li>
          <Link href="/dares">Dares</Link>
        </li>
        <li>
          <Link href="/shop">Shop</Link>
        </li>
      </ul>
    </nav>
  );
}
