import { useState } from "react";
import { Plus, BarChart3, Bell, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleFAB = () => {
    setIsOpen(!isOpen);
  };

  const fabActions = [
    {
      icon: BarChart3,
      label: "View Chart",
      color: "bg-[var(--accent-blue)]",
      onClick: () => {
        document.getElementById("interactive-chart")?.scrollIntoView({ behavior: "smooth" });
        setIsOpen(false);
      },
    },
    {
      icon: Bell,
      label: "Alerts",
      color: "bg-[var(--warning-amber)]",
      onClick: () => {
        console.log("Open alerts");
        setIsOpen(false);
      },
    },
    {
      icon: TrendingUp,
      label: "New Trade",
      color: "bg-[var(--success-green)]",
      onClick: () => {
        console.log("Open new trade dialog");
        setIsOpen(false);
      },
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="relative">
        {/* FAB Menu */}
        <div
          className={`absolute bottom-16 right-0 space-y-2 transition-all duration-300 ${
            isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        >
          {fabActions.map((action, index) => (
            <Button
              key={index}
              size="sm"
              className={`w-12 h-12 ${action.color} hover:scale-110 transition-all duration-200 rounded-full shadow-lg flex items-center justify-center text-white border-0`}
              onClick={action.onClick}
              title={action.label}
            >
              <action.icon size={16} />
            </Button>
          ))}
        </div>

        {/* Main FAB */}
        <Button
          size="lg"
          className="w-14 h-14 bg-gradient-to-r from-[var(--success-green)] to-[var(--accent-blue)] rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group border-0"
          onClick={toggleFAB}
        >
          <Plus
            className={`text-white text-xl transition-transform duration-300 ${
              isOpen ? "rotate-45" : "rotate-0"
            }`}
            size={20}
          />
        </Button>
      </div>
    </div>
  );
}
