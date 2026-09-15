import { useState } from "react";
import { useLocation } from "wouter";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Lock } from "lucide-react";
import heroVideo from "@assets/generated_videos/zanzibar_beach_aerial.mp4";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, authConfigured } = useStore();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      const result = await login(email, password);

      if (result.ok) {
        toast({
          title: "Welcome back",
          description: "You have successfully logged in.",
        });
        setLocation("/admin");
      } else {
        setError(result.message || "Invalid email or password");
        toast({
          variant: "destructive",
          title:
            result.reason === "unconfigured" ? "Not configured" : "Access denied",
          description: result.message || "Invalid credentials.",
        });
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-40"
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative z-10 w-full max-w-md px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-white mb-2">Japhazel<span className="text-accent">.</span></h1>
          <p className="text-white/60 uppercase tracking-widest text-xs">Admin Portal</p>
        </div>

        {!authConfigured && (
          <div className="mb-4 border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-200">
            <p className="font-semibold">Admin sign-in is not configured</p>
            <p className="mt-1 text-amber-200/80">
              Set <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code>,
              then rebuild. Until then no password will be accepted. See DATABASE.md.
            </p>
          </div>
        )}

        <Card className="border-border/50 bg-background/95 backdrop-blur-sm shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-serif">Login</CardTitle>
            <CardDescription>
              Enter your credentials to access the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="admin@japhazel.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  data-testid="input-email"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Password
                </label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  data-testid="input-password"
                />
              </div>
              
              {error && (
                <div className="text-sm text-destructive font-medium flex items-center gap-2" data-testid="text-error">
                   <Lock className="h-4 w-4" /> {error}
                </div>
              )}

              <Button type="submit" className="w-full bg-primary text-white hover:bg-primary/90" disabled={loading} data-testid="button-login">
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
            
            <p className="mt-4 text-center text-xs text-muted-foreground">
              Staff access only. Contact your administrator if you cannot sign in.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
