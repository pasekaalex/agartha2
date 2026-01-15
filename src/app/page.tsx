"use client";

export default function Home() {
  const ca = "TTZcPnHQYcrktiyHej9GxLd2rcymAByuzzbojFhpmp2";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 noise scanlines flicker">

      {/* TITLE */}
      <h1
        className="glitch text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-2"
        data-text="AGARTHA2"
      >
        AGARTHA2
      </h1>

      <p className="text-zinc-500 text-sm mb-12 corrupt">
        they went deeper
      </p>

      {/* CONTRACT */}
      <div className="mb-12 text-center">
        <div className="text-zinc-600 text-xs mb-2">CA</div>
        <code
          className="text-zinc-400 text-xs md:text-sm cursor-pointer hover:text-white transition-colors break-all"
          onClick={() => navigator.clipboard.writeText(ca)}
        >
          {ca}
        </code>
      </div>

      {/* LINKS */}
      <div className="flex gap-6 text-sm">
        <a
          href={`https://pump.fun/coin/${ca}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-zinc-500 hover:text-white transition-colors"
        >
          [buy]
        </a>
        <a
          href={`https://dexscreener.com/solana/${ca}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-zinc-500 hover:text-white transition-colors"
        >
          [chart]
        </a>
        <a
          href="https://x.com/Agartha2_"
          target="_blank"
          rel="noopener noreferrer"
          className="text-zinc-500 hover:text-white transition-colors"
        >
          [x]
        </a>
        <a
          href="https://x.com/i/communities/2010910570950627352"
          target="_blank"
          rel="noopener noreferrer"
          className="text-zinc-500 hover:text-white transition-colors"
        >
          [community]
        </a>
      </div>

    </div>
  );
}
