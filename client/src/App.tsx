import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import AppLayout from "@/components/layout/app-layout";
import Dashboard from "@/pages/dashboard";
import Spaces from "@/pages/spaces";
import Events from "@/pages/events";
import Members from "@/pages/members";
import Ranking from "@/pages/ranking";
import Landing from "@/pages/landing";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/landing" component={Landing} />
      <Route path="/" component={Dashboard} />
      <Route path="/spaces" component={Spaces} />
      <Route path="/events" component={Events} />
      <Route path="/members" component={Members} />
      <Route path="/ranking" component={Ranking} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <AppLayout>
            <Router />
          </AppLayout>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
