import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { 
  Database, Cpu, Globe, ChevronRight, Pickaxe, 
  Award, Zap, Lock, Unlock, AlertTriangle, Link2, Link2Off, 
  Send, ShieldCheck, Key, Wallet, TrendingDown, BookOpen, 
  Menu, X, Fingerprint, RefreshCw, FileCheck, CheckCircle2,
  Terminal, Activity, Sparkles, MousePointer2
} from 'lucide-react';

// --- VISUAL UTILS ---

const ScrambleText = ({ text, trigger }) => {
  const [display, setDisplay] = useState(text);
  
  useEffect(() => {
    let iter = 0;
    const interval = setInterval(() => {
      setDisplay(text.split("").map((char, index) => {
        if(index < iter) return text[index];
        return "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()"[Math.floor(Math.random() * 40)];
      }).join(""));
      
      if(iter >= text.length) clearInterval(interval);
      iter += 1/2; 
    }, 30);
    return () => clearInterval(interval);
  }, [text, trigger]);

  return <span className="font-mono">{display}</span>;
};

const NoiseTexture = () => (
  <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.04] mix-blend-overlay"
       style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
  </div>
);

// --- UI COMPONENTS ---

const GlassCard = ({ children, className = "", hoverEffect = false, active = false, noPadding = false }) => (
  <motion.div 
    whileHover={hoverEffect ? { y: -4, boxShadow: "0 10px 40px -10px rgba(245,158,11,0.1)" } : {}}
    className={`
      backdrop-blur-xl border rounded-2xl overflow-hidden relative transition-all duration-500 group
      ${active 
        ? "bg-[#1A1A1D]/90 border-amber-500/30 shadow-[0_0_30px_rgba(245,158,11,0.05)]" 
        : "bg-[#0F0F11]/60 border-white/5 hover:border-white/10"}
      ${className}
    `}
  >
    {/* Glow Effect */}
    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 via-transparent to-amber-500/0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none"/>
    <div className={noPadding ? "" : "p-6"}>
      {children}
    </div>
  </motion.div>
);

const Badge = ({ children, color = "gray", icon: Icon }) => {
  const colors = {
    gray: "bg-zinc-800 text-zinc-400 border-zinc-700",
    gold: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    green: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    red: "bg-rose-500/10 text-rose-500 border-rose-500/20",
    blue: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-mono border uppercase tracking-wider flex items-center gap-1.5 w-fit ${colors[color]}`}>
      {Icon && <Icon size={10} />}
      {children}
    </span>
  );
};

const Button = ({ children, onClick, disabled, variant = 'primary', className = '', icon: Icon }) => {
  const variants = {
    primary: "bg-gradient-to-r from-amber-500 to-amber-600 text-black hover:from-amber-400 hover:to-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.2)]",
    secondary: "bg-zinc-800 text-white hover:bg-zinc-700 border border-white/5",
    outline: "border border-amber-500/30 text-amber-500 hover:bg-amber-500/10",
    success: "bg-emerald-500 text-black hover:bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]",
  };

  return (
    <motion.button 
      whileTap={{ scale: 0.95 }}
      onClick={onClick} 
      disabled={disabled}
      className={`relative px-5 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed grayscale' : ''} ${className}`}
    >
      {Icon && <Icon size={16} />}
      {children}
    </motion.button>
  );
};

// --- SIMULATIONS ---

// 1. Ledger Sim (Animated Network)
const LedgerSim = () => {
  const [txs, setTxs] = useState([]);
  const [broadcasting, setBroadcasting] = useState(false);

  const addTx = () => {
    if (broadcasting) return;
    setBroadcasting(true);
    const newTxId = Math.floor(Math.random() * 9000) + 1000;
    
    // Simulate network delay
    setTimeout(() => {
      setTxs(prev => [{ id: newTxId, tx: "Alice → Bob: 0.5 BTC", time: new Date().toLocaleTimeString() }, ...prev]);
      setBroadcasting(false);
    }, 2500);
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8 items-center h-full">
       <div className="space-y-8">
          <Badge color="blue" icon={Globe}>LEKCE 01: SÍŤ</Badge>
          <div>
            <h2 className="text-4xl font-bold text-white mb-4">Gossip Protokol</h2>
            <p className="text-zinc-400 leading-relaxed text-lg">
              Bitcoinová síť funguje jako digitální drbna. Když odešlete transakci, řeknete to několika počítačům. 
              Ty to řeknou dalším. Během několika sekund o tom ví celý svět.
            </p>
          </div>
          
          <div className="bg-zinc-900/50 p-4 rounded-xl border border-white/5 h-48 overflow-y-auto">
            <div className="text-xs text-zinc-500 uppercase font-mono mb-2 sticky top-0 bg-[#121214] pb-2 border-b border-white/5 flex justify-between">
              <span>Mempool (Čekárna)</span>
              <span className={broadcasting ? "text-amber-500 animate-pulse" : "text-zinc-600"}>
                 {broadcasting ? "● Synchronizuji..." : "● Připraveno"}
              </span>
            </div>
            <AnimatePresence>
              {txs.map((t) => (
                <motion.div 
                  key={t.id}
                  initial={{ opacity: 0, x: -20, height: 0 }}
                  animate={{ opacity: 1, x: 0, height: 'auto' }}
                  className="py-2 border-b border-white/5 font-mono text-sm text-emerald-400 flex justify-between items-center"
                >
                  <span className="flex items-center gap-2"><CheckCircle2 size={12}/> {t.tx}</span>
                  <span className="text-xs text-zinc-600">{t.time}</span>
                </motion.div>
              ))}
            </AnimatePresence>
            {txs.length === 0 && <div className="text-zinc-600 text-sm py-4 text-center italic">Zatím žádné transakce...</div>}
          </div>

          <Button onClick={addTx} disabled={broadcasting} icon={Send} className="w-full">
            {broadcasting ? "Šířím do sítě..." : "Vyslat Transakci"}
          </Button>
       </div>

       <div className="relative h-[400px] bg-[#08080A] rounded-3xl border border-zinc-800 p-8 flex items-center justify-center overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03),transparent_70%)]"></div>
          
          {/* Animated Connections */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
             {[0, 120, 240].map((deg, i) => {
                const rad = (deg * Math.PI) / 180;
                const x2 = 50 + 30 * Math.cos(rad);
                const y2 = 50 + 30 * Math.sin(rad);
                return (
                  <g key={i}>
                    <line x1="50%" y1="50%" x2={`${x2}%`} y2={`${y2}%`} stroke="#333" strokeWidth="2" />
                    {broadcasting && (
                      <motion.circle r="3" fill="#f59e0b">
                        <animateMotion 
                          dur="1s" 
                          repeatCount="indefinite"
                          path={`M ${50 * 4} ${50 * 4} L ${x2 * 4} ${y2 * 4}`} // Simplified path logic for demo
                        />
                         {/* CSS Animation fallback for visual simplicity in this context */}
                         <animate attributeName="cx" from="50%" to={`${x2}%`} dur="0.8s" begin={`${i*0.2}s`} fill="freeze" />
                         <animate attributeName="cy" from="50%" to={`${y2}%`} dur="0.8s" begin={`${i*0.2}s`} fill="freeze" />
                         <animate attributeName="opacity" values="1;0" dur="0.8s" begin={`${i*0.2}s`} />
                      </motion.circle>
                    )}
                  </g>
                );
             })}
          </svg>

          {/* Nodes */}
          {[0, 120, 240].map((deg, i) => (
             <motion.div
               key={i}
               className="absolute w-20 h-20 bg-zinc-900 border border-zinc-700 rounded-full flex flex-col items-center justify-center z-10 shadow-xl"
               style={{ 
                 left: `50%`, top: `50%`, 
                 transform: `rotate(${deg}deg) translate(120px) rotate(-${deg}deg) translate(-50%, -50%)` 
               }}
               animate={broadcasting ? { 
                 borderColor: ["#27272a", "#f59e0b", "#27272a"],
                 scale: [1, 1.1, 1] 
               } : {}}
               transition={{ delay: i * 0.3, duration: 0.5 }}
             >
               <Database size={20} className={broadcasting ? "text-amber-500" : "text-zinc-500"} />
               <span className="text-[9px] text-zinc-500 mt-2 font-mono bg-black/50 px-2 rounded">UZEL {i+1}</span>
             </motion.div>
          ))}

          {/* User Node */}
          <motion.div 
            className="z-20 w-24 h-24 bg-gradient-to-b from-zinc-800 to-black border border-amber-500/50 rounded-full flex items-center justify-center relative shadow-[0_0_30px_rgba(245,158,11,0.2)]"
            whileTap={{ scale: 0.9 }}
          >
             <Globe className="text-amber-500" size={32}/>
             {broadcasting && (
               <motion.div 
                 className="absolute inset-0 border-2 border-amber-500 rounded-full"
                 animate={{ scale: [1, 2.5], opacity: [1, 0], borderWidth: ["2px", "0px"] }}
                 transition={{ repeat: Infinity, duration: 1.5 }}
               />
             )}
          </motion.div>
       </div>
    </div>
  );
};

// 2. Crypto Sim (Scramble Text)
const CryptoSim = () => {
  const [keys, setKeys] = useState(null);
  const [signature, setSignature] = useState(null);
  const [msg, setMsg] = useState("Potvrzuji platbu 1 BTC");

  const genKeys = () => {
    setKeys({ priv: "GEN...", pub: "GEN..." }); // Placeholder for animation start
    setTimeout(() => {
        setKeys({
          priv: "L5ez9s... (Tajné)",
          pub: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"
        });
    }, 1000);
    setSignature(null);
  };

  const sign = () => {
    if(!keys) return;
    setSignature("Generuji...");
    setTimeout(() => {
        setSignature("SIG_8f4a2c9e1b3d7a...");
    }, 800);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <Badge color="red" icon={Lock} className="mx-auto mb-4">KRYPTOGRAFIE</Badge>
        <h2 className="text-3xl font-bold text-white">Digitální Podpis</h2>
        <p className="text-zinc-400 mt-2">Matematika, která zaručuje vlastnictví bez nutnosti banky.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Key Generation */}
        <GlassCard className="flex flex-col h-full">
           <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-amber-500/10 rounded-lg"><Key className="text-amber-500" size={20}/></div>
              <h3 className="font-bold text-white">1. Pár Klíčů</h3>
           </div>
           
           <div className="space-y-4 flex-1">
             <div className="p-4 bg-zinc-900/50 rounded-lg border border-white/5">
                <div className="text-xs text-zinc-500 uppercase mb-1 flex items-center gap-2"><Unlock size={10}/> Veřejný Klíč (IBAN)</div>
                <div className="text-emerald-400 font-mono text-xs break-all h-8 flex items-center">
                    {keys ? <ScrambleText text={keys.pub} trigger={keys} /> : <span className="text-zinc-700">---</span>}
                </div>
             </div>
             <div className="p-4 bg-zinc-900/50 rounded-lg border border-white/5 relative overflow-hidden">
                <div className="text-xs text-zinc-500 uppercase mb-1 flex items-center gap-2"><Lock size={10}/> Soukromý Klíč (PIN)</div>
                <div className="text-rose-400 font-mono text-xs break-all h-8 flex items-center blur-[3px] hover:blur-none transition-all cursor-help">
                    {keys ? <ScrambleText text={keys.priv} trigger={keys} /> : <span className="text-zinc-700">---</span>}
                </div>
                {keys && <div className="absolute top-2 right-2 text-[8px] text-zinc-500 bg-black/80 px-1 rounded">HOVER TO REVEAL</div>}
             </div>
           </div>

           <Button onClick={genKeys} variant="outline" icon={RefreshCw} className="mt-6 w-full">
             {keys ? "Přegenerovat Klíče" : "Vytvořit Peněženku"}
           </Button>
        </GlassCard>

        {/* Signing */}
        <GlassCard className={`flex flex-col h-full transition-opacity duration-500 ${!keys ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
           <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-500/10 rounded-lg"><ShieldCheck className="text-blue-500" size={20}/></div>
              <h3 className="font-bold text-white">2. Podpis</h3>
           </div>

           <div className="space-y-4 flex-1">
              <div>
                 <label className="text-xs text-zinc-500 uppercase mb-2 block">Zpráva k podpisu</label>
                 <input 
                   value={msg} 
                   onChange={e => {setMsg(e.target.value); setSignature(null);}}
                   className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-sm text-white focus:border-amber-500 outline-none transition-colors font-mono"
                 />
              </div>
              
              <div className="flex items-center justify-center py-2">
                 <div className="h-8 w-px bg-zinc-700"></div>
              </div>

              <div className={`p-4 rounded-lg border transition-colors ${signature ? 'bg-amber-500/5 border-amber-500/30' : 'bg-zinc-900/30 border-dashed border-zinc-700'}`}>
                 <div className="text-[10px] text-zinc-500 uppercase mb-1">Digitální Podpis</div>
                 <div className="text-amber-200 font-mono text-xs break-all min-h-[40px] flex items-center">
                    {signature ? <ScrambleText text={signature} trigger={signature}/> : <span className="text-zinc-600 italic">Čekám na podpis...</span>}
                 </div>
              </div>
           </div>

           <Button onClick={sign} disabled={!keys} className="mt-6 w-full" icon={Fingerprint}>
              Podepsat Zprávu
           </Button>
        </GlassCard>
      </div>
    </div>
  );
};

// 3. Chain Sim (Visual Links)
const ChainSim = () => {
  const [blocks, setBlocks] = useState([
    { id: 1, prev: "0000", data: "Genesis Block", hash: "00a1b2", valid: true },
    { id: 2, prev: "00a1b2", data: "Tx: 50 BTC", hash: "00c3d4", valid: true },
    { id: 3, prev: "00c3d4", data: "Tx: 10 BTC", hash: "00e5f6", valid: true },
  ]);

  const updateBlock = (idx, newData) => {
    const newBlocks = [...blocks];
    newBlocks[idx].data = newData;
    
    // Recalculate (Simulated)
    newBlocks[idx].hash = Math.random().toString(16).substring(2, 8); // Hash changes!
    newBlocks[idx].valid = false; // Invalid because hash doesn't match difficulty or manipulated

    // Cascade invalidity
    for(let i = idx + 1; i < newBlocks.length; i++) {
        // Prev hash doesn't match the new hash of previous block
        newBlocks[i].valid = false;
    }
    setBlocks(newBlocks);
  };

  const repair = () => {
    setBlocks([
        { id: 1, prev: "0000", data: "Genesis Block", hash: "00a1b2", valid: true },
        { id: 2, prev: "00a1b2", data: "Tx: 50 BTC", hash: "00c3d4", valid: true },
        { id: 3, prev: "00c3d4", data: "Tx: 10 BTC", hash: "00e5f6", valid: true },
    ]);
  };

  return (
    <div className="space-y-8">
       <div className="flex flex-col md:flex-row justify-between items-end gap-4">
          <div>
             <Badge color="red" icon={Link2}>BLOCKCHAIN</Badge>
             <h2 className="text-3xl font-bold text-white mt-2">Nezměnitelná Historie</h2>
             <p className="text-zinc-400 mt-2 max-w-xl">
               Zkuste změnit data v prvním bloku. Uvidíte, jak se "rozbije" matematická vazba (Hash) v celém následujícím řetězci.
             </p>
          </div>
          <Button onClick={repair} variant="secondary" icon={RefreshCw} className="text-xs">Resetovat Řetězec</Button>
       </div>

       <div className="flex gap-4 overflow-x-auto pb-8 pt-4 items-start scrollbar-hide">
          {blocks.map((block, i) => (
             <div key={block.id} className="flex items-center shrink-0">
                <GlassCard 
                  className={`w-64 transition-all duration-300 ${block.valid ? 'border-t-4 border-t-emerald-500' : 'border-t-4 border-t-rose-500 bg-rose-900/5'}`}
                  noPadding
                >
                   <div className="p-4 bg-zinc-900/50 border-b border-white/5 flex justify-between items-center">
                      <span className="font-bold text-zinc-300">BLOK #{block.id}</span>
                      {block.valid 
                        ? <div className="flex items-center gap-1 text-[10px] text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded"><Lock size={10}/> VALID</div>
                        : <div className="flex items-center gap-1 text-[10px] text-rose-500 bg-rose-500/10 px-2 py-1 rounded animate-pulse"><AlertTriangle size={10}/> BROKEN</div>
                      }
                   </div>
                   
                   <div className="p-4 space-y-3">
                      <div>
                         <label className="text-[10px] text-zinc-500 uppercase font-bold">Předchozí Hash</label>
                         <div className={`font-mono text-xs p-2 rounded bg-black/40 ${block.valid ? 'text-zinc-400' : 'text-rose-400 line-through'}`}>
                            {block.prev}
                         </div>
                      </div>

                      <div>
                         <label className="text-[10px] text-zinc-500 uppercase font-bold">Data (Transakce)</label>
                         <input 
                           value={block.data}
                           onChange={(e) => updateBlock(i, e.target.value)}
                           className="w-full bg-black/40 border border-zinc-700 rounded p-2 text-xs text-white focus:border-amber-500 outline-none transition-colors"
                         />
                      </div>

                      <div>
                         <label className="text-[10px] text-zinc-500 uppercase font-bold">Vlastní Hash</label>
                         <div className="font-mono text-xs text-amber-500 break-all">
                            {block.hash}
                         </div>
                      </div>
                   </div>
                </GlassCard>

                {i < blocks.length - 1 && (
                   <div className="w-12 flex flex-col items-center justify-center px-2 text-zinc-600">
                      <div className={`h-[2px] w-full ${blocks[i+1].valid ? 'bg-zinc-700' : 'bg-rose-500/50'}`}></div>
                      {blocks[i+1].valid 
                        ? <Link2 size={20} className="text-zinc-600 -ml-1"/> 
                        : <Link2Off size={20} className="text-rose-500 -ml-1 animate-pulse"/>
                      }
                   </div>
                )}
             </div>
          ))}
       </div>
    </div>
  );
};

// 4. Mining Sim (Visual Hashing)
const MiningSim = () => {
  const [mining, setMining] = useState(false);
  const [nonce, setNonce] = useState(0);
  const [currentHash, setCurrentHash] = useState("a8f...");
  const [found, setFound] = useState(false);

  useEffect(() => {
    if (!mining) return;
    const interval = setInterval(() => {
      setNonce(n => n + 1);
      const randomHash = Array(64).fill(0).map(()=>"0123456789abcdef"[Math.floor(Math.random()*16)]).join('');
      setCurrentHash(randomHash);
      
      // Simulation of finding a block (random chance)
      if (Math.random() > 0.98) {
         setMining(false);
         setFound(true);
         setCurrentHash("0000000000000000" + randomHash.substring(16));
      }
    }, 50);
    return () => clearInterval(interval);
  }, [mining]);

  const startMine = () => {
    setFound(false);
    setMining(true);
  };

  return (
    <div className="grid md:grid-cols-2 gap-8 items-center">
       <div>
          <Badge color="gold" icon={Pickaxe}>PROOF OF WORK</Badge>
          <h2 className="text-3xl font-bold text-white mt-2 mb-4">Hledání Jehly v Kupce Sena</h2>
          <p className="text-zinc-400 mb-6 leading-relaxed">
             Těžba je proces, kde počítače miliardkrát za sekundu zkouší různá náhodná čísla (Nonce), dokud nenajdou takové, které vytvoří Hash začínající mnoha nulami.
          </p>
          <Button onClick={startMine} disabled={mining} icon={Zap} className={mining ? "animate-pulse" : ""}>
             {mining ? "Těžím (Hledám hash)..." : "Spustit Těžbu"}
          </Button>
       </div>

       <GlassCard className="font-mono text-xs bg-black shadow-2xl border-zinc-800">
          <div className="bg-zinc-900 px-4 py-2 border-b border-zinc-800 flex items-center justify-between">
             <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500"></div>
             </div>
             <span className="text-zinc-500">miner_v1.0.exe</span>
          </div>
          <div className="p-6 space-y-4">
             <div className="flex justify-between text-zinc-500">
                <span>NONCE: <span className="text-white">{nonce}</span></span>
                <span>DIFFICULTY: <span className="text-amber-500">MEDIUM</span></span>
             </div>
             
             <div className="bg-zinc-900/50 p-4 rounded border border-zinc-800 min-h-[80px] flex flex-col justify-center">
                <div className="text-[10px] text-zinc-500 uppercase mb-1">Aktuální Hash</div>
                <div className={`break-all text-sm transition-colors ${found ? 'text-emerald-400 font-bold' : 'text-zinc-400'}`}>
                   {currentHash}
                </div>
             </div>

             {found && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }} 
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded text-emerald-400 text-center"
                >
                   <Sparkles size={16} className="inline mr-2"/>
                   BLOK NALEZEN! ODMĚNA 3.125 BTC
                </motion.div>
             )}
          </div>
       </GlassCard>
    </div>
  );
};

// 5. Halving Sim (Interactive Slider)
const HalvingSim = () => {
   const [year, setYear] = useState(2024);
   
   // Calculate Halving Era
   const era = Math.floor((year - 2009) / 4);
   const reward = 50 / Math.pow(2, era);
   const inflation = (reward * 6 * 24 * 365) / (19000000); // Rough visual approximation logic
   
   return (
      <div className="space-y-12">
         <div className="text-center max-w-2xl mx-auto">
            <Badge color="green" icon={TrendingDown} className="mx-auto mb-2">MONETÁRNÍ POLITIKA</Badge>
            <h2 className="text-3xl font-bold text-white">Halving Cykly</h2>
            <p className="text-zinc-400 mt-4">
               Bitcoin je naprogramován tak, aby byl vzácnější než zlato. Každé 4 roky se přísun nových mincí sníží na polovinu.
            </p>
         </div>

         <GlassCard className="p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center gap-12">
               <div className="flex-1 w-full">
                  <div className="flex justify-between items-center mb-6">
                     <span className="text-zinc-400 font-mono text-xs uppercase">Časová Osa</span>
                     <span className="text-2xl font-bold text-white font-mono">ROK {year}</span>
                  </div>
                  
                  <input 
                     type="range" min="2009" max="2040" step="1"
                     value={year} onChange={(e) => setYear(Number(e.target.value))}
                     className="w-full h-4 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-amber-500 hover:accent-amber-400 transition-all"
                  />
                  
                  <div className="flex justify-between mt-4">
                     {[2012, 2016, 2020, 2024, 2028, 2032].map(y => (
                        <div key={y} className="flex flex-col items-center gap-1">
                           <div className="w-0.5 h-2 bg-zinc-700"></div>
                           <span className={`text-[10px] ${year >= y ? 'text-amber-500' : 'text-zinc-600'}`}>{y}</span>
                        </div>
                     ))}
                  </div>
               </div>

               <div className="flex gap-4">
                  <div className="text-center p-6 bg-zinc-900 rounded-xl border border-zinc-800 min-w-[140px]">
                     <div className="text-zinc-500 text-[10px] uppercase mb-2">Odměna za blok</div>
                     <motion.div 
                        key={reward}
                        initial={{ scale: 1.2, color: "#f59e0b" }}
                        animate={{ scale: 1, color: "#ffffff" }}
                        className="text-4xl font-mono font-bold"
                     >
                        {reward.toFixed(3).replace(/\.?0+$/, '')}
                     </motion.div>
                     <div className="text-amber-500 text-xs mt-1">BTC</div>
                  </div>
               </div>
            </div>
         </GlassCard>
      </div>
   )
};

// 6. Quiz Sim (Feedback Animations)
const QuizSim = () => {
   const [current, setCurrent] = useState(0);
   const [score, setScore] = useState(0);
   const [finished, setFinished] = useState(false);
   const [selected, setSelected] = useState(null);
   const [shake, setShake] = useState(false);

   const questions = [
      { q: "Kdo může změnit pravidla Bitcoinu?", opts: ["Prezident USA", "Satoshi Nakamoto", "Nikdo (Konsensus sítě)", "Generální ředitel"], a: 2 },
      { q: "Kolik Bitcoinů bude celkem existovat?", opts: ["21 milionů", "Nekonečno", "100 milionů", "Záleží na poptávce"], a: 0 },
      { q: "Co se stane, když ztratíte privátní klíč?", opts: ["Banka mi vydá nový", "Napíšu na podporu", "Peníze jsou navždy ztraceny", "Můžu použít otisk prstu"], a: 2 },
   ];

   const handleAnswer = (idx) => {
      setSelected(idx);
      if (idx === questions[current].a) {
         setTimeout(() => {
            setScore(s => s + 1);
            if (current < questions.length - 1) {
               setCurrent(c => c + 1);
               setSelected(null);
            } else {
               setFinished(true);
            }
         }, 800);
      } else {
         setShake(true);
         setTimeout(() => setShake(false), 500);
      }
   };

   if (finished) return (
      <div className="flex flex-col items-center justify-center py-12 text-center animate-in zoom-in duration-500">
         <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-600 rounded-full flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(245,158,11,0.4)]">
            <Award size={48} className="text-white"/>
         </div>
         <h2 className="text-4xl font-bold text-white mb-2">Gratulujeme!</h2>
         <p className="text-zinc-400 mb-8">Úspěšně jste dokončili Bitcoin Masterclass.</p>
         <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl min-w-[300px]">
            <div className="text-sm text-zinc-500 uppercase mb-2">Výsledné Skóre</div>
            <div className="text-3xl font-mono font-bold text-white">{score} / {questions.length}</div>
         </div>
         <Button onClick={() => window.location.reload()} variant="outline" className="mt-8" icon={RefreshCw}>Začít Znovu</Button>
      </div>
   );

   return (
      <div className="max-w-2xl mx-auto">
         <div className="flex justify-between items-center mb-8">
            <Badge color="gold">ZÁVĚREČNÝ KVÍZ</Badge>
            <span className="font-mono text-zinc-500 text-sm">Otázka {current + 1} z {questions.length}</span>
         </div>

         <div className="relative">
            <h3 className="text-2xl font-bold text-white mb-8 min-h-[64px]">{questions[current].q}</h3>
            
            <div className="space-y-3">
               {questions[current].opts.map((opt, i) => (
                  <motion.button
                     key={i}
                     onClick={() => handleAnswer(i)}
                     animate={shake && selected === i ? { x: [-10, 10, -10, 10, 0] } : {}}
                     className={`w-full p-4 rounded-xl text-left border transition-all duration-300 flex justify-between items-center group
                        ${selected === i 
                           ? (i === questions[current].a ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-rose-500/20 border-rose-500 text-rose-400')
                           : 'bg-zinc-900/50 border-white/5 hover:bg-zinc-800 hover:border-amber-500/50 text-zinc-300'
                        }
                     `}
                  >
                     <span>{opt}</span>
                     {selected === i && i === questions[current].a && <CheckCircle2 size={18} className="text-emerald-500"/>}
                     {selected === i && i !== questions[current].a && <AlertTriangle size={18} className="text-rose-500"/>}
                  </motion.button>
               ))}
            </div>
         </div>
      </div>
   );
};

// --- DATA STRUCTURE ---

const modules = [
  { id: 'intro', title: 'Digitální Zlato', sub: 'Úvod do peněz 2.0', icon: Globe, comp: () => (
     <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="relative p-8 md:p-12 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-[#1a1a1a] to-black">
           <div className="absolute top-0 right-0 p-40 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none"></div>
           
           <Badge color="gold" className="mb-6">BITCOIN MASTERCLASS</Badge>
           <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-tight">
              Peníze, které <br/>patří <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">jen Vám</span>.
           </h1>
           <p className="text-xl text-zinc-400 max-w-2xl leading-relaxed">
              Bitcoin není jen investice. Je to technologická revoluce, která odděluje peníze od státu. 
              Naučte se, jak funguje nejbezpečnější počítačová síť na světě.
           </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
           {[
              { t: "Decentralizace", d: "Žádný centrální bod selhání. Síť patří všem.", i: Globe },
              { t: "Transparentnost", d: "Každou transakci lze matematicky ověřit.", i: FileCheck },
              { t: "Nezabavitelnost", d: "Vaše prostředky nemůže nikdo zmrazit.", i: ShieldCheck }
           ].map((c,i) => (
              <GlassCard key={i} hoverEffect={true} className="h-full">
                 <div className="w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center mb-4 text-amber-500">
                    <c.i size={24}/>
                 </div>
                 <h3 className="font-bold text-white text-lg mb-2">{c.t}</h3>
                 <p className="text-sm text-zinc-500 leading-relaxed">{c.d}</p>
              </GlassCard>
           ))}
        </div>
     </div>
  )},
  { id: 'ledger', title: 'Účetní Kniha', sub: 'Gossip Protokol', icon: Database, comp: LedgerSim },
  { id: 'crypto', title: 'Kryptografie', sub: 'Klíče a Podpisy', icon: Key, comp: CryptoSim },
  { id: 'chain', title: 'Blockchain', sub: 'Historie', icon: Link2, comp: ChainSim },
  { id: 'mining', title: 'Těžba (Mining)', sub: 'Proof of Work', icon: Pickaxe, comp: MiningSim },
  { id: 'halving', title: 'Ekonomika', sub: 'Inflace a Vzácnost', icon: TrendingDown, comp: HalvingSim },
  { id: 'quiz', title: 'Certifikace', sub: 'Test Znalostí', icon: Award, comp: QuizSim },
];

// --- MAIN APP SHELL ---

export default function BitcoinMasterclassUltimate() {
  const [activeTab, setActiveTab] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const ModuleComp = modules[activeTab].comp;

  return (
    <div className="flex min-h-screen bg-[#050505] text-zinc-200 font-sans selection:bg-amber-500/30">
      <NoiseTexture />

      {/* SIDEBAR */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-[#09090b]/95 backdrop-blur-2xl border-r border-white/5 
        transform transition-transform duration-500 ease-out md:relative md:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
         <div className="p-6 border-b border-white/5 flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-600 rounded flex items-center justify-center shadow-lg shadow-amber-500/20">
               <span className="font-bold text-black font-mono">₿</span>
            </div>
            <div>
               <h1 className="font-bold text-white text-sm tracking-wide">MASTERCLASS</h1>
               <div className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">Pro Edition</div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="md:hidden ml-auto p-2 hover:bg-white/5 rounded"><X size={18}/></button>
         </div>

         <nav className="p-4 space-y-1">
            {modules.map((m, idx) => (
               <button
                  key={m.id}
                  onClick={() => { setActiveTab(idx); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all duration-300 relative group overflow-hidden ${activeTab === idx ? 'bg-zinc-900 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/5'}`}
               >
                  {activeTab === idx && <motion.div layoutId="activeNav" className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500"/>}
                  <m.icon size={18} className={`transition-colors ${activeTab === idx ? "text-amber-500" : "text-zinc-600 group-hover:text-zinc-400"}`}/>
                  <div>
                     <div className="text-sm font-medium">{m.title}</div>
                  </div>
               </button>
            ))}
         </nav>

         <div className="absolute bottom-0 w-full p-6 border-t border-white/5 bg-[#09090b]">
             <div className="flex justify-between text-[10px] uppercase text-zinc-500 font-bold mb-2">
                <span>Váš Postup</span>
                <span>{Math.round(((activeTab) / (modules.length - 1)) * 100)}%</span>
             </div>
             <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                <motion.div 
                   className="h-full bg-amber-500"
                   initial={{ width: 0 }}
                   animate={{ width: `${((activeTab) / (modules.length - 1)) * 100}%` }}
                />
             </div>
         </div>
      </aside>

      {/* CONTENT AREA */}
      <main className="flex-1 h-screen overflow-y-auto relative scroll-smooth bg-[#050505]">
         <div className="md:hidden sticky top-0 z-40 bg-[#050505]/80 backdrop-blur border-b border-white/5 p-4 flex justify-between items-center">
            <span className="font-bold text-white text-sm">BTC Masterclass</span>
            <button onClick={() => setSidebarOpen(true)} className="p-2 bg-zinc-900 rounded border border-white/10"><Menu size={18}/></button>
         </div>

         <div className="max-w-5xl mx-auto p-6 md:p-12 pb-32">
            <header className="mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
               <div className="flex items-center gap-2 text-amber-500 font-mono text-xs uppercase mb-2 tracking-widest">
                  <span>Modul {(activeTab + 1).toString().padStart(2, '0')}</span>
                  <div className="w-8 h-[1px] bg-amber-500/50"></div>
                  <span>{modules[activeTab].sub}</span>
               </div>
               <h2 className="text-4xl md:text-5xl font-bold text-white">{modules[activeTab].title}</h2>
            </header>

            <div className="min-h-[500px]">
               <AnimatePresence mode='wait'>
                  <motion.div
                     key={activeTab}
                     initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                     animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                     exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
                     transition={{ duration: 0.4, ease: "easeOut" }}
                  >
                     <ModuleComp />
                  </motion.div>
               </AnimatePresence>
            </div>

            <div className="mt-24 pt-8 border-t border-white/5 flex justify-between items-center">
               <Button variant="secondary" disabled={activeTab === 0} onClick={() => setActiveTab(p => p - 1)}>
                  Zpět
               </Button>
               
               {activeTab < modules.length - 1 ? (
                  <Button onClick={() => setActiveTab(p => p + 1)}>
                     Pokračovat <ChevronRight size={16}/>
                  </Button>
               ) : (
                  <span className="text-zinc-500 text-sm italic">Kurz dokončen</span>
               )}
            </div>
         </div>
      </main>
    </div>
  );
}
