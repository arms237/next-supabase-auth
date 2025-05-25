'use client'
import { UserAuth } from "@/app/context/AuthContext";
import Link from "next/link";
import React, { useState } from "react";
import { FaCircleUser, FaKey } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  // États pour les champs du formulaire
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");

  // Récupération des fonctions d'authentification via le contexte
  const { session, signUpNewUser } = UserAuth();

  const router = useRouter();

  // Gestion de la soumission du formulaire d'inscription
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    // Vérification des champs obligatoires
    if (!email || !password || !username) {
      setError("Nom d'utilisateur, email et mot de passe requis !");
      setLoading(false);
      return;
    }

    // Vérification de la longueur du mot de passe
    if (password.length < 6) {
      setError("Le mot de passe doit comporter au moins 6 caractères.");
      setLoading(false);
      return;
    }

    // Vérification de la correspondance des mots de passe
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      setLoading(false);
      return;
    }

    try {
      // Appel à la fonction d'inscription du contexte
      const result = await signUpNewUser({ email, password, username });

      if (result.success) {
        setError("");
        setLoading(false);
        alert(
          "Un email de confirmation a été envoyé. Veuillez vérifier votre boîte mail pour valider votre compte."
        );
        // Redirection vers le dashboard client après inscription
        router.push("/client/dashboard");
      } else {
        setError(result.error?.message || "Erreur lors de l'inscription.");
      }
    } catch (err) {
      setError("Une erreur est survenue lors de l'inscription. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  }

  // Affichage du formulaire d'inscription
  return (
    <>
      {loading ? (
        // Affichage d'un spinner pendant le chargement
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="w-full h-screen flex flex-col justify-center items-center">
          {/* Affichage des erreurs */}
          {error && <p className="p-2 bg-base-300 text-error rounded">{error}</p>}
          <h1 className="text-4xl font-bold mb-3">S'inscrire</h1>
          <form className="flex flex-col gap-y-3 w-[400px]" onSubmit={handleSubmit}>
            {/* Champ nom d'utilisateur */}
            <label className="input w-full">
              <span className="text-lg">
                <FaCircleUser />
              </span>
              <input
                type="text"
                placeholder="Nom d'utilisateur"
                onChange={(e) => setUsername(e.target.value)}
                value={username}
                required
              />
            </label>
            {/* Champ email */}
            <label className="input w-full">
              <span className="text-lg">
                <MdEmail />
              </span>
              <input
                type="email"
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
            {/* Champ confirmation mot de passe */}
            <label className="input w-full">
              <span className="text-lg">
                <FaKey />
              </span>
              <input
                type="password"
                placeholder="Confirmer mot de passe"
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
                required
              />
            </label>
            {/* Bouton d'inscription */}
            <button className="btn btn-neutral" type="submit" disabled={loading}>
              S'inscrire
            </button>
            {/* Lien vers la connexion */}
            <p>
              Déjà inscrit ?{" "}
              <Link href="/signin" className="text-primary hover:underline">
                Connectez-vous
              </Link>
            </p>
          </form>
        </div>
      )}
    </>
  );
}