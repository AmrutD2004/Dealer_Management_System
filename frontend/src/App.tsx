import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { Toaster } from "./components/ui/toast";
import { Skeleton } from "./components/ui/skeleton";
import { PlatformUserContextProvider } from "./contexts/platformUserContext";
import PlatformuserProtected from "./Protecteds/PlatformuserProtected";
import { Loader2 } from "lucide-react";



const LoginPage = lazy(() =>
  import("./Pages/LoginPage").then((m) => ({ default: m.LoginPage })),
);
const SignUpPage = lazy(() =>
  import("./Pages/SignUpPage").then((m) => ({ default: m.SignUpPage })),
);
const Dashboard = lazy(() => import("./Pages/Dashboard"));
const Tenants = lazy(() => import("./Pages/Platform/Tenants"));
const TenantCreate = lazy(() => import("./Pages/Platform/TenantCreate"));

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

            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/tenants" element={<PlatformUserContextProvider><PlatformuserProtected><Tenants /></PlatformuserProtected></PlatformUserContextProvider>} />

            <Route path="/tenants/create" element={<PlatformUserContextProvider><PlatformuserProtected><TenantCreate /></PlatformuserProtected></PlatformUserContextProvider>} />
          </Routes>
        </Suspense>

      </BrowserRouter>
    </>
  );
};

export default App;
