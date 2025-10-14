import {
  ActivityIcon,
  BarChart3Icon,
  ClockIcon,
  DatabaseIcon,
  PieChartIcon,
  SettingsIcon,
  StarIcon,
  ZapIcon,
  InfoIcon,
  TrendingUpIcon,
  GaugeIcon,
  RadioIcon,
  WrenchIcon,
  MicroscopeIcon,
  BrainIcon,
  LeafIcon,
} from "lucide-react";
import { ScrollArea } from "../../../../components/ui/scroll-area";
import { ActiveTab } from "../../DashboardLineAnd";

interface NavigationMenuSectionProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

export const NavigationMenuSection = ({ activeTab, onTabChange }: NavigationMenuSectionProps): JSX.Element => {
  const menuItems = [
    {
      title: "Dashboard Overview",
      icon: <BarChart3Icon className="h-7 w-7" />,
      tabKey: "dashboard-line-machine" as ActiveTab,
    },
    {
      title: "Real-time Monitoring",
      icon: <RadioIcon className="h-7 w-7" />,
      tabKey: "real-time-monitoring" as ActiveTab,
    },
    {
      title: "Maintenance & PdM",
      icon: <WrenchIcon className="h-7 w-7" />,
      tabKey: "maintenance-pdm" as ActiveTab,
    },
    {
      title: "Quality & Traceability",
      icon: <MicroscopeIcon className="h-7 w-7" />,
      tabKey: "quality-traceability" as ActiveTab,
    },
    {
      title: "Advanced Analytics",
      icon: <BrainIcon className="h-7 w-7" />,
      tabKey: "advanced-analytics" as ActiveTab,
    },
    {
      title: "Role Home",
      icon: <InfoIcon className="h-7 w-7" />,
      tabKey: "role-home" as ActiveTab,
    },
    {
      title: "Planning & Scheduling",
      icon: <TrendingUpIcon className="h-7 w-7" />,
      tabKey: "planning" as ActiveTab,
    },
    {
      title: "Machine & Line Performance",
      icon: <GaugeIcon className="h-7 w-7" />,
      tabKey: "machine-line-performance" as ActiveTab,
    },
    {
      title: "Work Order Tracking",
      icon: <ClockIcon className="h-7 w-7" />,
      tabKey: "working-order-follow-up" as ActiveTab,
    },
    {
      title: "Dashboard Count",
      icon: <TrendingUpIcon className="h-7 w-7" />,
      tabKey: "dashboard-count" as ActiveTab,
    },
    {
      title: "Historical data",
      icon: <DatabaseIcon className="h-7 w-7" />,
      tabKey: "historical-data" as ActiveTab,
    },
    {
      title: "Machine maintenance",
      icon: <ActivityIcon className="h-7 w-7" />,
      tabKey: "machine-maintenance" as ActiveTab,
    },
    {
      title: "Energy Monitoring",
      icon: <ZapIcon className="h-7 w-7" />,
      tabKey: "energy-monitoring" as ActiveTab,
    },
    {
      title: "Energy & Sustainability",
      icon: <LeafIcon className="h-7 w-7" />,
      tabKey: "energy-sustainability" as ActiveTab,
    },
    {
      title: "Dashboard Cost & Profit",
      icon: <PieChartIcon className="h-7 w-7" />,
      tabKey: "cost-profit" as ActiveTab,
    },
    {
      title: "OEE Data Input",
      icon: <StarIcon className="h-7 w-7" />,
      tabKey: "oee-data-input" as ActiveTab,
    },
    {
      title: "Settings",
      icon: <SettingsIcon className="h-7 w-7" />,
      tabKey: "settings" as ActiveTab,
    },
  ];

  return (
    <nav className="h-full w-full relative bg-[#020202] overflow-hidden transition-all duration-300 ease-out">
      <ScrollArea className="h-full hide-scrollbar">
        <div className="flex flex-col items-center py-6 space-y-2 transition-all duration-300 ease-out">
          {/* Compact Logo */}
          <div className="w-12 h-12 rounded-[6px] border border-[#4F4F59] bg-[#191921] flex items-center justify-center mx-auto">
            {/* Minimal logo: small tilted diamond with a centered dot */}
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-label="Logo">
              <rect x="4" y="4" width="16" height="16" transform="rotate(45 12 12)" rx="2.5" ry="2.5" className="fill-white/10 stroke-white" strokeWidth="1.5" />
              <circle cx="12" cy="12" r="4" className="fill-white" />
            </svg>
          </div>

          {/* Divider */}
          <div className="w-8 h-px bg-[#4F4F59] my-2" />

          {/* Icons + labels (icons fixed, labels reveal on hover) */}
          <div className="flex flex-col items-center gap-1 w-full">
            {menuItems.map((item, index) => {
              const isActive = activeTab === item.tabKey;
              return (
                <button
                  key={index}
                  onClick={() => onTabChange(item.tabKey)}
                  className={`group relative w-full h-12 text-left flex items-center pl-0 pr-4 rounded-[6px] transition-colors duration-150 ${
                    isActive ? 'bg-[#191921] border border-brand-primary' : 'hover:bg-[#191921]'
                  }`}
                  title={item.title}
                >
                  <div className="h-12 w-20 flex items-center justify-center">
                    <span className={isActive ? 'text-brand-primary' : 'text-[#9B9BA6] group-hover:text-white'}>
                      {item.icon}
                    </span>
                  </div>
                  <span
                    className={`${isActive ? 'text-brand-primary' : 'text-[#EAEAEA] group-hover:text-white'} text-sm font-medium whitespace-nowrap`}
                  >
                    {item.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </ScrollArea>
    </nav>
  );
};