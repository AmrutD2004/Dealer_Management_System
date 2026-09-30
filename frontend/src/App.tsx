import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { Toaster } from "./components/ui/toast";
import { Skeleton } from "./components/ui/skeleton";

import { TenantsProvider } from "./components/Tenants";
import { PlansProvider } from "./components/Plans";
import { PlatformUsersProvider } from "./components/PlatformUsers";

// Lazy-loaded pages
const LoginPage = lazy(() =>
  import("./Pages/LoginPage").then((m) => ({
    default: m.LoginPage,
  })),
);

const SignUpPage = lazy(() =>
  import("./Pages/SignUpPage").then((m) => ({
    default: m.SignUpPage,
  })),
);

const PlatformDashboard = lazy(
  () => import("./Pages/Platform/PlatformDashboard"),
);

const Tenants = lazy(() => import("./Pages/Platform/Tenants"));

const TenantCreate = lazy(() => import("./Pages/Platform/TenantCreate"));

const Plans = lazy(() => import("./Pages/Platform/Plans"));

const PlatformUsers = lazy(() => import("./Pages/Platform/PlatformUsers"));

// Loading fallback
function RouteFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Skeleton className="h-8 w-48" />
    </div>
  );
}

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
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignUpPage />} />

                  {/* Default route */}
                  <Route
                    path="/"
                    element={<Navigate to="/dashboard" replace />}
                  />

                  {/* Platform Admin */}
                  <Route path="/dashboard" element={<PlatformDashboard />} />

                  {/* Platform User Management */}
                  <Route path="/platform-users" element={<PlatformUsers />} />

                  {/* Tenant Management */}
                  <Route path="/tenants" element={<Tenants />} />

                  <Route path="/tenants/create" element={<TenantCreate />} />

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
