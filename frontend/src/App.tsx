import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Login } from "./Pages/auth/Login"
import { AuthContextProvider } from "./Contexts/AuthContext"
import { Toaster } from "./components/ui/toast"
import AuthProtectedRoute from "./Protecteds/AuthProtectedRoute"
import Overview from "./Pages/PlatformUserPages/Overview"
import PlatformUser from "./Pages/PlatformUserPages/PlatformUser/PlatformUser"
import { PlatformUserContextProvider } from "./Contexts/PlatformUserContext.tsx/PlatformUserContext"
import Tenant from "./Pages/PlatformUserPages/PlatformUser/Tenant"
import CreateTenant from "./Pages/PlatformUserPages/PlatformUser/CreateTenant"


export function App() {
  return (
    <>
      <Toaster />
      <Router>
        <AuthContextProvider>
          <Routes>
            <Route path='/login' element={<Login />} />
            <Route path="/dashboard" element={<AuthProtectedRoute><Overview /></AuthProtectedRoute>} />
            <Route path='/platform-users' element={<PlatformUserContextProvider><AuthProtectedRoute><PlatformUser /></AuthProtectedRoute></PlatformUserContextProvider>} />
            <Route path='/platform/tenant' element={<PlatformUserContextProvider><AuthProtectedRoute><Tenant /></AuthProtectedRoute></PlatformUserContextProvider>} />
            <Route path='/platform/tenant/create' element={<AuthProtectedRoute><CreateTenant /></AuthProtectedRoute>} />
          </Routes>
        </AuthContextProvider>
      </Router>
    </>
  )
}

export default App
