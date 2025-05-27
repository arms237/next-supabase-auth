"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { FaCircleUser } from "react-icons/fa6";
import { UserAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabaseClient";
export default function Navbar() {
  const { session, signOut } = UserAuth();
  const pathname = usePathname();
  const [role, setRole] = useState(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Récupère le rôle depuis la table "profiles" si connecté
  useEffect(() => {
    setLoading(true);
    const fetchProfile = async () => {
      if (session?.user?.id) {
        const { data, error } = await supabase
          .from("profiles")
          .select("username, avatar_url, role")
          .eq("id", session.user.id)
          .single();
        if (!error && data) {
          setRole(data.role);
        }
      }
      setLoading(false);
    };

    fetchProfile();
  }, [session]);

  // Génère dynamiquement les liens selon le rôle
  const links = [{ name: "Acceuil", path: "/" }];

  if (role === "owner") {
    links.push({ name: "Dashboard", path: "/client/dashboard" });
    links.push({ name: "Proprio Dashboard", path: "/owner/dashboard" });
  } else if (role === "admin") {
    links.push({ name: "Dashboard", path: "/client/dashboard" });
    links.push({ name: "Admin Dashboard", path: "/admin/dashboard" });
  } else if (session) {
    links.push({ name: "Dashboard", path: "/client/dashboard" });
  }

  const handleLogout = async () => {
    try {
      await signOut();
      router.push("/");
    } catch {
      alert("Erreur lors de la déconnexion");
    }
  };
  if (loading) {
    return (
      <div className="text-2xl px-4 font-semibold">Chargement...</div>
  )}
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
        <Link href="/signup" className="text-3xl">
          <FaCircleUser />
        </Link>
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
              <Link href="/dashboard" className="justify-between">
                Profile
                <span className="badge">New</span>
              </Link>
            </li>
            <li>
              <Link href="#">Settings</Link>
            </li>
            <li>
              <a onClick={handleLogout}>Logout</a>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
