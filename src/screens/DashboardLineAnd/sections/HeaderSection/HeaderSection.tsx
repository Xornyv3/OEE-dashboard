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
  <header className="w-full border-b border-[#4F4F59] px-4 sm:px-6 md:px-8 py-4 md:py-5 bg-[#020202]">
    <div className="space-y-4">
      {/* Row 1: Title (single line) + status/time/role */}
      <div className="flex items-start justify-between gap-6 flex-wrap">
        <div className="relative z-10 min-w-0">
          <h1 className="font-display font-bold text-white text-2xl sm:text-3xl md:text-[38px] md:leading-[44px] tracking-tight uppercase whitespace-nowrap">
            Blue Upgrade Technology
          </h1>
        </div>
        <div className="flex items-center gap-3 sm:gap-4 md:gap-5 flex-wrap justify-end">
          <div className="hidden sm:flex items-center gap-3 px-3 sm:px-4 py-2 rounded-[6px] border border-[#4F4F59] bg-[#191921]">
            <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
            <span className="text-white text-sm font-medium">System Online</span>
          </div>
          <div className="hidden sm:block px-4 sm:px-5 py-2.5 rounded-[6px] border border-[#4F4F59] bg-[#191921]">
            <div className="text-white text-sm font-sans font-medium tracking-normal tabular-nums">{currentDateTime}</div>
            <div className="text-[#9B9BA6] text-xs mt-1">Local Time</div>
          </div>
          <div className="min-w-[160px] sm:min-w-[200px]">
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
        </div>
      </div>
      {/* Row 2: Tagline + Search */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
        <p className="text-[#9B9BA6] text-[14px] leading-[20px] font-medium tracking-normal">
          Smart OEE & Productivity Dashboard
        </p>
        <div className="relative w-full max-w-md lg:ml-auto">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9B9BA6]" />
          <Input
            className="w-full pl-10 pr-4 py-2.5 bg-[#151518] text-white border border-[#4F4F59] rounded-[6px] placeholder:text-[#9B9BA6] focus-visible:border-action-interactiveBlue font-sans"
            placeholder="Search here..."
          />
        </div>
      </div>
    </div>
  </header>
  );
};