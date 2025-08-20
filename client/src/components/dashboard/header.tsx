import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { Bell, Search, User } from "lucide-react";

export default function Header() {
  const { user } = useAuth();

  const headerVariants = {
    hidden: { y: -50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.header
      variants={headerVariants}
      initial="hidden"
      animate="visible"
      className="glass-effect backdrop-blur-sm p-6 sticky top-0 z-30"
      data-testid="dashboard-header"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800" data-testid="header-title">
            Dashboard Overview
          </h1>
          <p className="text-gray-600 mt-1" data-testid="header-subtitle">
            Welcome back! Here's what's happening with your GST compliance.
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="outline"
              size="icon"
              className="relative p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover-lift"
              data-testid="notification-button"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs animate-pulse p-0"
                data-testid="notification-badge"
              >
                3
              </Badge>
            </Button>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="outline"
              size="icon"
              className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover-lift"
              data-testid="search-button"
            >
              <Search className="w-5 h-5 text-gray-600" />
            </Button>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative"
          >
            <Button
              variant="outline"
              className="flex items-center space-x-3 p-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover-lift"
              data-testid="user-button"
            >
              <Avatar className="w-10 h-10">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600">
                  <User className="w-4 h-4 text-white" />
                </AvatarFallback>
              </Avatar>
              <span className="font-medium text-gray-700 pr-2" data-testid="user-name-header">
                {user?.name || "John Doe"}
              </span>
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
}
