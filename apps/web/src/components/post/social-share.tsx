import { Check, Copy, Share2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface SocialShareProps {
	title: string;
	slug: string;
	excerpt?: string;
}

export function SocialShare({ title, slug, excerpt }: SocialShareProps) {
	const [copied, setCopied] = useState(false);
	const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
	const postUrl = `${baseUrl}/blog/${slug}/`;

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(postUrl);
			setCopied(true);
			toast.success("Link copied!");
			setTimeout(() => setCopied(false), 2000);
		} catch {
			toast.error("Failed to copy link");
		}
	};

	const shareOnTwitter = () => {
		const text = `${title} - ${excerpt || "Check out this article"}`;
		const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(postUrl)}`;
		window.open(url, "_blank");
	};

	const shareOnLinkedIn = () => {
		const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`;
		window.open(url, "_blank");
	};

	return (
		<div className="flex items-center gap-2">
			<span className="font-medium text-foreground/60 text-sm">Share:</span>
			<div className="flex gap-2">
				<button
					onClick={shareOnTwitter}
					className="rounded-lg p-2 text-foreground/60 transition-colors duration-200 hover:bg-accent hover:text-foreground"
					title="Share on Twitter"
				>
					<svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
						<path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
					</svg>
				</button>
				<button
					onClick={shareOnLinkedIn}
					className="rounded-lg p-2 text-foreground/60 transition-colors duration-200 hover:bg-accent hover:text-foreground"
					title="Share on LinkedIn"
				>
					<svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
						<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.475-2.236-1.986-2.236-1.081 0-1.722.722-2.004 1.418-.103.249-.129.597-.129.946v5.441h-3.554s.05-8.844 0-9.768h3.554v1.391c.43-.666 1.199-1.616 2.922-1.616 2.135 0 3.735 1.39 3.735 4.38v5.613zM5.337 8.855c-1.144 0-1.915-.758-1.915-1.708 0-.951.77-1.708 1.915-1.708 1.144 0 1.916.757 1.916 1.708 0 .95-.772 1.708-1.916 1.708zm1.575 11.597H3.762V9.684h3.15v10.768zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
					</svg>
				</button>
				<button
					onClick={handleCopy}
					className="rounded-lg p-2 text-foreground/60 transition-colors duration-200 hover:bg-accent hover:text-foreground"
					title="Copy link"
				>
					{copied ? (
						<Check className="h-5 w-5" />
					) : (
						<Copy className="h-5 w-5" />
					)}
				</button>
			</div>
		</div>
	);
}
