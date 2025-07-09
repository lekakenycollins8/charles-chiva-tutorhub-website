"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { signIn } from "next-auth/react";

// LoginForm component that uses useSearchParams
function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Handle error messages from URL parameters
  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam) {
      switch (errorParam) {
        case "unauthorized":
          setError("Your session has expired. Please log in again.");
          break;
        case "forbidden":
          setError("You do not have permission to access the admin dashboard.");
          break;
        case "authentication":
          setError("Authentication error. Please log in again.");
          break;
        default:
          setError("An error occurred. Please log in again.");
      }
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Use NextAuth signIn directly
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false, // Don't redirect automatically, we'll handle it
      });
      
      if (result?.error) {
        setError(result.error || "Login failed");
      } else {
        // Redirect to admin dashboard on successful login
        router.push("/admin/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Authentication Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="admin@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </Button>
    </form>
  );
}

// Loading fallback component
function LoginFormFallback() {
  return (
    <div className="space-y-4">
      <div className="h-10 bg-gray-100 animate-pulse rounded"></div>
      <div className="space-y-2">
        <div className="h-5 w-16 bg-gray-100 animate-pulse rounded"></div>
        <div className="h-10 bg-gray-100 animate-pulse rounded"></div>
      </div>
      <div className="space-y-2">
        <div className="h-5 w-20 bg-gray-100 animate-pulse rounded"></div>
        <div className="h-10 bg-gray-100 animate-pulse rounded"></div>
      </div>
      <div className="h-10 bg-gray-100 animate-pulse rounded"></div>
    </div>
  );
}

export default function AdminLogin() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Admin Login</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access the admin dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<LoginFormFallback />}>
            <LoginForm />
          </Suspense>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-500">
            Chiva TutorHub Admin Portal
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
