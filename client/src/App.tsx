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
import CommunityMember from "@/pages/community-member";
import BasicPlanView from "@/pages/basic-plan-view";
import GeneralChat from "@/pages/general-chat";
import BasicChat from "@/pages/basic-chat";
import IntermediateChat from "@/pages/intermediate-chat";
import VideoCall from "@/pages/video-call";
import ScheduleMeeting from "@/pages/schedule-meeting";
import ScheduleClarissa from "@/pages/schedule-clarissa";
import ClarissaChat from "@/pages/clarissa-chat";

import SpecialistLogin from "@/pages/specialist-login";
import SpecialistDashboard from "@/pages/specialist-dashboard";
import SpecialistAgenda from "@/pages/specialist-agenda";
import SpecialistClients from "@/pages/specialist-clients";
import SpecialistMessages from "@/pages/specialist-messages";
import AdminDashboard from "@/pages/admin-dashboard";
import AdminUsers from "@/pages/admin-users";
import MetaSyncAdmin from "@/pages/metasync-admin";
import CompanyManagement from "@/pages/company-management";
import CompanyLogin from "@/pages/company-login";
import EmailVerification from "@/pages/email-verification";
import AnalyticsDashboard from "@/pages/analytics-dashboard";
import InviteMembers from "@/pages/invite-members";
import UserManagement from "@/pages/user-management";
import LiveRooms from "@/pages/live-rooms";
import LiveModeration from "@/pages/live-moderation";
import Landing from "@/pages/landing";
import Login from "@/pages/login";
import Onboarding from "@/pages/onboarding";
import AIAssistant from "@/pages/ai-assistant";
import NotFound from "@/pages/not-found";
import CompanyAdminDashboard from "@/pages/company-admin-dashboard";
import UserDashboard from "@/pages/user-dashboard";
import WhatsAppSettings from "@/pages/whatsapp-settings";
import VideoRoom from "@/pages/video-room";
import SpecialistRoomModeration from "@/pages/specialist-room-moderation";
import SpecialistDashboardMain from "@/pages/specialist-dashboard-main";

function Router() {
  return (
    <Switch>
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/spaces" component={Spaces} />
      <Route path="/events" component={Events} />
      <Route path="/members" component={Members} />
      <Route path="/ranking" component={Ranking} />
      <Route path="/courses" component={Courses} />
      <Route path="/calendar" component={Calendar} />
      <Route path="/client-view" component={ClientView} />
      <Route path="/community-member" component={CommunityMember} />
      <Route path="/basic-plan" component={BasicPlanView} />
      <Route path="/general-chat" component={GeneralChat} />
      <Route path="/basic-chat" component={BasicChat} />
      <Route path="/intermediate-chat" component={IntermediateChat} />
      <Route path="/video-call" component={VideoCall} />
      <Route path="/schedule-meeting" component={ScheduleMeeting} />
      <Route path="/schedule-clarissa" component={ScheduleClarissa} />
      <Route path="/clarissa-chat" component={ClarissaChat} />

      <Route path="/specialist-dashboard" component={SpecialistDashboard} />
      <Route path="/specialist-main" component={SpecialistDashboardMain} />
      <Route path="/specialist-room-moderation" component={SpecialistRoomModeration} />
      <Route path="/specialist-agenda" component={SpecialistAgenda} />
      <Route path="/specialist-clients" component={SpecialistClients} />
      <Route path="/specialist-messages" component={SpecialistMessages} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin-dashboard" component={AdminDashboard} />
      <Route path="/admin/users" component={AdminUsers} />
      <Route path="/metasync-admin" component={MetaSyncAdmin} />
      <Route path="/email-verification" component={EmailVerification} />
      <Route path="/analytics-dashboard" component={AnalyticsDashboard} />
      <Route path="/invite-members" component={InviteMembers} />
      <Route path="/user-management" component={UserManagement} />
      <Route path="/live-rooms" component={LiveRooms} />
      <Route path="/live-moderation" component={LiveModeration} />
      <Route path="/ai-assistant" component={AIAssistant} />
      <Route path="/settings" component={Settings} />
      <Route path="/whatsapp-settings" component={WhatsAppSettings} />
      <Route path="/" component={ClientView} />
      <Route component={NotFound} />
    </Switch>
  );
}

function StandaloneRouter() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/onboarding" component={Onboarding} />
      <Route path="/company-management" component={CompanyManagement} />
      <Route path="/company/:slug" component={CompanyLogin} />
      <Route path="/specialist-login" component={SpecialistLogin} />
      <Route component={Landing} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/onboarding" component={Onboarding} />
            <Route path="/company-management" component={CompanyManagement} />
            <Route path="/company/:slug" component={CompanyLogin} />
            <Route path="/company-admin/:slug" component={CompanyAdminDashboard} />
            <Route path="/specialist/:slug" component={SpecialistDashboard} />
            <Route path="/specialist/:slug/moderation" component={SpecialistRoomModeration} />
            <Route path="/user-dashboard/:slug" component={UserDashboard} />
            <Route path="/video-room/:roomId" component={VideoRoom} />
            <Route path="/specialist-login" component={SpecialistLogin} />
            <Route component={() => 
              <AppLayout>
                <Router />
              </AppLayout>
            } />
          </Switch>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
