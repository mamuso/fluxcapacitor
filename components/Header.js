import Link from "next/link";

const Header = () => (
  <div>
    <Link href="/">
      <a>Home</a>
    </Link>
    <Link href="/reports">
      <a>Reports</a>
    </Link>
  </div>
);

export default Header;
