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
  <header className="w-full border-b border-[#4F4F59] px-4 sm:px-6 md:px-8 py-4 md:py-6 bg-[#020202]">
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Dashboard title */}
        <div className="relative z-10">
          <h1 className="font-display font-bold text-white text-2xl sm:text-3xl md:text-[38px] md:leading-[44px] tracking-tight uppercase">
            Optimo
          </h1>
          <div className="flex items-center flex-wrap gap-2 sm:gap-3 mt-2">
            <p className="text-[#9B9BA6] text-[14px] leading-[20px] font-medium tracking-normal">Smart OEE & Productivity Dashboard</p>
            {/* Build tag to verify production updates */}
            <span
              title="Build identifier"
              className="px-2 py-0.5 rounded-[6px] border border-[#4F4F59] bg-[#191921] text-white/80 text-[12px] leading-[16px]"
            >
              Build v3
            </span>
          </div>
        </div>

    {/* Search, Role Switcher and DateTime */}
  <div className="flex items-center gap-3 sm:gap-4 md:gap-6 relative z-10 md:mr-12 flex-wrap">
          {/* Status Indicator */}
          <div className="hidden sm:flex items-center gap-3 px-3 sm:px-4 py-2 rounded-[6px] border border-[#4F4F59] bg-[#191921]">
            <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
            <span className="text-white text-sm font-medium">System Online</span>
          </div>
          
          <div className="relative w-full sm:w-auto">
            <SearchIcon className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-[#9B9BA6]" />
            <Input
              className="w-full sm:w-[280px] md:w-[320px] pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 bg-[#151518] text-white border border-[#4F4F59] rounded-[6px] placeholder:text-[#9B9BA6] focus-visible:border-action-interactiveBlue font-sans"
              placeholder="Search here..."
            />
          </div>
          
          {/* Role switcher: Manager vs Worker */}
          <div className="min-w-[160px] sm:min-w-[200px] w-full sm:w-auto">
            <Select value={role} onValueChange={v => setRole(v as any)}>
              <SelectTrigger className="h-10 bg-[#151518] text-white border border-[#4F4F59] rounded-[6px] w-full">
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

          <div className="hidden sm:block px-4 sm:px-6 py-2.5 sm:py-3 rounded-[6px] border border-[#4F4F59] bg-[#191921]">
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