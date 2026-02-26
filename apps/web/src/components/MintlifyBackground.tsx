export const MintlifyBackground = () => {
  return (
    <div className="fixed inset-0 -z-50 h-screen w-screen bg-background overflow-hidden pointer-events-none select-none">
      {/* Subtle top-right warm glow */}
      <div
        className="absolute top-0 right-0 w-[600px] h-[600px] opacity-[0.04] -translate-y-1/3 translate-x-1/4"
        style={{
          background: `radial-gradient(circle, var(--foreground) 0%, transparent 70%)`,
        }}
      />

      {/* Minimal grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(var(--border) 1px, transparent 1px),
            linear-gradient(90deg, var(--border) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />
    </div>
  );
};
