"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClientSupabase } from "@/utils/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const SignupForm = () => {
  const supabase = createClientSupabase();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [err, setErr] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErr(null);
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) return setErr(error.message);
      router.push("/");
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={onSubmit} className="space-y-3 max-w-sm">
        <h1 className="text-3xl text-center mb-5 font-semibold">Sign Up</h1>
        <Input
          type="text"
          placeholder="Masukkan Email"
          value={email}
          className="w-full"
          name="email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Masukkan Password"
          value={password}
          className="w-full"
          name="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        {err && <p className="text-red-600 text-sm">{err}</p>}
        <Button disabled={loading} className="ml-auto w-full">
          Sign Up
        </Button>
        <div className="text-center">
          <Link href={"/login"} className="text-blue-600 ">
            Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SignupForm;
