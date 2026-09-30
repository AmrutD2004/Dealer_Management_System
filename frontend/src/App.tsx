import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { Toaster } from "./components/ui/toast";
import { Skeleton } from "./components/ui/skeleton";

import { TenantsProvider } from "./components/Tenants";
import { PlansProvider } from "./components/Plans";

const LoginPage = lazy(() =>
  import("./Pages/LoginPage").then((m) => ({ default: m.LoginPage })),
);
const SignUpPage = lazy(() =>
  import("./Pages/SignUpPage").then((m) => ({ default: m.SignUpPage })),
);
const PlatformDashboard = lazy(
  () => import("./Pages/Platform/PlatformDashboard"),
);
const Tenants = lazy(() => import("./Pages/Platform/Tenants"));
const TenantCreate = lazy(() => import("./Pages/Platform/TenantCreate"));
const Plans = lazy(() => import("./Pages/Platform/Plans"));

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
            <Suspense fallback={<RouteFallback />}>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />

                <Route
                  path="/"
                  element={<Navigate to="/dashboard" replace />}
                />

                <Route path="/dashboard" element={<PlatformDashboard />} />

                <Route path="/tenants" element={<Tenants />} />

                <Route path="/tenants/create" element={<TenantCreate />} />

                <Route path="/plans" element={<Plans />} />

                <Route
                  path="*"
                  element={<Navigate to="/dashboard" replace />}
                />
              </Routes>
            </Suspense>
          </PlansProvider>
        </TenantsProvider>
      </BrowserRouter>
    </>
  );
};

export default App;
