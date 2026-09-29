import { AuthCard } from "@/components/AuthCard";
import { Field } from "@/components/Field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LoginPage() {
  return (
    <AuthCard
      title="Login to your account"
      description="Enter your email below to login to your account"
      linkLabel="Sign Up"
      linkTo="/signup"
    >
      <form>
        <div className="flex flex-col gap-6">
          <Field label="Email" htmlFor="email">
            <Input
              id="email"
              type="email"
              placeholder="abc@example.com"
              required
            />
          </Field>

          <Field label="Password" htmlFor="password">
            <Input
              id="password"
              type="password"
              placeholder="••••••••••"
              required
            />
          </Field>

          <Button type="submit" className="w-full">
            Login
          </Button>
        </div>
      </form>
    </AuthCard>
  );
}
