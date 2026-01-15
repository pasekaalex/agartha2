"use client";

export default function Home() {
  const contractAddress = "TTZcPnHQYcrktiyHej9GxLd2rcymAByuzzbojFhpmp2";

  return (
    <div className="min-h-screen">
      {/* MARQUEE BANNER */}
      <div className="bg-red-600 text-yellow-300 py-2 marquee border-b-4 border-dashed border-yellow-400">
        <div className="marquee-content text-xl font-bold">
          🚨 BREAKING: HOLLOW EARTH CONFIRMED 🚨 PUMP2 IS REAL 🚨 VRIL ENERGY ACTIVATED 🚨 THE BEINGS BELOW ARE BUYING 🚨 AGARTHA2 TO THE CORE OF THE EARTH 🚨 50% SUPPLY BURNT 🔥 🚨 THEY CANT STOP US 🚨 WE GO DEEPER 🚨
        </div>
      </div>

      {/* HERO SECTION */}
      <main className="container mx-auto px-4 py-8">
        {/* UNDER CONSTRUCTION */}
        <div className="text-center mb-4">
          <span className="blink text-yellow-400 text-sm">🚧 UNDER CONSTRUCTION 🚧</span>
          <span className="text-xs text-gray-500 ml-2">(just like the tunnels)</span>
        </div>

        {/* MAIN TITLE */}
        <div className="text-center mb-8">
          <h1 className="text-6xl md:text-8xl font-bold glow mb-4">
            AGARTHA<span className="text-pink-500">2</span>
          </h1>
          <p className="text-2xl md:text-3xl rainbow font-bold">
            THE SEQUEL FROM BELOW
          </p>
          <div className="mt-4 text-lg">
            <span className="text-gray-400">pump1 was just the entrance...</span>
            <br />
            <span className="text-cyan-400 font-bold">pump2 goes DEEPER</span>
          </div>
        </div>

        {/* BURNT SUPPLY BADGE */}
        <div className="flex justify-center gap-4 flex-wrap mb-8">
          <div className="bg-red-600 text-white px-4 py-2 rotate-[-5deg] blink text-2xl font-bold border-4 border-yellow-400">
            🆕 NEW ON PUMP2 🆕
          </div>
          <div className="bg-orange-600 text-white px-6 py-3 rotate-[3deg] text-2xl font-bold border-4 border-red-400 pulse">
            🔥 50% SUPPLY BURNT 🔥
          </div>
        </div>

        {/* ASCII HOLLOW EARTH */}
        <div className="text-center mb-8 font-mono text-xs md:text-sm text-green-500 opacity-70">
          <pre className="inline-block text-left">
{`           ,,,,,,,,,,,,,
       ,,,,,,,,,,,,,,,,,,,,,
     ,,,,,,,,,,///|\\\\\\,,,,,,,,,,
   ,,,,,,,,,///  |  \\\\\\,,,,,,,,,
  ,,,,,,,,//  AGARTHA  \\\\,,,,,,,,
 ,,,,,,,/    ~~~~~~~~    \\,,,,,,,
 ,,,,,,|   INNER EARTH    |,,,,,,
 ,,,,,,'    ~~~~~~~~    ',,,,,,,
  ,,,,,,,,\\\\  PUMP2  //,,,,,,,,
   ,,,,,,,,,\\\\\\  |  ///,,,,,,,,,
     ,,,,,,,,,,\\\\\\|///,,,,,,,,,,
       ,,,,,,,,,,,,,,,,,,,,,
           ,,,,,,,,,,,,,`}
          </pre>
        </div>

        {/* VISITOR COUNTER (fake) */}
        <div className="text-center mb-8 text-sm">
          <span className="bg-black border border-green-500 px-3 py-1">
            👁️ VISITORS: <span className="text-green-400 font-mono">1,337,420</span>
          </span>
          <span className="ml-2 text-gray-500">(all from below)</span>
        </div>

        <div className="geocities-hr" />

        {/* WHAT IS AGARTHA2 */}
        <section className="max-w-3xl mx-auto mb-12 text-center">
          <h2 className="text-3xl font-bold text-yellow-400 mb-4 shake">
            ⚠️ WHAT IS AGARTHA2??? ⚠️
          </h2>
          <div className="bg-black/50 border-2 border-green-500 p-6 text-left">
            <p className="mb-4">
              You thought <span className="text-pink-400">$AGARTHA</span> on pump.fun (pump1) was the end?
            </p>
            <p className="mb-4 text-xl">
              <span className="rainbow font-bold">WRONG.</span>
            </p>
            <p className="mb-4">
              The beings of the <span className="text-cyan-400">Hollow Earth</span> have been watching.
              They saw pump1. They laughed. They said <span className="italic">&quot;hold my vril&quot;</span>.
            </p>
            <p className="mb-4">
              Now they&apos;re back with <span className="text-green-400 font-bold text-2xl">AGARTHA2</span> on
              <span className="text-pink-400 font-bold"> PUMP2</span>.
            </p>
            <p className="text-yellow-400 font-bold">
              The King of the World has spoken. We go deeper. 📉 (📈 actually)
            </p>
          </div>
        </section>

        <div className="geocities-hr" />

        {/* 50% BURNT SECTION */}
        <section className="max-w-3xl mx-auto mb-12 text-center">
          <div className="bg-gradient-to-r from-red-900/50 via-orange-900/50 to-red-900/50 border-4 border-orange-500 p-8">
            <div className="text-6xl mb-4">🔥🔥🔥</div>
            <h2 className="text-4xl md:text-5xl font-bold text-orange-400 mb-4 glow">
              50% SUPPLY BURNT
            </h2>
            <p className="text-xl text-orange-200">
              Half the tokens sacrificed to the inner sun.
            </p>
            <p className="text-lg text-gray-400 mt-2">
              The beings below don&apos;t need them. Neither do you.
            </p>
            <div className="mt-4 text-sm text-orange-300">
              🔥 BURNT = BULLISH 🔥
            </div>
          </div>
        </section>

        <div className="geocities-hr" />

        {/* TESTIMONIALS */}
        <section className="max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-center text-green-400 mb-6">
            💬 TESTIMONIALS FROM BELOW 💬
          </h2>
          <div className="space-y-4">
            <div className="bg-black/70 border border-green-500 p-4">
              <p className="italic">&quot;Finally a token that represents our civilization. 10000x from the inner core.&quot;</p>
              <p className="text-right text-cyan-400 mt-2">- Xylthar, Agartha Senior Developer (3000 years old)</p>
            </div>
            <div className="bg-black/70 border border-pink-500 p-4">
              <p className="italic">&quot;I&apos;ve been hodling since the first hollow earth. This is the one.&quot;</p>
              <p className="text-right text-pink-400 mt-2">- Anonymous Pale Blonde Dude</p>
            </div>
            <div className="bg-black/70 border border-yellow-500 p-4">
              <p className="italic">&quot;pump2 is the only exchange that reaches our depth. Bullish.&quot;</p>
              <p className="text-right text-yellow-400 mt-2">- The King of the World (verified)</p>
            </div>
          </div>
        </section>

        <div className="geocities-hr" />

        {/* ROADMAP */}
        <section className="max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-center text-pink-400 mb-6">
            🗺️ ROADMAP (we&apos;re making it up as we go) 🗺️
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4 bg-green-900/30 border-l-4 border-green-500 p-4">
              <span className="text-2xl">✅</span>
              <div>
                <div className="font-bold text-green-400">PHASE 1: DESCENT</div>
                <div className="text-sm">Launch on pump2, memes, vibes, vril activation, 50% burnt</div>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-yellow-900/30 border-l-4 border-yellow-500 p-4">
              <span className="text-2xl pulse inline-block">⏳</span>
              <div>
                <div className="font-bold text-yellow-400">PHASE 2: THE TUNNELS</div>
                <div className="text-sm">Partnerships with underground civilizations, CEX listings (Centralized Earth Exchanges)</div>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-purple-900/30 border-l-4 border-purple-500 p-4">
              <span className="text-2xl">🔮</span>
              <div>
                <div className="font-bold text-purple-400">PHASE 3: CORE BREACH</div>
                <div className="text-sm">Meet the beings, unlock ancient vril technology, flip bitcoin (the surface coin)</div>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-pink-900/30 border-l-4 border-pink-500 p-4">
              <span className="text-2xl">❓</span>
              <div>
                <div className="font-bold text-pink-400">PHASE 4: ???</div>
                <div className="text-sm">The King of the World will reveal when ready. Trust.</div>
              </div>
            </div>
          </div>
        </section>

        <div className="geocities-hr" />

        {/* CTA BUTTONS */}
        <section className="text-center mb-12">
          <h2 className="text-2xl font-bold mb-6 rainbow">JOIN THE DESCENT</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={`https://pump.fun/coin/${contractAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bad-button px-8 py-4 text-xl font-bold text-white rounded-none hover:scale-110 transition-transform"
            >
              🚀 BUY ON PUMP.FUN 🚀
            </a>
            <a
              href={`https://dexscreener.com/solana/${contractAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black border-4 border-cyan-400 px-8 py-4 text-xl font-bold text-cyan-400 hover:bg-cyan-400 hover:text-black transition-colors"
            >
              📊 CHART
            </a>
            <a
              href="https://x.com/Agartha2_"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black border-4 border-pink-400 px-8 py-4 text-xl font-bold text-pink-400 hover:bg-pink-400 hover:text-black transition-colors"
            >
              𝕏 TWITTER
            </a>
            <a
              href="https://x.com/i/communities/2010910570950627352"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black border-4 border-blue-400 px-8 py-4 text-xl font-bold text-blue-400 hover:bg-blue-400 hover:text-black transition-colors"
            >
              👥 COMMUNITY
            </a>
          </div>
        </section>

        {/* CONTRACT ADDRESS */}
        <section className="text-center mb-12">
          <div className="bg-black/80 border-2 border-green-500 p-6 inline-block max-w-full">
            <div className="text-sm text-gray-400 mb-2">CONTRACT ADDRESS:</div>
            <code
              className="text-green-400 font-mono text-sm md:text-base break-all cursor-pointer hover:text-green-300 block"
              onClick={() => navigator.clipboard.writeText(contractAddress)}
              title="Click to copy"
            >
              {contractAddress}
            </code>
            <div className="text-xs text-gray-500 mt-2">(click to copy)</div>
          </div>
        </section>

        <div className="geocities-hr" />

        {/* DISCLAIMER */}
        <section className="max-w-2xl mx-auto text-center mb-12">
          <div className="bg-red-900/30 border border-red-500 p-4 text-xs text-gray-400">
            <p className="mb-2">
              ⚠️ <span className="text-red-400">DISCLAIMER</span> ⚠️
            </p>
            <p>
              This is a memecoin. We are not affiliated with the actual beings of Agartha
              (or are we? 👁️). Not financial advice. The hollow earth is real but your
              gains might not be. DYOR. NFA. WAGMI. The King of the World takes no responsibility
              for surface dweller losses. If you&apos;re reading this from below, you already know.
            </p>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="text-center py-8 border-t border-green-900">
          <div className="text-2xl mb-4">
            <span className="spin inline-block">🌍</span>
            <span className="mx-4">AGARTHA2</span>
            <span className="spin inline-block" style={{ animationDirection: 'reverse' }}>🌍</span>
          </div>
          <div className="flex justify-center gap-6 mb-4">
            <a href="https://x.com/Agartha2_" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-400 transition-colors">
              𝕏 Twitter
            </a>
            <a href="https://x.com/i/communities/2010910570950627352" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">
              👥 Community
            </a>
            <a href={`https://pump.fun/coin/${contractAddress}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-green-400 transition-colors">
              🚀 Pump.fun
            </a>
          </div>
          <p className="text-gray-500 text-sm">
            © 2025 AGARTHA2 | Made with vril energy from 4,000 miles below
          </p>
          <p className="text-gray-600 text-xs mt-2">
            best viewed with Internet Explorer 6 and an open third eye
          </p>
        </footer>
      </main>

      {/* FIXED CORNER BADGE */}
      <div className="fixed bottom-4 right-4 bg-red-600 text-white px-3 py-2 rotate-12 blink text-sm font-bold border-2 border-yellow-400 z-50">
        WE GO DEEPER
      </div>
    </div>
  );
}
