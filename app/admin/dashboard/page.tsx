'use client'
import { UserAuth } from "@/app/context/AuthContext";
import React, { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function page() {
  const router = useRouter();
  const { session } = UserAuth();
  // État pour stocker les infos du profil
  const [profile, setProfile] = useState<{
    username: string;
    avatar_url: string;
    role: string;
  } | null>(null);
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
      }
    };
    fetchProfile();
  }, [session]);

  useEffect(() => {
    if (
      session &&
      profile &&
      profile.role !== "admin" &&
      profile.role !== "owner"
    ) {
      router.push("/client/dashboard");
    }
    if(!session){
      router.push('/signin')
    }
  }, [session, profile, router]);

  return <div>Admin dashboard</div>;
}
