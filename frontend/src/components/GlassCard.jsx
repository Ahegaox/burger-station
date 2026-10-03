export default function GlassCard({ className = "", children }) {
  return (
    <div
      className={`rounded-3xl border border-white/75 bg-white/60 shadow-[0_24px_60px_rgba(15,76,92,0.18)] backdrop-blur-xl backdrop-saturate-150 ${className}`}
    >
      {children}
    </div>
  );
}