"use client";
import { UserButton, useUser } from "@clerk/nextjs";
import { HandCoins } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";
import { checkAndAddUser } from "../action";

const Navbar = () => {
  const pathname = usePathname();
  const {user} = useUser()
  
  const navLinks = [
    {
      href: "/",
      label: "Factures",
    },
  ];

  // le useEffect fait l'action avant que la page ne s'affiche
  useEffect(() =>{
if (user?.primaryEmailAddress?.emailAddress && user.fullName) {
  checkAndAddUser(user?.primaryEmailAddress?.emailAddress,user.fullName)
}
  },[user])

  const isActiveLink = (href: string) =>
    pathname.replace(/\$/, "") === href.replace(/\$/, "");

  

  const renderLinks = (classNames: string) =>
    navLinks.map(({ href, label }) => {
      return (
        <Link
          href={href}
          key={href}
          className={`btn-sm btn ${classNames} ${
            isActiveLink(href) ? "btn-accent" : ""
          }`}
        >
          {label}
        </Link>
      );
    });

  return (
    <div className="border-b border-basse-300 px-5 md:px[10%] py-4 ">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div className="bg-accent-content text-accent rounded-full p-2">
            <HandCoins className="h-6 w-6" />
          </div>
          <span className=" ml-3 font-bold text-2xl italic">
           Dam<span className="text-accent">Facture</span>
          </span>
        </div>
{/* {user?.primaryEmailAddress?.emailAddress} */}
        <div className="flex space-x-4 items-center">
          {renderLinks("btn")}
          <UserButton />
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default Navbar;


