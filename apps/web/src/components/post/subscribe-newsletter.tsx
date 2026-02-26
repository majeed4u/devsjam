import { Mail, ArrowRight } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

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
    } catch {
      toast.error("Failed to subscribe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-12">
      <div className="rounded-lg border border-border/40 bg-gradient-to-r from-primary/10 to-primary/5 p-8 sm:p-12">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-lg bg-primary/20">
              <Mail className="h-6 w-6 text-primary" />
            </div>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold mb-2">Stay Updated</h3>
          <p className="text-foreground/60 mb-6">
            Subscribe to get the latest articles and insights delivered to your
            inbox.
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-2"
          >
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg border border-border bg-background/50 text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2 whitespace-nowrap"
            >
              {loading ? "Subscribing..." : "Subscribe"}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>

          <p className="text-xs text-foreground/50 mt-4">
            Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
}
