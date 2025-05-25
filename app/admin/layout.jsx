import React from "react";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "Admin | Supabase Auth App",
  description: "Interface dédiée aux clients de l'application.",
};

export default function ClientLayout({ children }) {
  return (
    <div>
      <main>
        <Navbar/>
        {children}
      </main>
    </div>
  );
}