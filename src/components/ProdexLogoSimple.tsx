import React from 'react';

/**
 * Simplified square mark variant (legacy filename kept).
 */
export const ProdexLogoSimple: React.FC<{ className?: string }>=({ className })=>{
	return (
		<div className={className} aria-label="Blue Upgrade Technology mark">
			<div className="relative w-7 h-7">
				<span className="absolute inset-0 rounded-md bg-gradient-to-br from-blue-400 via-sky-500 to-indigo-500" />
				<span className="absolute inset-[2px] rounded-sm bg-[#050507] flex items-center justify-center text-[10px] font-bold tracking-wide text-white/90 font-sans select-none">
					B
				</span>
			</div>
		</div>
	);
};

export default ProdexLogoSimple;
