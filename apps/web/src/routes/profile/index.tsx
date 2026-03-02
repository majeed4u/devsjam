import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Calendar, Edit2, Mail, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { orpc } from "@/utils/orpc";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PostCard } from "@/components/post/post-card";

export const Route = createFileRoute("/profile/")({
	component: ProfileComponent,
});

function ProfileComponent() {
	const navigate = useNavigate();
	const { data: session, isPending: sessionPending } = authClient.useSession();

	// Redirect if not authenticated
	if (!sessionPending && !session) {
		navigate({ to: "/login" });
		return null;
	}

	return (
		<main className="min-h-screen">
			<section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
				{sessionPending ? (
					<div className="space-y-6">
						<Skeleton className="h-32 w-full" />
						<Skeleton className="h-64 w-full" />
					</div>
				) : session ? (
					<ProfileContent session={session} />
				) : null}
			</section>
		</main>
	);
}

function ProfileContent({ session }: { session: any }) {
	const [isEditing, setIsEditing] = useState(false);
	const [formData, setFormData] = useState({
		name: session.user.name || "",
		bio: "",
	});

	// Fetch user's posts
	const { data: posts = [], isLoading: postsLoading } = useQuery({
		queryKey: ["user-posts", session.user.id],
		queryFn: async () => {
			// This would be a new API endpoint
			return [];
		},
	});

	// Update profile mutation
	const updateProfile = useMutation({
		mutationFn: async (data: typeof formData) => {
			// This would call an API to update the user profile
			// For now, we'll just simulate it
			await new Promise((resolve) => setTimeout(resolve, 1000));
			return data;
		},
		onSuccess: () => {
			toast.success("Profile updated successfully");
			setIsEditing(false);
		},
		onError: (error) => {
			toast.error(error.message || "Failed to update profile");
		},
	});

	const handleSave = () => {
		if (!formData.name.trim()) {
			toast.error("Name is required");
			return;
		}
		updateProfile.mutate(formData);
	};

	const memberSince = new Date(session.user.createdAt || Date.now()).toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});

	return (
		<div className="space-y-8">
			{/* Header */}
			<header>
				<h1 className="font-semibold text-3xl text-foreground sm:text-4xl">
					My Profile
				</h1>
				<p className="mt-2 text-foreground/60 text-sm">
					Manage your account and view your activity
				</p>
			</header>

			{/* Profile Card */}
			<Card>
				<CardHeader>
					<div className="flex items-start justify-between">
						<div className="flex items-center gap-4">
							<Avatar className="h-20 w-20">
								{session.user.image ? (
									<AvatarImage src={session.user.image} alt={session.user.name} />
								) : null}
								<AvatarFallback className="bg-primary/10 text-primary text-2xl font-medium">
									{session.user.name?.charAt(0).toUpperCase() || "U"}
								</AvatarFallback>
							</Avatar>
							<div>
								<CardTitle className="text-2xl">{session.user.name}</CardTitle>
								<CardDescription className="flex items-center gap-1 mt-1">
									<Mail className="h-3.5 w-3.5" />
									{session.user.email}
								</CardDescription>
							</div>
						</div>
						<Dialog open={isEditing} onOpenChange={setIsEditing}>
							<DialogTrigger asChild>
								<Button variant="outline" size="sm" className="gap-2">
									<Edit2 className="h-4 w-4" />
									Edit Profile
								</Button>
							</DialogTrigger>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>Edit Profile</DialogTitle>
									<DialogDescription>
										Update your profile information
									</DialogDescription>
								</DialogHeader>
								<div className="space-y-4 py-4">
									<div className="space-y-2">
										<Label htmlFor="name">Name</Label>
										<Input
											id="name"
											value={formData.name}
											onChange={(e) =>
												setFormData({ ...formData, name: e.target.value })
											}
											placeholder="Your name"
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="bio">Bio</Label>
										<Textarea
											id="bio"
											value={formData.bio}
											onChange={(e) =>
												setFormData({ ...formData, bio: e.target.value })
											}
											placeholder="Tell us about yourself"
											rows={3}
										/>
									</div>
								</div>
								<DialogFooter>
									<Button
										variant="outline"
										onClick={() => setIsEditing(false)}
										disabled={updateProfile.isPending}
									>
										Cancel
									</Button>
									<Button
										onClick={handleSave}
										disabled={updateProfile.isPending}
									>
										{updateProfile.isPending ? "Saving..." : "Save Changes"}
									</Button>
								</DialogFooter>
							</DialogContent>
						</Dialog>
					</div>
				</CardHeader>
				<CardContent>
					<div className="grid gap-4 sm:grid-cols-2">
						<div className="flex items-center gap-3 text-sm">
							<User className="h-4 w-4 text-foreground/60" />
							<span className="text-foreground/60">Role:</span>
							<span className="font-medium capitalize">{session.user.role}</span>
						</div>
						<div className="flex items-center gap-3 text-sm">
							<Calendar className="h-4 w-4 text-foreground/60" />
							<span className="text-foreground/60">Member since:</span>
							<span className="font-medium">{memberSince}</span>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* User's Posts */}
			<section>
				<div className="mb-6">
					<h2 className="font-semibold text-xl text-foreground">My Posts</h2>
					<p className="mt-1 text-foreground/60 text-sm">
						Posts you've published on the blog
					</p>
				</div>
				{postsLoading ? (
					<div className="flex items-center justify-center py-12">
						<div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
					</div>
				) : posts.length > 0 ? (
					<div className="space-y-8">
						{posts.map((post) => (
							<PostCard key={post.id} post={post} />
						))}
					</div>
				) : (
					<Card>
						<CardContent className="py-12 text-center">
							<p className="text-foreground/60 text-sm">
								You haven't published any posts yet.
							</p>
							<Button
								variant="outline"
								className="mt-4"
								onClick={() => navigate({ to: "/admin/post/new" })}
							>
								Create Your First Post
							</Button>
						</CardContent>
					</Card>
				)}
			</section>

			{/* Quick Stats */}
			<section className="grid gap-4 sm:grid-cols-3">
				<Card>
					<CardHeader className="pb-3">
						<CardDescription>Total Posts</CardDescription>
						<CardTitle className="text-3xl">{posts.length}</CardTitle>
					</CardHeader>
				</Card>
				<Card>
					<CardHeader className="pb-3">
						<CardDescription>Comments</CardDescription>
						<CardTitle className="text-3xl">0</CardTitle>
					</CardHeader>
				</Card>
				<Card>
					<CardHeader className="pb-3">
						<CardDescription>Profile Views</CardDescription>
						<CardTitle className="text-3xl">0</CardTitle>
					</CardHeader>
				</Card>
			</section>
		</div>
	);
}
