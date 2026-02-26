export const MintlifyBackground = () => {
	return (
		<div className="pointer-events-none fixed inset-0 -z-50 h-screen w-screen select-none overflow-hidden bg-background">
			{/* 1. Main Background Radial Glow (The Greenish center) */}
			<div
				className="absolute inset-0 opacity-[0.15]"
				style={{
					background:
						"radial-gradient(circle at 50% 40%, var(--primary) 0%, transparent 70%)",
				}}
			/>

			{/* 2. Global Grid Overlay */}
			<div
				className="absolute inset-0 opacity-[0.05]"
				style={{
					backgroundImage: `
            linear-gradient(var(--border) 1px, transparent 1px),
            linear-gradient(90deg, var(--border) 1px, transparent 1px)
          `,
					backgroundSize: "40px 40px",
				}}
			/>

			{/* 3. Wireframe Assets (Top Layer) */}
			<div className="absolute inset-0">
				{/* Abstract Rocket Wireframe - Top Left */}
				<svg
					className="absolute top-[15%] left-[10%] h-48 w-48 rotate-[-15deg] text-primary opacity-20"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					strokeWidth="0.5"
				>
					<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
					<circle cx="12" cy="12" r="3" strokeDasharray="2 2" />
				</svg>

				{/* Floating Code Window Wireframe - Top Right */}
				<svg
					className="absolute top-[10%] right-[15%] h-64 w-64 rotate-[10deg] text-primary opacity-15"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					strokeWidth="0.5"
				>
					<rect x="2" y="4" width="20" height="16" rx="2" />
					<path d="M6 8h3M6 12h12M6 16h8" />
				</svg>
			</div>

			{/* 4. Small Dev-Specific Icons (Lower Section) */}
			<div className="absolute bottom-[15%] flex w-full items-center justify-center gap-16 px-10 opacity-30 md:gap-32">
				<svg
					className="h-16 w-16 text-primary"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="1"
				>
					<path d="M12 2l8.5 4v10L12 22l-8.5-6V6L12 2z" />
					<path d="M12 7v10M7 12h10M8.5 8.5l7 7M15.5 8.5l-7 7" />
					<circle cx="12" cy="12" r="3" />
				</svg>

				<div className="relative flex h-16 w-16 items-center justify-center rounded-sm border border-primary font-bold font-mono text-2xl text-primary">
					JS
					<div className="absolute -top-1 -right-1 h-2 w-2 animate-pulse rounded-full bg-primary" />
				</div>

				<svg
					className="h-16 w-16 text-primary"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="1"
				>
					<circle cx="12" cy="5" r="2" />
					<circle cx="5" cy="19" r="2" />
					<circle cx="19" cy="19" r="2" />
					<path d="M12 7v10M12 17l-5 2M12 17l5 2" />
					<path d="M7 19h10" strokeDasharray="2 2" />
				</svg>
			</div>

			{/* Radial Mask for Bottom Clarity */}
			<div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,transparent_0%,var(--background)_70%)] opacity-60" />
		</div>
	);
};
