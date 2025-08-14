import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { authenticate } from "../../core/api/auth";
import { useAuthStore } from "../../core/auth/auth.store";
import { useNavigate } from "react-router-dom";

const LoginSchema = z.object({
  username: z.string().min(1, "Identifiant requis"),
  password: z.string().min(1, "Mot de passe requis"),
});

type LoginValues = z.infer<typeof LoginSchema>;

const LoginPage: React.FC = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { username: "", password: "" },
  });
  const setToken = useAuthStore((s) => s.setToken);
  const navigate = useNavigate();
  const onSubmit = async (values: LoginValues) => {
    try {
      const res = await authenticate(values);
      setToken(res?.data?.token, res?.data?.refreshToken);
      navigate("/", { replace: true });
    } catch (e: any) {
      alert(e?.message ?? "Échec d'authentification");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm p-6 rounded-2xl border">
        <h1 className="text-xl font-semibold mb-4">Connexion</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div>
            <label className="block text-sm">Identifiant</label>
            <input {...register("username")} className="input input-bordered w-full" />
            {errors.username && <p className="text-red-500 text-xs">{errors.username.message}</p>}
          </div>
          <div>
            <label className="block text-sm">Mot de passe</label>
            <input type="password" {...register("password")} className="input input-bordered w-full" />
            {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
          </div>
          <button className="btn btn-primary w-full" disabled={isSubmitting}>
            {isSubmitting ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
