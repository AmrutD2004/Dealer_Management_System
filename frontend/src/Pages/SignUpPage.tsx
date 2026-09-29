import { useState, type FormEvent, type ChangeEvent } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";

import { AuthCard } from "@/components/AuthCard";
import { Field } from "@/components/Field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import {
  createPlatformUser,
  type ApiResponse,
  type PlatformUserPayload,
} from "@/api/endpoint";

const GENERIC_ERROR = "Something went wrong. Please try again.";

function getErrorMessage(error: unknown): string {
  if (!axios.isAxiosError<ApiResponse>(error)) {
    return GENERIC_ERROR;
  }

  return error.response?.data?.message ?? GENERIC_ERROR;
}

export function SignUpPage() {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<PlatformUserPayload>({
    email: "",
    password: "",
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);

    try {
      const data = await createPlatformUser(formData);

      toast.add({
        type: data.success ? "success" : "error",
        description: data.message ?? GENERIC_ERROR,
      });
    } catch (error) {
      toast.add({ type: "error", description: getErrorMessage(error) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Create Your Account Here"
      description="Enter your information below to create your account"
      linkLabel="Login"
      linkTo="/login"
    >
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-6">
          <Field label="Email" htmlFor="email">
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="abc@example.com"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </Field>

          <Field label="Password" htmlFor="password">
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••••"
              required
              value={formData.password}
              onChange={handleChange}
            />
          </Field>

          <Button
            type="submit"
            disabled={loading}
            className="w-full items-center justify-center gap-2 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" />
                Signing up...
              </>
            ) : (
              "Sign Up"
            )}
          </Button>
        </div>
      </form>
    </AuthCard>
  );
}
