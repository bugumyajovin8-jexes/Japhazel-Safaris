import { useStore } from "@/lib/store";
import { useLocation } from "wouter";
import { useEffect } from "react";

interface ProtectedRouteProps {
  component: React.ComponentType<any>;
  [key: string]: any;
}

export default function ProtectedRoute({ component: Component, ...rest }: ProtectedRouteProps) {
  const { user } = useStore();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!user) {
      setLocation("/login");
    }
  }, [user, setLocation]);

  if (!user) {
    return null; // or a loading spinner
  }

  return <Component {...rest} />;
}
