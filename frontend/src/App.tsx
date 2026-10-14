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
import Employee from "./Pages/TenantUserPages/Masters/Employee"
import { TenantContextProvider } from "./Contexts/Tenant/TenantContext"
import AssignPermission from "./Pages/TenantUserPages/Masters/AssignPermission"
import ServiceCategory from "./Pages/TenantUserPages/Masters/ServiceCategory"
import ServiceType from "./Pages/TenantUserPages/Masters/ServiceType"
import RepairOrder from "./Pages/TenantUserPages/Masters/RepairOrder"
import Customer from "./Pages/TenantUserPages/Customer"
import CustomerCreate from "./Pages/TenantUserPages/CustomerCreate"
import Vehicle from "./Pages/TenantUserPages/Vehicle"
import VehicleCreate from "./Pages/TenantUserPages/VehicleCreate"
import JobCard from "./Pages/TenantUserPages/JobCard"
import JobCardCreate from "./Pages/TenantUserPages/JobCardCreate"


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
            <Route path='/tenant/:id/masters/permission' element={<TenantContextProvider><AuthProtectedRoute><AssignPermission /></AuthProtectedRoute></TenantContextProvider>} />
            <Route path='/tenant/:id/masters/employee' element={<TenantContextProvider><AuthProtectedRoute><Employee /></AuthProtectedRoute></TenantContextProvider>} />
            <Route path='/tenant/:id/masters/service-category' element={<TenantContextProvider><AuthProtectedRoute><ServiceCategory /></AuthProtectedRoute></TenantContextProvider>} />
            <Route path='/tenant/:id/masters/service-type' element={<TenantContextProvider><AuthProtectedRoute><ServiceType /></AuthProtectedRoute></TenantContextProvider>} />
            <Route path='/tenant/:id/masters/repair-order' element={<TenantContextProvider><AuthProtectedRoute><RepairOrder /></AuthProtectedRoute></TenantContextProvider>} />
            <Route path='/tenant/:id/customer' element={<TenantContextProvider><AuthProtectedRoute><Customer /></AuthProtectedRoute></TenantContextProvider>} />
            <Route path='/tenant/:id/customer/create' element={<TenantContextProvider><AuthProtectedRoute><CustomerCreate /></AuthProtectedRoute></TenantContextProvider>} />
            <Route path='/tenant/:id/vehicle' element={<TenantContextProvider><AuthProtectedRoute><Vehicle /></AuthProtectedRoute></TenantContextProvider>} />
            <Route path='/tenant/:id/vehicle/create' element={<TenantContextProvider><AuthProtectedRoute><VehicleCreate /></AuthProtectedRoute></TenantContextProvider>} />
            <Route path='/tenant/:id/job-card' element={<TenantContextProvider><AuthProtectedRoute><JobCard /></AuthProtectedRoute></TenantContextProvider>} />
            <Route path='/tenant/:id/job-card/create' element={<TenantContextProvider><AuthProtectedRoute><JobCardCreate /></AuthProtectedRoute></TenantContextProvider>} />
          </Routes>
        </AuthContextProvider>
      </Router>
    </>
  )
}

export default App
