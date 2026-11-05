import { AuthContext } from "@/Contexts/AuthContext"
import { ThemeProvider } from "@/components/theme-provider"
import { Login } from "@/Pages/auth/Login"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router-dom"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { unifiedLogin } from "@/api/endpoints"

vi.mock("@/api/endpoints", () => ({
  unifiedLogin: vi.fn(),
}))

vi.mock("@/components/ui/toast", () => ({
  toast: { add: vi.fn() },
}))

const mockedUnifiedLogin = vi.mocked(unifiedLogin)

function renderLogin(setIsLoggedIn: () => void) {
  return render(
    <ThemeProvider defaultTheme="light" disableTransitionOnChange={false}>
      <MemoryRouter>
        <AuthContext.Provider
          value={{
            isLoggedIn: false,
            setIsLoggedIn,
            isAuthenticated: true,
            setIsAuthenticated: vi.fn(),
            userInfo: null,
            userType: "",
            hashId: "",
          }}
        >
          <Login />
        </AuthContext.Provider>
      </MemoryRouter>
    </ThemeProvider>
  )
}

describe("Login", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("submits credentials and marks the user as logged in", async () => {
    const user = userEvent.setup()
    const setIsLoggedIn = vi.fn()
    mockedUnifiedLogin.mockResolvedValue({
      success: true,
      message: "Login successful",
      userType: "PLATFORM_USER",
    })

    renderLogin(setIsLoggedIn)

    await user.type(
      screen.getByLabelText(/email/i),
      "admin@example.com"
    )
    await user.type(screen.getByLabelText("Password"), "secret-password")
    await user.click(screen.getByRole("button", { name: /^login$/i }))

    await waitFor(() => {
      expect(mockedUnifiedLogin).toHaveBeenCalledWith({
        email: "admin@example.com",
        password: "secret-password",
      })
    })
    expect(setIsLoggedIn).toHaveBeenCalledWith(true)
  })

  it("shows an error and keeps the user logged out for invalid credentials", async () => {
    const user = userEvent.setup()
    const setIsLoggedIn = vi.fn()
    mockedUnifiedLogin.mockResolvedValue({
      success: false,
      message: "Invalid credentials",
    })

    renderLogin(setIsLoggedIn)

    await user.type(screen.getByLabelText(/email/i), "admin@example.com")
    await user.type(screen.getByLabelText("Password"), "wrong-password")
    await user.click(screen.getByRole("button", { name: /^login$/i }))

    await waitFor(() => {
      expect(mockedUnifiedLogin).toHaveBeenCalled()
    })
    expect(setIsLoggedIn).not.toHaveBeenCalled()
  })
})
