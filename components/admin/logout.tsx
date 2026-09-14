"use client";
export function Logout() {
  return (
    <button
      className="button button-small button-light"
      onClick={async () => {
        const r = await fetch("/api/admin/auth/", { method: "DELETE" });
        if (r.ok) location.href = "/admin/login/";
      }}
    >
      Sign out
    </button>
  );
}
