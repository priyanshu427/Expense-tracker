import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import AuthPage from "./pages/auth-page";
import { AuthProvider } from "@/hooks/use-auth";

// This is where we will put your main dashboard later
function Dashboard() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">You are logged in!</h1>
      <p>This is where the Expense Tracker dashboard will go.</p>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      {/* If logged in, go to Dashboard. If not, AuthPage handles the redirect */}
      <Route path="/" component={Dashboard} />
      <Route path="/auth" component={AuthPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;