import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { Toaster } from "./components/ui/toast";
import { Skeleton } from "./components/ui/skeleton";
import { PlatformUserContextProvider } from "./contexts/PlatformUserContext";
import PlatformuserProtected from "./Protecteds/PlatformuserProtected";
import { Loader2 } from "lucide-react";


import { TenantsProvider } from "./components/Tenants";
import { PlansProvider } from "./components/Plans";


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
    <div className='max-w-7xl mx-auto'>
      <div className='flex items-center justify-center min-h-screen'>
        <h1 className='flex items-center gap-2 text-muted-foreground text-3xl font-medium tracking-tight'><Loader2 size={38} className="animate-spin"/>Verifing Session....</h1>
      </div>
    </div>
  );
}

const App = () => {
  return (
    <>
      <Toaster />

      <BrowserRouter>


        <Suspense fallback={<RouteFallback />}>
          <Routes>

            <Route path="/login" element={<PlatformUserContextProvider><LoginPage /></PlatformUserContextProvider>} />
            <Route path="/signup" element={<SignUpPage />} />

            <Route
              path="/"
              element={<Navigate to="/dashboard" replace />}
            />

            <Route path="/dashboard" element={<PlatformDashboard />} />

            <Route path="/tenants" element={<PlatformUserContextProvider><PlatformuserProtected><Tenants /></PlatformuserProtected></PlatformUserContextProvider>} />

            <Route path="/tenants/create" element={<PlatformUserContextProvider><PlatformuserProtected><TenantCreate /></PlatformuserProtected></PlatformUserContextProvider>} />

            <Route path="/platform-users" element={<PlatformUserContextProvider><PlatformuserProtected><PlatformUsers /></PlatformuserProtected></PlatformUserContextProvider>} />
          </Routes>
          
        </Suspense>

      </BrowserRouter>
    </>
  );
};

export default App;
