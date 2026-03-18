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
import DocumentDetail from "@/pages/document-detail";
import Incoming from "@/pages/incoming";
import Outgoing from "@/pages/outgoing";
import ActivityLog from "@/pages/activity-log";
import Settings from "@/pages/settings";

import { Layout } from "@/components/layout";

const queryClient = new QueryClient();

// Auth Guard Component
function ProtectedRoute({ component: Component }: { component: React.ComponentType<any> }) {
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

function ProtectedRouteWithParams({ component: Component }: { component: React.ComponentType<any> }) {
  const { isLogged } = useAuth();
  
  if (!isLogged) return <Login />;

  return (
    <Route>
      {(params) => (
        <Layout>
          <Component params={params} />
        </Layout>
      )}
    </Route>
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
      <Route path="/incoming"><ProtectedRoute component={Incoming} /></Route>
      <Route path="/outgoing"><ProtectedRoute component={Outgoing} /></Route>
      <Route path="/activity-log"><ProtectedRoute component={ActivityLog} /></Route>
      <Route path="/settings"><ProtectedRoute component={Settings} /></Route>
      <Route path="/document/:id">
        {(params) => <ProtectedRoute component={() => <DocumentDetail params={params} />} />}
      </Route>
      
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
