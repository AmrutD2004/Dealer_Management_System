import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Loader2 } from "lucide-react"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { createPlatformUser } from "@/api/endpoint";
import { toast } from "@/components/ui/toast";
import { cn } from "cn";
import type { platformuserCreateType } from "@/Types/platformUserType";

export function SignUpPage() {
  const navigate = useNavigate()
  const { theme, setTheme } = useTheme()
  const [loading, setLoading] = useState<boolean>(false)
  const [formData, setFormData] = useState<platformuserCreateType>({
    email: '',
    passwordHash: ''
  })
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true)
    try {
      const payload = {
        email: formData.email,
        passwordHash: formData.passwordHash
      }
      console.log('sending data', payload)
      const data = await createPlatformUser(payload)
      if (data?.success) {
        toast.add({
          type: 'success',
          description: data?.message
        })
      }
      if (!data?.success) {
        toast.add({
          type: 'error',
          description: data?.message
        })
        setFormData({
          email: '',
          passwordHash: ''
        })
        setTimeout(() => {
          navigate('/login')
        }, 1000)
      }
    } catch (error: any) {
      console.log(error)
      toast.add({
        type: 'error',
        description: error?.response?.data?.message
      })
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  return (
    <div className="flex mx-auto justify-center items-center min-h-screen">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Create Your Account Here</CardTitle>

          <CardDescription>
            Enter your information below to create your account
          </CardDescription>

          <CardAction className="flex items-center">
            <Button variant={'ghost'} onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>{theme === 'dark' ? <Sun /> : <Moon />}</Button>
            <Button variant="link" onClick={() => navigate('/login')} type="button">
              Login
            </Button>
          </CardAction>
        </CardHeader>

        <CardContent>
          {/* Form starts here */}
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">

              {/* Email */}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>

                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="abc@example.com"
                  required
                  onChange={handleChange}
                />
              </div>

              {/* Password */}
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>

                <Input
                  id="password"
                  name="passwordHash"
                  type="password"
                  placeholder="••••••••••"
                  required
                  onChange={handleChange}
                />
              </div>

              {/* Submit */}
              <Button type="submit" disabled={loading} className={cn(`${loading ? 'flex items-center justify-center gap-2 cursor-not-allowed' : 'cursor-pointer'}w-full`)}>
                {loading ? <span className="flex items-center gap-2"><Loader2 className="animate-spin" />Signing up...</span> : 'Sign Up'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
