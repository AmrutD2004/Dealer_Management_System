

import { platformUserLogin } from "@/api/endpoint";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast";
import { PlatformUserContext } from "@/contexts/PlatformUserContext";
import type { platformuserLoginType } from "@/Types/platformUserType";

import { cn } from "cn";
import { Loader2, Moon, Sun } from "lucide-react";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

export function LoginPage() {
  const navigate = useNavigate()
  const { setIsLoggedIn } = useContext(PlatformUserContext)
  const { theme, setTheme } = useTheme()
  const [loading, setLoading] = useState<boolean>(false)
  const [formData, setFormData] = useState<platformuserLoginType>({
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
      const data = await platformUserLogin(payload)
      if (data?.success) {
        setIsLoggedIn(true)
        toast.add({
          type: 'success',
          description: data?.message
        })
        setTimeout(() => {
          navigate('/dashboard')
        }, 1000)
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
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
          <CardAction className="flex items-center">
            <Button variant={'ghost'} onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>{theme === 'dark' ? <Sun /> : <Moon />}</Button>
            <Button variant="link" onClick={() => navigate('/signup')}>Sign Up</Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
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
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  name="passwordHash"
                  type="password"
                  required
                  placeholder="••••••••••"
                  onChange={handleChange}
                />
              </div>
              <Button type="submit" disabled={loading} className={cn(`${loading ? 'flex items-center justify-center gap-2 cursor-not-allowed' : 'cursor-pointer'}w-full`)}>
                {loading ? <span className="flex items-center gap-2"><Loader2 className="animate-spin" />Logging in...</span> : 'Login'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>

  );
}
