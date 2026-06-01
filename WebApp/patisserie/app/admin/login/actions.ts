"use server";
import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

export async function loginAction(email: string, password: string) {
  try {
    // redirect: false → le provider credentials est traité côté serveur
    // (cookie de session posé directement) sans passer par un GET sur
    // /api/auth/callback/credentials, qui lèverait InvalidProvider en v5.
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Email ou mot de passe incorrect." };
    }
    throw error;
  }
  // Hors du try/catch : redirect() lève NEXT_REDIRECT, à ne pas intercepter.
  redirect("/admin");
}
