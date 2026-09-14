import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";
import { hasDatabase } from "@/lib/db";
import { Brand } from "@/components/brand";
import { LoginForm } from "@/components/admin/login-form";
export const dynamic = "force-dynamic";
export default async function Login() {
  if (await currentUser()) redirect("/admin/");
  return (
    <main className="login-page">
      <div className="login-card">
        <Brand />
        <h1>Welcome back.</h1>
        <p>Sign in to manage HashTurn’s website.</p>
        {!hasDatabase() ? (
          <div className="notice">
            Admin access requires a database and an administrator account. See
            the project README for setup.
          </div>
        ) : (
          <LoginForm />
        )}
        <a className="text-link" href="/">
          ← Back to website
        </a>
      </div>
    </main>
  );
}
