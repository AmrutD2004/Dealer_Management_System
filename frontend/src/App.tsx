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
import Permission from "./Pages/PlatformUserPages/PlatformUser/Permission"
import Dashboard from "./Pages/TenantUserPages/Dashboard"
import Branch from "./Pages/TenantUserPages/Masters/Branch"
import Designation from "./Pages/TenantUserPages/Masters/Designation"
import Role from "./Pages/TenantUserPages/Masters/Role"
import { TenantContextProvider } from "./Contexts/Tenant/TenantContext"


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
            <Route path='/platform/permission' element={<PlatformUserContextProvider><AuthProtectedRoute><Permission /></AuthProtectedRoute></PlatformUserContextProvider>} />
            <Route path='/tenant/:id/dashboard' element={<TenantContextProvider><AuthProtectedRoute><Dashboard /></AuthProtectedRoute></TenantContextProvider>} />
            <Route path='/tenant/:id/masters/branch' element={<TenantContextProvider><AuthProtectedRoute><Branch /></AuthProtectedRoute></TenantContextProvider>} />
            <Route path='/tenant/:id/masters/designation' element={<TenantContextProvider><AuthProtectedRoute><Designation /></AuthProtectedRoute></TenantContextProvider>} />
            <Route path='/tenant/:id/masters/role' element={<TenantContextProvider><AuthProtectedRoute><Role /></AuthProtectedRoute></TenantContextProvider>} />
          </Routes>
        </AuthContextProvider>
      </Router>
    </>
  )
}

export default App
