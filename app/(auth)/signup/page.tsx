'use client'
import { UserAuth } from "@/app/context/AuthContext";
import Link from "next/link";
import React, { useState } from "react";
import { FaMailBulk } from "react-icons/fa";
import { FaCircleUser, FaKey, FaRegCircleUser } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { useRouter } from "next/navigation";

export default function page() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const { session, signUpNewUser } = UserAuth();

  const router = useRouter();

 async function handleSubmit (e:React.FormEvent<HTMLFormElement>){
     e.preventDefault();
     setLoading(true);
     try{
          const result = await signUpNewUser({email,password,username})
          if(!email || password){
               setError('Nom d\'utilisateur,email et mot de passe requis!');
               setLoading(false);
               return;
          }
          if(password.length < 6){
               setError("Le mot de passe doit comporter au moins 6 caractères.");
               setLoading(false);
               return;
          }
          if(password !== confirmPassword){
               setError('Les mots de passe ne correspondent pas');
               setLoading(false);
               return;
          }if(result.success){
               setError('');
               setLoading(false);
               alert('Un email de confirmation a été envoyé. Veuillez vérifier votre boîte mail pour valider votre compte.');
               router.push('/'); // redirige vers la page d'acceuil
          }
     }catch {
      setError("An error occurred while signing up. Please try again.");
    } finally {
      setLoading(false);
    }
  }
  console.log(session)
  return (
  <>
     {loading?(
          <div className='flex justify-center items-center h-screen'>
               <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900">
               
               </div>
          </div>
          ):(<div className="w-full h-screen flex flex-col justify-center items-center">
          {error && <p className="p-2 bg-base-300 text-error rounded">{error}</p>}
          <h1 className="text-4xl font-bold mb-3">S'inscrire</h1>
          <form className="flex flex-col gap-y-3 w-[400px]" onSubmit={handleSubmit}>
          <label className="input w-full">
               <span className="text-lg">
               <FaCircleUser />
               </span>
               <input type="text" placeholder="Nom d'utlisateur" onChange={(e)=>setUsername(e.target.value)}/>
          </label>
          <label className="input w-full">
               <span className="text-lg">
               <MdEmail />
               </span>
               <input type="text" placeholder="Email" onChange={(e)=>setEmail(e.target.value)} />
          </label>
          <label className="input w-full">
               <span className="text-lg">
               <FaKey />
               </span>
               <input type="password" placeholder="Mot de passe" onChange={(e)=>setPassword(e.target.value)}/>
          </label>
          <label className="input w-full">
               <span className="text-lg">
               <FaKey />
               </span>
               <input type="password" placeholder="Confirmer mot de passe" onChange={(e)=>setConfirmPassword(e.target.value)} />
          </label>
          <button className="btn btn-neutral">S'inscrire</button>
          <p>
               Déjà inscrit?{" "}
               <Link href="/signin" className="text-primary hover:underline">
               Connectez vous
               </Link>
          </p>
          </form>
     </div>)}
    </>
  );
}
