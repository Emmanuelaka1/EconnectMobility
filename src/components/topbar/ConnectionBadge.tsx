import { useAuthStore } from "@/core/auth/auth.store";
export default function ConnectionBadge() {
  const isAuth = useAuthStore((s) => Boolean(s.token));
  return (
    <span className={[
      "inline-flex items-center rounded-md px-3 py-1 text-sm font-medium",
      isAuth ? "bg-emerald-900/40 text-emerald-300 ring-1 ring-emerald-800/60"
             : "bg-yellow-900/30 text-yellow-200 ring-1 ring-yellow-700/60",
    ].join(" ")} aria-live="polite">
      {isAuth ? "Connecté" : "Mode invité (non connecté)"}
    </span>
  );
}
