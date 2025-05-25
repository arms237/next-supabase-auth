'use client'
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import { FaUser } from "react-icons/fa";
import { FaCircleUser } from "react-icons/fa6";

export default function Navbar() {
  const session = false;
  const pathname = usePathname();
  const links = [
    { name: "Acceuil", path: "/" },
    { name: "Dashboard", path: "/client/dashboard" },
  ];

  return (
    <div className="bg-base-100 flex justify-between items-center p-3 ">
        <Link href="/" className="font-bold text-2xl italic">
          SupabaseAuthApp
        </Link>
      <ul className="flex gap-2 ">
        {links.map((link) => (
          <li key={link.path}>
            <Link
              href={link.path}
              className={
                pathname === link.path
                  ? "text-primary "
                  : "hover:text-primary font-semibold"
              }
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
      {!session && (
        <Link href='/signup' className="text-3xl"><FaCircleUser/></Link>
      )}
      {session && (
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full">
              <img
                alt="Tailwind CSS Navbar component"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              />
            </div>
          </div>

          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            <li>
              <a className="justify-between">
                Profile
                <span className="badge">New</span>
              </a>
            </li>
            <li>
              <a>Settings</a>
            </li>
            <li>
              <a>Logout</a>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}