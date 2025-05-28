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
import Courses from "@/pages/courses";
import Settings from "@/pages/settings";
import Calendar from "@/pages/calendar";
import ClientView from "@/pages/client-view";
import BasicPlanView from "@/pages/basic-plan-view";
import GeneralChat from "@/pages/general-chat";
import BasicChat from "@/pages/basic-chat";
import IntermediateChat from "@/pages/intermediate-chat";
import VideoCall from "@/pages/video-call";
import ScheduleMeeting from "@/pages/schedule-meeting";
import ScheduleClarissa from "@/pages/schedule-clarissa";
import LiveRooms from "@/pages/live-rooms";
import LiveModeration from "@/pages/live-moderation";
import Landing from "@/pages/landing";
import Onboarding from "@/pages/onboarding";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/onboarding" component={Onboarding} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/spaces" component={Spaces} />
      <Route path="/events" component={Events} />
      <Route path="/members" component={Members} />
      <Route path="/ranking" component={Ranking} />
      <Route path="/courses" component={Courses} />
      <Route path="/calendar" component={Calendar} />
      <Route path="/client-view" component={ClientView} />
      <Route path="/basic-plan" component={BasicPlanView} />
      <Route path="/general-chat" component={GeneralChat} />
      <Route path="/basic-chat" component={BasicChat} />
      <Route path="/intermediate-chat" component={IntermediateChat} />
      <Route path="/video-call" component={VideoCall} />
      <Route path="/schedule-meeting" component={ScheduleMeeting} />
      <Route path="/live-rooms" component={LiveRooms} />
      <Route path="/live-moderation" component={LiveModeration} />
      <Route path="/settings" component={Settings} />
      <Route path="/" component={Landing} />
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
