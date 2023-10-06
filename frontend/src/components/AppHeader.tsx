import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "@/styles/Nav.module.css";
import AppNavigation from "./AppNavigation";
import { useUser } from "@/context/UserContext";
import { magic } from "@/lib/magic";
import LoginWithMagic from './LoginWithMagic'; // Import the LoginWithMagic component
// import { handleMagicLogin } from '../lib/magicUtils'; // Commented out as it's not used currently

export default function AppHeader({ children }) {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const { user, setUser } = useUser();

  // Reference to the navigation menu
  const navMenuRef = useRef(null);

  const handleLogout = async () => {
    try {
      await magic.user.logout();
      setUser({ isLoggedIn: false });
    } catch (error) {
      console.error("Error logging out:", error.message);
      // Optionally, show an error message to the user.
    }
  };

  // Commented out as it's not used currently
  /*
  const handleSignInClick = () => {
    const emailAddress = prompt("Please enter your email address:");
    if (emailAddress) {
        handleMagicLogin(setUser, initializeWeb3, web3, emailAddress);
    }
  };
  */

  return (
    <header className={styles.header}>
      <nav className={"container custom-blue " + styles.wrapper} ref={navMenuRef}>
        <section className={styles.staticArea}>
          <Link href={"/"} passHref>
            <div className="flex space-x-3 cursor-pointer">
                <Image src={"/img/tplay.png"} width={120} height={47} alt="Total.play" />
                <span className="badge">demo</span>
            </div>
          </Link>

          <button onClick={() => setNavbarOpen(!navbarOpen)} className={styles.burger}>
            {navbarOpen ? (
              <Image src={"/img/close.svg"} width={24} height={24} alt="Close" />
            ) : (
              <Image src={"/img/burger.svg"} width={24} height={24} alt="Menu" />
            )}
          </button>
        </section>

        <nav
          className={
            styles.navContainer +
            " " +
            (navbarOpen ? styles.navOpen : styles.navClosed)
          }
        >
          <AppNavigation />

          <div className={navbarOpen ? styles.actionAreaMobile : ""}>
            {user?.isLoggedIn ? (
              <div className="flex space-x-3">
                <span className="text-white">{user?.shortAddress}</span>
                <button onClick={handleLogout} className="btn">Logout</button>
              </div>
            ) : (
              <LoginWithMagic />
            )}
          </div>
        </nav>
      </nav>
      {children}
    </header>
  );
}
