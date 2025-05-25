'use client'
import Image from "next/image";
import Navbar from "./components/Navbar";
import { UserAuth } from "./context/AuthContext";
import { useEffect } from "react";
import Link from "next/link";
import { FaCircleUser } from "react-icons/fa6";

export default function Home() {
  const {session} = UserAuth();
  return (
    <>
      <Navbar />
      <main className="flex flex-col items-center justify-center h-[600px] bg-base-200">
        <div className="card bg-base-100 shadow-xl p-8 mt-10 w-full max-w-xl">
          <div className="flex flex-col items-center">
            
            <h1 className="text-4xl font-bold mb-2 text-neutral">Bienvenue sur Supabase Auth App</h1>
            <p className="text-lg text-center mb-6">
              Gérez votre authentification, vos espaces client et admin facilement avec Next.js & Supabase.
            </p>
            {!session ? <div className="flex gap-4">
              <a href="/signup" className="btn btn-neutral">
                S'inscrire
              </a>
              <a href="/signin" className="btn btn-outline btn-neutral">
                Se connecter
              </a>
            </div>:<div className="flex flex-col items-center gap-y-3">
                <h1 className="text-2xl font-bold"> Accedez a votre profil</h1>
                <Link href='/client/dashboard' className="btn btn-outline btn-neutral"><FaCircleUser/>Profil</Link>
              </div>}
          </div>
        </div>
      </main>
    </>
  );
}