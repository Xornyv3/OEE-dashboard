import { SearchIcon } from "lucide-react";
import { Input } from "../../../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select";
import { useAuth } from "../../../../lib/auth";

export const HeaderSection = (): JSX.Element => {
  const { role, setRole } = useAuth();
  const currentDateTime = new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });

  return (
  <header className="w-full border-b border-[#4F4F59] px-8 py-6 bg-[#020202]">
      <div className="flex items-center justify-between">
        {/* Dashboard title */}
        <div className="relative z-10">
          <h1 className="font-display font-bold text-white text-[38px] leading-[44px] tracking-tight uppercase">
            Prodex
          </h1>
          <div className="flex items-center gap-3 mt-2">
            <p className="text-[#9B9BA6] text-[14px] leading-[20px] font-medium tracking-normal">Smart OEE & Productivity Dashboard</p>
            {/* Build tag to verify production updates */}
            <span
              title="Build identifier"
              className="px-2 py-0.5 rounded-[6px] border border-[#4F4F59] bg-[#191921] text-white/80 text-[12px] leading-[16px]"
            >
              Build v2
            </span>
          </div>
        </div>

    {/* Search, Role Switcher and DateTime */}
  <div className="flex items-center gap-6 relative z-10 mr-12">
          {/* Status Indicator */}
          <div className="flex items-center gap-3 px-4 py-2 rounded-[6px] border border-[#4F4F59] bg-[#191921]">
            <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
            <span className="text-white text-sm font-medium">System Online</span>
          </div>
          
          <div className="relative">
            <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#9B9BA6]" />
            <Input
              className="w-[320px] pl-12 pr-4 py-3 bg-[#151518] text-white border border-[#4F4F59] rounded-[6px] placeholder:text-[#9B9BA6] focus-visible:border-action-interactiveBlue font-sans"
              placeholder="Search here..."
            />
          </div>
          
          {/* Role switcher: Manager vs Worker */}
          <div className="min-w-[200px]">
            <Select value={role} onValueChange={v => setRole(v as any)}>
              <SelectTrigger className="h-10 bg-[#151518] text-white border border-[#4F4F59] rounded-[6px]">
                <SelectValue placeholder="Select mode" />
              </SelectTrigger>
              <SelectContent className="bg-white text-black border border-gray-200">
                <SelectItem value="manager" className="data-[highlighted]:bg-gray-100">Manager view</SelectItem>
                <SelectItem value="supervisor" className="data-[highlighted]:bg-gray-100">Supervisor</SelectItem>
                <SelectItem value="operator" className="data-[highlighted]:bg-gray-100">Worker view</SelectItem>
                <SelectItem value="executive" className="data-[highlighted]:bg-gray-100">Executive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="px-6 py-3 rounded-[6px] border border-[#4F4F59] bg-[#191921]">
            <div className="text-white text-sm font-sans font-medium tracking-normal">
              {currentDateTime}
            </div>
            <div className="text-[#9B9BA6] text-xs mt-1">Local Time</div>
          </div>
        </div>
      </div>
    </header>
  );
};