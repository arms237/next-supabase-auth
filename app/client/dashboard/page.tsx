"use client";
import { UserAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabaseClient";
import { FaPencil } from "react-icons/fa6";

export default function DashboardPage() {
  const { session, signOut, updateProfile } = UserAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // État pour stocker les infos du profil
  const [profile, setProfile] = useState<{
    username: string;
    avatar_url: string;
    role: string;
  } | null>(null);

  // Redirection côté client si pas de session ET chargement terminé
  useEffect(() => {
    if (!isLoading && !session) {
      router.push("/signin");
    }
  }, [session, router, isLoading]);

  // Récupération du profil utilisateur depuis la table "profiles"
  useEffect(() => {
    const fetchProfile = async () => {
      if (session?.user?.id) {
        const { data, error } = await supabase
          .from("profiles")
          .select("username, avatar_url, role")
          .eq("id", session.user.id)
          .single();
        if (!error && data) {
          setProfile(data);
        }
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [session]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  // Gestion de l'upload d'avatar
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !session?.user?.id) return;

    try {
      setIsLoading(true);
      const fileExt = file.name.split(".").pop();
      const fileName = `${session.user.id}-${Date.now()}.${fileExt}`;

      // Upload du fichier
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Récupération de l'URL publique
      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(fileName);

      // Mise à jour du profil avec la nouvelle URL
      await handleUpdateProfile({ avatar_url: publicUrl });
    } catch (err) {
      setError("Erreur lors de l'upload de l'avatar");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Mise à jour du profil
  const handleUpdateProfile = async (updates: {
    username?: string;
    avatar_url?: string;
  }) => {
    if (!session?.user?.id) return;

    try {
      setIsLoading(true);
      const { success, error } = await updateProfile(session.user.id, updates);

      if (!success) throw error;

      setProfile((prev) => (prev ? { ...prev, ...updates } : null));
      setIsEditing(false);
      setError(null);
    } catch (err) {
      setError("Erreur lors de la mise à jour du profil");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction de déconnexion
  const handleLogout = async () => {
    try {
      await signOut();
      router.push("/");
    } catch (err) {
      setError("Erreur lors de la déconnexion");
      console.error(err);
    }
  };

  return (
    <div className="container mx-auto py-10">
      {error && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
        </div>
      )}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        
        <div className="card bg-base-200 p-5">
          <h2 className="font-semibold text-lg mb-2">Profil</h2>
          <div className="flex flex-col items-center mb-4">
            {/* Avatar avec bouton d'upload */}
            <div className="relative">
              <div className="avatar">
                <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img
                    src={
                      profile?.avatar_url ||
                      "https://api.dicebear.com/7.x/initials/svg?seed=?"
                    }
                    alt="Profile"
                  />
                </div>
              </div>
              <label
                htmlFor="avatar-upload"
                className="btn btn-circle btn-sm btn-primary absolute bottom-0 right-0"
              >
                <FaPencil />
              </label>
              <input
                id="avatar-upload"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleAvatarUpload}
              />
            </div>
          </div>

          {isEditing ? (
            // Formulaire d'édition
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleUpdateProfile({
                  username: formData.get("username") as string,
                });
              }}
            >
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Nom d'utilisateur</span>
                </label>
                <input
                  type="text"
                  name="username"
                  className="input input-bordered w-full"
                  defaultValue={profile?.username || ""}
                  required
                />
              </div>
              <div className="flex gap-2 mt-4">
                <button type="submit" className="btn btn-primary btn-sm">
                  Enregistrer
                </button>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => setIsEditing(false)}
                >
                  Annuler
                </button>
              </div>
            </form>
          ) : (
            // Affichage des informations
            <>
              <p className="mb-2">
                <strong>Nom d'utilisateur:</strong>{" "}
                {profile?.username || "Non défini"}
              </p>
              <p className="mb-2">
                <strong>Email:</strong> {session.user?.email}
              </p>
              <p className="mb-4">
                <strong>Rôle:</strong> {profile?.role || "Client"}
              </p>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => setIsEditing(true)}
              >
                Modifier mon profil
              </button>
            </>
          )}
        </div>
        {/* Main content */}
        <main className="flex-1">
          <div className="card bg-base-100 shadow-md p-8">
            <h1 className="text-3xl font-bold mb-4">
              Bienvenue sur votre dashboard !
            </h1>
            <p className="mb-6">
              Ici, vous pouvez gérer votre profil, consulter vos informations et
              accéder à vos fonctionnalités client.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card bg-base-200 p-5">
                <h2 className="font-semibold text-lg mb-2">Profil</h2>
                <p>Consultez et modifiez vos informations personnelles.</p>
                <button className="btn btn-primary btn-sm mt-3">
                  Voir mon profil
                </button>
              </div>
              <div className="card bg-base-200 p-5">
                <h2 className="font-semibold text-lg mb-2">Mes actions</h2>
                <p>Accédez à vos fonctionnalités principales.</p>
                <button className="btn btn-secondary btn-sm mt-3">
                  Voir mes actions
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
