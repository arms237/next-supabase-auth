"use client";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { supabase } from "../lib/supabaseClient";
import { Session } from "@supabase/supabase-js";

// Définition du type du contexte d'authentification
type AuthContextType = {
  session: Session | null; // Session utilisateur courante
  setSession: React.Dispatch<React.SetStateAction<Session | null>>; // Setter pour la session
  signUpNewUser: (params: {
    email: string;
    password: string;
    username: string;
  }) => Promise<any>; // Fonction d'inscription
  signInUser: (email: string, password: string) => Promise<any>; // Fonction de connexion
  signOut: () => Promise<void>; // Fonction de déconnexion
  updateProfile: (userId: string, updates: { 
    username?: string; 
    avatar_url?: string;
  }) => Promise<{ success: boolean; error?: any }>;
};

// Création du contexte avec une valeur par défaut null
export const AuthContext = createContext<AuthContextType | null>(null);

// Provider du contexte d'authentification
export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  // État pour stocker la session utilisateur
  const [session, setSession] = useState<Session | null>(null);

  // Fonction d'inscription d'un nouvel utilisateur
  const signUpNewUser = async ({
    email,
    password,
    username,
  }: {
    email: string;
    password: string;
    username: string;
  }) => {
    // Appel à Supabase pour créer un utilisateur
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
      },
    });
    if (error) {
      console.error("Erreur lors de l'inscription ", error);
      return { success: false, error };
    }
    // Si l'utilisateur est bien créé, on ajoute son profil dans la table "profiles"
    if (data?.user) {
      const { error: profileError } = await supabase.from("profiles").upsert([
        {
          id: data.user.id,
          username,
          avatar_url: "",
          role: "client",
        },
      ]);
      if (profileError) {
        console.error("Error inserting profile: ", profileError);
      }
    }
    return { success: true, data };
  };

  // Fonction de connexion utilisateur
  const signInUser = async (email: string, password: string) => {
    try {
      // Appel à Supabase pour se connecter
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      if (error) {
        console.error("Sign in error occured: ", error);
        return { success: false, error };
      }
      console.log("sign in succes :", data);
      return { success: true, data };
    } catch (error) {
      console.error("An error occurred while signing in:", error);
      return { success: false, error };
    }
  };

  // Effet pour écouter les changements de session (connexion/déconnexion)
  useEffect(() => {
    // Récupère la session au chargement du composant
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Écoute les changements d'état d'authentification
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    // Nettoyage de l'abonnement lors du démontage du composant
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  // Fonction de déconnexion utilisateur
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error);
    }
  };
  //Modification du profile utilisateur
  const updateProfile = async (
    userId: string,
    updates: { username?: string; avatar_url?: string }
  ) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", userId);

      if (error) {
        console.error("Erreur lors de la mise à jour du profil:", error);
        return { success: false, error };
      }

      return { success: true };
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error);
      return { success: false, error };
    }
  };
  // Valeur du contexte à fournir aux composants enfants

  
  const values = {
    session,
    setSession,
    signUpNewUser,
    signInUser,
    signOut,
    updateProfile
  };

  // Fournit le contexte à tous les composants enfants
  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

// Hook personnalisé pour consommer le contexte d'authentification
export const UserAuth = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("UserAuth must be used within AuthContextProvider");
  return context;
};
