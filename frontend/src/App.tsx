import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { Toaster } from "./components/ui/toast";
import { Skeleton } from "./components/ui/skeleton";


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
       
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpPage />} />

              <Route
                path="/"
                element={<Navigate to="/dashboard" replace />}
              />

              <Route path="/dashboard" element={<Dashboard />} />

              <Route path="/tenants" element={<Tenants />} />

              <Route path="/tenants/create" element={<TenantCreate />} />
            </Routes>
          </Suspense>
        
      </BrowserRouter>
    </>
  );
};

export default App;
