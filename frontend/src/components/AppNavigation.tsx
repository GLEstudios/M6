import Link from "next/link";
import styles from "@/styles/Nav.module.css";

export default function AppNavigation({}) {
  return (
    <ul className={styles.linkArea}>
      <li>
        <Link href={"/dashboard"}>My Dashboard</Link>
      </li>
    </ul>
  );
}
