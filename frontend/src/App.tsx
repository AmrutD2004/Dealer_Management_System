import { Suspense } from "react";
import type { ReactNode } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { Toaster } from "./components/ui/toast";
import { PlatformUserContextProvider } from "./contexts/PlatformUserContext";
import PlatformuserProtected from "./Protecteds/PlatformuserProtected";
import { Loader2 } from "lucide-react";

import { LoginPage } from "./Pages/LoginPage";
import { SignUpPage } from "./Pages/SignUpPage";
import PlatformDashboard from "./Pages/Platform/PlatformDashboard";
import Tenants from "./Pages/Platform/Tenants";
import TenantCreate from "./Pages/Platform/TenantCreate";
import Plans from "./Pages/Platform/Plans";
import PlatformUsers from "./Pages/Platform/PlatformUsers";

import { TenantsProvider } from "./components/Tenants";
import { PlansProvider } from "./components/Plans";
import { PlatformUsersProvider } from "./components/PlatformUsers";

// Loading fallback
function RouteFallback() {
  return (
    <div className='max-w-7xl mx-auto'>
      <div className='flex items-center justify-center min-h-screen'>
        <h1 className='flex items-center gap-2 text-muted-foreground text-3xl font-medium tracking-tight'><Loader2 size={38} className="animate-spin"/>Verifing Session....</h1>
      </div>
    </div>
  );
}

const protectedRoute = (element: ReactNode) => (
  <PlatformUserContextProvider>
    <PlatformuserProtected>{element}</PlatformuserProtected>
  </PlatformUserContextProvider>
);

const App = () => {
  return (
    <>
      <Toaster />

      <BrowserRouter>
        <TenantsProvider>
          <PlansProvider>
            <PlatformUsersProvider>
              <Suspense fallback={<RouteFallback />}>
                <Routes>
                  {/* Authentication */}
                  <Route
                    path="/login"
                    element={
                      <PlatformUserContextProvider>
                        <LoginPage />
                      </PlatformUserContextProvider>
                    }
                  />

                  <Route path="/signup" element={<SignUpPage />} />

                  {/* Default route */}
                  <Route
                    path="/"
                    element={<Navigate to="/dashboard" replace />}
                  />

                  {/* Platform Admin */}
                  <Route path="/dashboard" element={<PlatformDashboard />} />

                  {/* Platform User Management */}
                  <Route
                    path="/platform-users"
                    element={protectedRoute(<PlatformUsers />)}
                  />

                  {/* Tenant Management */}
                  <Route
                    path="/tenants"
                    element={protectedRoute(<Tenants />)}
                  />

                  <Route
                    path="/tenants/create"
                    element={protectedRoute(<TenantCreate />)}
                  />

                  {/* Plan Management */}
                  <Route path="/plans" element={<Plans />} />

                  {/* Unknown routes */}
                  <Route
                    path="*"
                    element={<Navigate to="/dashboard" replace />}
                  />
                </Routes>
              </Suspense>
            </PlatformUsersProvider>
          </PlansProvider>
        </TenantsProvider>
      </BrowserRouter>
    </>
  );
};

export default App;
