import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth";
import DashboardPage from "@/pages/dashboard";
import GstReturnsPage from "@/pages/gst-returns";
import AnalyticsPage from "@/pages/analytics";
import ReportsPage from "@/pages/reports";
import InvoiceUploadPage from "@/pages/invoice-upload";
import CompliancePage from "@/pages/compliance";
import SettingsPage from "@/pages/settings";
import LoadingScreen from "@/components/ui/loading-screen";
import IntroAnimation from "@/components/intro/intro-animation";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { NotificationProvider } from "@/hooks/use-notification";
import { NavigationProvider, useNavigation } from "@/hooks/use-navigation";
import NavigationLoader from "@/components/ui/navigation-loader";
import { useEffect, useState } from "react";

function AppRouter() {
  const { user, isLoading } = useAuth();
  const { isNavigating } = useNavigation();
  const [showIntro, setShowIntro] = useState(true);

  const handleIntroComplete = () => {
    setShowIntro(false);
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  // Always show intro on app restart when not logged in
  if (showIntro && !user) {
    return <IntroAnimation onComplete={handleIntroComplete} />;
  }

  return (
    <>
      {isNavigating && <NavigationLoader />}
      <AnimatePresence mode="wait">
        <Switch>
          <Route path="/" component={user ? DashboardPage : AuthPage} />
          <Route path="/auth" component={AuthPage} />
          <Route path="/dashboard" component={user ? DashboardPage : AuthPage} />
          <Route path="/gst-returns" component={user ? GstReturnsPage : AuthPage} />
          <Route path="/analytics" component={user ? AnalyticsPage : AuthPage} />
          <Route path="/reports" component={user ? ReportsPage : AuthPage} />
          <Route path="/invoice-upload" component={user ? InvoiceUploadPage : AuthPage} />
          <Route path="/compliance" component={user ? CompliancePage : AuthPage} />
          <Route path="/settings" component={user ? SettingsPage : AuthPage} />
          <Route component={NotFound} />
        </Switch>
      </AnimatePresence>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NavigationProvider>
          <NotificationProvider>
            <TooltipProvider>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="min-h-screen font-inter"
              >
                <AppRouter />
                <Toaster />
              </motion.div>
            </TooltipProvider>
          </NotificationProvider>
        </NavigationProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
