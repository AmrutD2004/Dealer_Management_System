import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Moon, Sun } from "lucide-react";

import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface AuthCardProps {
  title: string;
  description: string;
  linkLabel: string;
  linkTo: string;
  children: ReactNode;
}

/* Shared shell for the Login and Sign up screens. */
export function AuthCard({
  title,
  description,
  linkLabel,
  linkTo,
  children,
}: AuthCardProps) {
  const navigate = useNavigate();

  const { theme, setTheme } = useTheme();

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>{title}</CardTitle>

          <CardDescription>{description}</CardDescription>

          <CardAction className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle theme"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <Sun /> : <Moon />}
            </Button>

            <Button
              variant="link"
              type="button"
              onClick={() => navigate(linkTo)}
            >
              {linkLabel}
            </Button>
          </CardAction>
        </CardHeader>

        <CardContent>{children}</CardContent>
      </Card>
    </div>
  );
}
