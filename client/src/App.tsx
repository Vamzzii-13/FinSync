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
import LoadingScreen from "@/components/ui/loading-screen";
import IntroAnimation from "@/components/intro/intro-animation";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { NotificationProvider } from "@/hooks/use-notification";
import { useEffect, useState } from "react";

function AppRouter() {
  const { user, isLoading } = useAuth();
  const [showIntro, setShowIntro] = useState(true);
  const [hasSeenIntro, setHasSeenIntro] = useState(false);

  // Check if user has seen intro in this session
  useEffect(() => {
    const introSeen = sessionStorage.getItem('intro-seen');
    if (introSeen && user) {
      setShowIntro(false);
      setHasSeenIntro(true);
    }
  }, [user]);

  const handleIntroComplete = () => {
    setShowIntro(false);
    setHasSeenIntro(true);
    sessionStorage.setItem('intro-seen', 'true');
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  // Show intro animation on first visit when not logged in
  if (showIntro && !user) {
    return <IntroAnimation onComplete={handleIntroComplete} />;
  }

  return (
    <AnimatePresence mode="wait">
      <Switch>
        <Route path="/" component={user ? DashboardPage : AuthPage} />
        <Route path="/auth" component={AuthPage} />
        <Route path="/dashboard" component={user ? DashboardPage : AuthPage} />
        <Route path="/gst-returns" component={user ? GstReturnsPage : AuthPage} />
        <Route path="/analytics" component={user ? AnalyticsPage : AuthPage} />
        <Route path="/reports" component={user ? ReportsPage : AuthPage} />
        <Route path="/invoice-upload" component={user ? InvoiceUploadPage : AuthPage} />
        <Route path="/compliance" component={user ? DashboardPage : AuthPage} />
        <Route path="/settings" component={user ? DashboardPage : AuthPage} />
        <Route component={NotFound} />
      </Switch>
    </AnimatePresence>
  );
}

function App() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <LoadingScreen />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
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
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
