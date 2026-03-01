import { useQuery } from "@tanstack/react-query";
import { MessageCircle, User } from "lucide-react";
import { useState } from "react";
import { CommentForm } from "./comment-form";
import { CommentItem } from "./comment-item";
import { orpc } from "@/utils/orpc";

interface CommentsSectionProps {
	postId: string;
}

export function CommentsSection({ postId }: CommentsSectionProps) {
	const [replyTo, setReplyTo] = useState<{ id: string; name: string } | null>(null);

	// Fetch comments
	const { data: comments, isLoading } = useQuery(
		orpc.comment.getByPost.queryOptions({ input: { postId } }),
	);

	// Fetch comment count
	const { data: commentCount } = useQuery(
		orpc.comment.getCount.queryOptions({ input: { postId } }),
	);

	const handleReply = (parentId: string, authorName: string) => {
		setReplyTo({ id: parentId, name: authorName });
		// Scroll to form
		document.getElementById("comment-form")?.scrollIntoView({ behavior: "smooth" });
	};

	const handleCancelReply = () => {
		setReplyTo(null);
	};

	const handleFormSuccess = () => {
		setReplyTo(null);
	};

	return (
		<section className="border-border/40 border-t pt-8 mt-8">
			<h2 className="mb-6 font-bold text-2xl">
				Discussion ({commentCount?.count ?? 0})
			</h2>

			{/* Comment Form */}
			<div id="comment-form" className="mb-8">
				<CommentForm
					postId={postId}
					parentId={replyTo?.id}
					replyToName={replyTo?.name}
					onCancel={handleCancelReply}
					onSuccess={handleFormSuccess}
				/>
			</div>

			{/* Comments List */}
			{isLoading ? (
				<div className="space-y-4">
					{[1, 2, 3].map((i) => (
						<div key={i} className="flex gap-3">
							<div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
							<div className="flex-1 space-y-2">
								<div className="h-4 w-32 animate-pulse rounded bg-muted" />
								<div className="h-16 w-full animate-pulse rounded bg-muted" />
							</div>
						</div>
					))}
				</div>
			) : comments && comments.length > 0 ? (
				<div className="space-y-4">
					{comments.map((comment: any) => (
						<CommentItem
							key={comment.id}
							comment={comment}
							postId={postId}
							onReply={handleReply}
						/>
					))}
				</div>
			) : (
				<div className="py-12 text-center">
					<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
						<MessageCircle className="h-6 w-6 text-foreground/40" />
					</div>
					<h3 className="font-medium text-foreground mb-1">
						No comments yet
					</h3>
					<p className="text-foreground/50 text-sm">
						Be the first to share your thoughts!
					</p>
				</div>
			)}
		</section>
	);
}
