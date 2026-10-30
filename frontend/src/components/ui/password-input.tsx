import * as React from "react"
import { Eye, EyeOff } from "lucide-react"
import { cn } from "cn"

import { Input } from "@/components/ui/input"

function PasswordInput({ className, disabled, ...props }: React.ComponentProps<"input">) {
  const [visible, setVisible] = React.useState(false)

  return (
    <div className="relative">
      <Input
        {...props}
        disabled={disabled}
        type={visible ? "text" : "password"}
        className={cn(className, "pr-8")}
      />
      <button
        type="button"
        disabled={disabled}
        aria-label={visible ? "Hide password" : "Show password"}
        title={visible ? "Hide password" : "Show password"}
        onClick={() => setVisible((prev) => !prev)}
        className="absolute top-1/2 right-1.5 flex -translate-y-1/2 items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
      >
        {visible ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
      </button>
    </div>
  )
}

export { PasswordInput }
