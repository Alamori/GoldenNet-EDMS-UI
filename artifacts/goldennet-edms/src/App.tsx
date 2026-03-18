import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { useAuth } from "@/hooks/use-auth";

// Pages
import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import Library from "@/pages/library";
import Upload from "@/pages/upload";
import Workflow from "@/pages/workflow";
import { Layout } from "@/components/layout";

const queryClient = new QueryClient();

// Auth Guard Component
function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { isLogged } = useAuth();
  
  if (!isLogged) {
    // Redirect to login handled by useAuth implicitly or we just render Login here
    return <Login />;
  }

  return (
    <Layout>
      <Component />
    </Layout>
  );
}

function Router() {
  const { isLogged } = useAuth();

  return (
    <Switch>
      <Route path="/">
        {isLogged ? <ProtectedRoute component={Dashboard} /> : <Login />}
      </Route>
      <Route path="/login" component={Login} />
      
      {/* Protected Routes */}
      <Route path="/dashboard"><ProtectedRoute component={Dashboard} /></Route>
      <Route path="/library"><ProtectedRoute component={Library} /></Route>
      <Route path="/upload"><ProtectedRoute component={Upload} /></Route>
      <Route path="/workflow"><ProtectedRoute component={Workflow} /></Route>
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
