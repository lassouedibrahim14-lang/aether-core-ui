import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LogIn } from "lucide-react";

const AuthPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        setMessage("Check your email for a confirmation link!");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
    if (error) setError(error.message);
  };

  const inputClass =
    "w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground outline-none transition-all focus:border-primary focus:shadow-[0_0_0_2px_hsl(185_100%_50%/0.15)] placeholder:text-muted-foreground";

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        {/* Logo — Vixon */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight mb-1">
            ♾️ <span className="text-primary">Vixon</span>
          </h1>
          <p className="text-[0.7rem] font-light text-muted-foreground tracking-wide">
            developed by Ibrahim
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-border bg-card p-8">
          <h2 className="mb-6 text-xl font-bold text-center">
            {isSignUp ? "Create Account" : "Welcome Back"}
          </h2>

          {/* Google */}
          <button
            onClick={handleGoogleLogin}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-border py-3 text-sm font-medium text-foreground transition-all hover:border-primary hover:text-primary hover:shadow-[0_0_15px_hsla(185,100%,50%,0.2)] mb-4"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-card px-3 text-muted-foreground">or</span>
            </div>
          </div>

          {/* Email form */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className={inputClass}
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              minLength={6}
              className={inputClass}
            />

            {error && <p className="text-sm text-destructive">{error}</p>}
            {message && <p className="text-sm text-primary">{message}</p>}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-[hsl(190,100%,27%)] py-3 text-sm font-bold text-primary-foreground shadow-[0_0_20px_hsla(185,100%,50%,0.35)] transition-all hover:-translate-y-0.5 disabled:opacity-50"
            >
              <LogIn className="h-4 w-4" />
              {loading ? "Loading..." : isSignUp ? "Sign Up" : "Sign In"}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-muted-foreground">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button onClick={() => { setIsSignUp(!isSignUp); setError(""); setMessage(""); }} className="font-semibold text-primary hover:underline">
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </p>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          By continuing, you agree to our Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
