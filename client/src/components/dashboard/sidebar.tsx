import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import {
  ChartLine,
  Gauge,
  File,
  BarChart3,
  Receipt,
  Upload,
  Shield,
  Settings,
  User
} from "lucide-react";
import { useState } from "react";

const navigation = [
  { name: "Dashboard", icon: Gauge, active: true },
  { name: "GST Returns", icon: File, active: false },
  { name: "Analytics", icon: BarChart3, active: false },
  { name: "Invoices", icon: Receipt, active: false },
  { name: "File Upload", icon: Upload, active: false },
  { name: "Compliance", icon: Shield, active: false },
  { name: "Settings", icon: Settings, active: false },
];

export default function Sidebar() {
  const { user } = useAuth();
  const [activeItem, setActiveItem] = useState("Dashboard");

  const sidebarVariants = {
    hidden: { x: -280, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.aside
      variants={sidebarVariants}
      initial="hidden"
      animate="visible"
      className="w-64 glass-dark text-white p-6 fixed h-full z-40"
      data-testid="sidebar"
    >
      <motion.div
        variants={itemVariants}
        className="flex items-center space-x-3 mb-8"
        data-testid="sidebar-header"
      >
        <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
          <ChartLine className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold" data-testid="sidebar-title">FinSync</h1>
          <p className="text-xs text-gray-300" data-testid="sidebar-subtitle">Professional Edition</p>
        </div>
      </motion.div>

      <nav className="space-y-2" data-testid="sidebar-nav">
        {navigation.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeItem === item.name;
          
          return (
            <motion.div
              key={item.name}
              variants={itemVariants}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Button
                variant="ghost"
                onClick={() => setActiveItem(item.name)}
                className={`nav-item-animated w-full justify-start space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                    : "text-gray-300 hover:bg-white/10 hover:text-white"
                }`}
                data-testid={`nav-item-${item.name.toLowerCase().replace(' ', '-')}`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Button>
            </motion.div>
          );
        })}
      </nav>

      <motion.div
        variants={itemVariants}
        className="absolute bottom-6 left-6 right-6"
        data-testid="sidebar-user"
      >
        <div className="glass-effect p-4 rounded-xl animate-pulse-glow">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback className="bg-gradient-to-r from-green-500 to-blue-500">
                <User className="w-4 h-4 text-white" />
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-sm" data-testid="user-name">
                {user?.name || "John Doe"}
              </p>
              <p className="text-xs text-gray-300" data-testid="user-plan">
                Premium Account
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.aside>
  );
}
