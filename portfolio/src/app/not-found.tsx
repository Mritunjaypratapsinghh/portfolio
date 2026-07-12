import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] text-[#e8e8f0]">
      <div className="text-center space-y-6 px-6">
        <div className="font-mono text-[#00d4ff] text-sm">ERROR 404</div>
        <h1 className="text-6xl md:text-8xl font-bold tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00d4ff] via-[#7b61ff] to-[#00ff88]">Lost</span>
        </h1>
        <p className="text-[#9a9abc] text-lg max-w-md mx-auto">
          This route doesn&apos;t exist. The page you&apos;re looking for has been moved or never existed.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#00d4ff]/10 border border-[#00d4ff]/40 rounded-xl text-[#00d4ff] font-medium hover:bg-[#00d4ff]/20 hover:border-[#00d4ff]/60 transition-all duration-300"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
