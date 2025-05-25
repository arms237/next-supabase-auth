"use client";
import { UserAuth } from "@/app/context/AuthContext";
import Link from "next/link";
import React, { useState } from "react";
import { FaKey } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { useRouter } from "next/navigation";

export default function page() {
  // États pour les champs du formulaire
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Récupération des fonctions d'authentification via le contexte
  const { session, signInUser } = UserAuth();
  const router = useRouter();

  // Gestion de la soumission du formulaire de connexion
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    // Vérification des champs obligatoires
    if (!email || !password) {
      setError("Email et mot de passe requis !");
      setLoading(false);
      return;
    }

    try {
      // Appel à la fonction de connexion du contexte
      const result = await signInUser(email, password);

      if (result.success) {
        setError("");
        setLoading(false);
        // Redirection vers le dashboard client après connexion
        router.push("/client/dashboard");
      } else {
        setError(result.error?.message || "Erreur lors de la connexion.");
      }
    } catch (err) {
      setError("Une erreur est survenue lors de la connexion. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  }
  console.log(session)
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold mb-3">Se connecter</h1>
      {/* Affichage des erreurs */}
      {error && <p className="p-2 bg-base-300 text-error rounded">{error}</p>}
      <form className="flex flex-col gap-y-3 w-[400px]" onSubmit={handleSubmit}>
        {/* Champ email */}
        <label className="input w-full">
          <span className="text-lg">
            <MdEmail />
          </span>
          <input
            type="text"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />
        </label>
        {/* Champ mot de passe */}
        <label className="input w-full">
          <span className="text-lg">
            <FaKey />
          </span>
          <input
            type="password"
            placeholder="Mot de passe"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          />
        </label>
        {/* Bouton de connexion */}
        <button className="btn btn-neutral" type="submit" disabled={loading}>
          {loading ? "Connexion..." : "Se connecter"}
        </button>
        {/* Lien vers l'inscription */}
        <p>
          Pas de compte ?{" "}
          <Link href="/signup" className="text-primary hover:underline">
            S'inscrire
          </Link>
        </p>
        {/* Lien mot de passe oublié */}
        <Link href="" className="text-primary hover:underline">
          Mot de passe oublié ?
        </Link>
      </form>
    </div>
  );
}