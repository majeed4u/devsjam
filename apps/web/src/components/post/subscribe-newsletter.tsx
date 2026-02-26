import { ArrowRight, Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function SubscribeNewsletter() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    setLoading(true);
    try {
      // TODO: Integrate with your email service (Resend, Mailchimp, etc.)
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast.success("Thanks for subscribing!");
      setEmail("");
    } catch (err) {
      console.error("SubscribeNewsletter subscribe error", err);
      toast.error("Failed to subscribe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-12">
      <div className="rounded-lg border border-border/40 bg-linear-to-r from-primary/10 to-primary/5 p-8 sm:p-12">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-lg bg-primary/20 p-3">
              <Mail className="h-6 w-6 text-primary" />
            </div>
          </div>
          <h3 className="mb-2 font-bold text-2xl sm:text-3xl">Stay Updated</h3>
          <p className="mb-6 text-foreground/60">
            Subscribe to get the latest articles and insights delivered to your
            inbox.
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-2 sm:flex-row"
          >
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 rounded-lg border border-border bg-background/50 px-4 py-3 text-foreground transition-all duration-200 placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-colors duration-200 hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Subscribing..." : "Subscribe"}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </Button>
          </form>

          <p className="mt-4 text-foreground/50 text-xs">
            Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
}
