import React, { useState } from "react";
import { Mail, KeyRound, Loader2 } from "lucide-react";
import { post } from "@/core/api/client";
import { useAuthStore } from "@/core/auth/auth.store";
import { useNavigate } from "react-router-dom";

interface AuthResponse {
  token: string;
  refreshToken?: string;
  user?: { id?: number | string; name?: string; role?: string; permissions?: string[]; email?: string };
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const setToken = useAuthStore((s) => s.setToken);
  const setUser = useAuthStore((s) => s.setUser);

  const [username, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await post<AuthResponse>("/users/authenticate", { username:username, password });
      if (!data?.token) throw new Error("Jeton manquant dans la réponse");
      setToken(data.token, data.refreshToken);
      if (data.user) setUser(data.user);
      navigate("/", { replace: true });
    } catch (err: any) {
      setError(err?.message || "Échec de connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-0px)] flex items-center justify-center bg-[#0f1115]">
      <div className="w-full max-w-sm p-6 rounded-2xl bg-[#151821] shadow-xl border border-[#1d2230]">
        <h1 className="text-2xl font-semibold text-white text-center mb-6">Connexion</h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Email</label>
            <div className="flex items-center gap-2 bg-[#0f131b] border border-[#2a3344] rounded-lg px-3 py-2 focus-within:border-emerald-500">
              <Mail className="w-4 h-4 text-gray-400" />
              <input
                type="email"
                required
                value={username}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full bg-transparent outline-none text-gray-100 placeholder:text-gray-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Password</label>
            <div className="flex items-center gap-2 bg-[#0f131b] border border-[#2a3344] rounded-lg px-3 py-2 focus-within:border-emerald-500">
              <KeyRound className="w-4 h-4 text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full bg-transparent outline-none text-gray-100 placeholder:text-gray-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <a className="text-emerald-400 hover:underline" href="#">Forgot your password?</a>
          </div>

          {error && <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/30 rounded-md p-2">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-lg bg-emerald-500 text-black font-medium hover:bg-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin"/>Connexion...</>) : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
