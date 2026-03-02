import { useEffect, useState } from "react";

interface ReadingProgressProps {
	targetId?: string;
}

export function ReadingProgress({ targetId = "post-content" }: ReadingProgressProps) {
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		const targetElement = document.getElementById(targetId);
		if (!targetElement) return;

		const handleScroll = () => {
			const windowHeight = window.innerHeight;
			const documentHeight = document.documentElement.scrollHeight;
			const scrollTop = window.scrollY;
			const targetTop = targetElement.offsetTop;
			const targetHeight = targetElement.offsetHeight;
			const targetBottom = targetTop + targetHeight;

			// Calculate progress based on target element visibility
			let progressPercentage = 0;

			// Before the target element
			if (scrollTop < targetTop) {
				progressPercentage = 0;
			}
			// Past the target element
			else if (scrollTop + windowHeight > targetBottom) {
				progressPercentage = 100;
			}
			// Within the target element
			else {
				const scrolledWithinTarget = scrollTop - targetTop;
				const visibleTargetHeight = targetHeight - windowHeight;
				progressPercentage = (scrolledWithinTarget / visibleTargetHeight) * 100;
			}

			// Clamp between 0 and 100
			setProgress(Math.min(100, Math.max(0, progressPercentage)));
		};

		// Initial calculation
		handleScroll();

		// Add scroll listener with passive flag for better performance
		window.addEventListener("scroll", handleScroll, { passive: true });

		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, [targetId]);

	return (
		<div className="bg-primary/10 fixed top-0 left-0 right-0 z-50 h-1 w-full">
			<div
				className="bg-primary h-full transition-all duration-150 ease-out"
				style={{ width: `${progress}%` }}
			/>
		</div>
	);
}
