import React from 'react';

/**
 * Legacy file name retained for import stability. Renders the full brand lockup.
 */
export const ProdexLogo: React.FC<{ className?: string }>=({ className })=>{
	return (
		<div className={className} aria-label="Blue Upgrade Technology logo">
			<div className="flex items-center gap-2">
				<div className="relative w-7 h-7">
					<span className="absolute inset-0 rounded-md bg-gradient-to-br from-blue-400 via-sky-500 to-indigo-500 animate-pulse [animation-duration:4s]" />
					<span className="absolute inset-[2px] rounded-sm bg-[#050507] flex items-center justify-center text-[10px] font-bold tracking-wide text-white/90 font-sans select-none">
						B
					</span>
				</div>
				<span className="font-display font-semibold text-white tracking-tight text-[15px] leading-none">
					Blue <span className="text-white/70">Upgrade</span> <span className="text-white/50">Technology</span>
				</span>
			</div>
		</div>
	);
};

export default ProdexLogo;
