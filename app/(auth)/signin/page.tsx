"use client";
import { UserAuth } from "@/app/context/AuthContext";
import Link from "next/link";
import React, { useState } from "react";
import { FaKey } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

export default function page() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  

  const { session, signInUser } = UserAuth();

  async function handleSubmit(e:React.FormEvent<HTMLFormElement>){
    e.preventDefault();
  }
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold mb-3">Se connecter</h1>
      <form className="flex flex-col gap-y-3 w-[400px]" onSubmit={handleSubmit}>
        <label className="input w-full">
          <span className="text-lg">
            <MdEmail />
          </span>
          <input
            type="text"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className="input w-full">
          <span className="text-lg">
            <FaKey />
          </span>
          <input
            type="password"
            placeholder="Mot de passe"
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        <button className="btn btn-neutral">Se connecter</button>
        <p>
         Pas de compte?{" "}
          <Link href="/signup" className="text-primary hover:underline">
            S'inscrire
          </Link>
        </p>
        <Link href='' className="text-primary hover:underline">Mot de passe oublié?</Link>
      </form>
    </div>
  );
}
