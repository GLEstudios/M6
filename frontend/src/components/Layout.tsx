import React from 'react';
import AppHeader from "./AppHeader";
import Link from 'next/link';
import AppNavigation from './AppNavigation';
import Image from 'next/image'; // <-- Import the Image component

export default function Layout({ children, title, className = "" }) {
  return (
    <>
      <AppHeader>
        {/* Replace with your company logo */}
        <Image src={"/logoc.svg"} width={120} height={47} alt="Total Play EMP" />

        <AppNavigation />

        {/* Replace with your event logo and redirect to the event's webpage */}

        <Image src={"/logoc.svg"} width={24} height={24} alt="cyber Sec" />

      </AppHeader>


      <main className={`container space-y-10 px-3 py-12 ${className}`}>
        {children}
      </main>
    </>
  );
}
