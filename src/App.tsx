import { useState, useMemo } from 'react'
import { CandidateCard } from './components/CandidateCard'
import { BondingCurveChart } from './components/BondingCurveChart'
import { PurchaseModal } from './components/PurchaseModal'
import { useMarketSimulation } from './hooks/useMarketSimulation'
import { useUserPortfolio } from './hooks/useUserPortfolio'
import { WalletModal } from './components/WalletModal'
import { AuthProvider, useAuth } from './context/AuthContext'
import { AuthModal } from './components/AuthModal'
import { ComingSoonModal } from './components/ComingSoonModal'
import { InfoTabs } from './components/InfoTabs'

// Assign constant colors to candidates for consistency
const CANDIDATE_COLORS = [
  '#000000', // Black
  '#2563eb', // Blue
  '#dc2626', // Red
  '#16a34a', // Green
  '#d97706', // Amber
  '#7c3aed', // Violet
];

function AppContent() {
  const { user } = useAuth();
  const { candidates, history, executeTrade } = useMarketSimulation();
  const { portfolio, balance, addToPortfolio, sellFromPortfolio, withdrawBalance } = useUserPortfolio();

  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  const [purchaseType, setPurchaseType] = useState<'VENCE' | 'PERDE' | null>(null);

  // Chart State
  const [chartTab, setChartTab] = useState<'VENCE' | 'PERDE'>('VENCE');

  // Modals
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isComingSoonOpen, setComingSoonOpen] = useState(false);

  // --- Data Transformation for Comparison Chart ---
  const chartData = useMemo(() => {
    // Find the max length of history (should be same for all, but safer to check)
    const maxSteps = Math.max(...Object.values(history).map(h => h.length), 0);
    if (maxSteps === 0) return [];

    const data = [];
    for (let i = 0; i < maxSteps; i++) {
      const point: any = { step: i };
      candidates.forEach(c => {
        const hist = history[c.id];
        if (hist && hist[i]) {
          const price = chartTab === 'VENCE' ? hist[i].vence : hist[i].perde;
          // Convert Price to Percentage: (Price / 20) * 100
          point[c.id] = (price / 20) * 100;
        }
      });
      data.push(point);
    }
    return data;
  }, [history, candidates, chartTab]);

  const chartLines = useMemo(() => {
    return candidates.map((c, index) => ({
      dataKey: c.id,
      name: c.name,
      stroke: CANDIDATE_COLORS[index % CANDIDATE_COLORS.length]
    }));
  }, [candidates]);
  // -----------------------------------------------

  const selectedCandidate = candidates.find(c => c.id === selectedCandidateId);

  const openPurchase = (type: 'VENCE' | 'PERDE', candidateId: string) => {
    if (!user) {
      setIsAuthOpen(true);
      return;
    }
    setSelectedCandidateId(candidateId);
    setPurchaseType(type);
  };

  const closePurchase = () => {
    setSelectedCandidateId(null);
    setPurchaseType(null);
  };

  const handlePurchaseSuccess = (amount: number, _cpf: string, _whatsapp: string) => {
    if (selectedCandidateId && purchaseType) {
      // Execute market trade
      executeTrade(selectedCandidateId, purchaseType, amount);

      // Add to user portfolio (calculate cost based on current price approx)
      const candidate = candidates.find(c => c.id === selectedCandidateId);
      if (candidate) {
        const price = purchaseType === 'VENCE' ? candidate.price_vence : candidate.price_perde;
        addToPortfolio(selectedCandidateId, purchaseType, amount, price * amount);
      }

      // Keep modal open on Success step, user closes manually
    }
  };

  return (
    <div className="min-h-screen bg-bg-main pb-24 font-sans text-gray-900">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200">
        <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="font-black text-lg tracking-tight uppercase text-gray-900 leading-none">
              Quem Vence?
            </h1>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Presidente</span>
          </div>
          <div className="flex items-center gap-4">
            {/* Wallet Button REMOVED */}

            <div className="flex flex-col items-end">
              <div className="flex items-center gap-1 mb-0.5">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <img src="https://flagcdn.com/w20/br.png" alt="Brasil" className="w-5 h-auto rounded-sm" />
              </div>
              <div className="text-xs text-gray-400 font-medium tracking-tight">Vol R$10.000</div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-md mx-auto pt-20 px-4 space-y-6">

        {/* Candidates List - Cards */}
        <div className="space-y-4">
          {[...candidates]
            .sort((a, b) => b.price_vence - a.price_vence)
            .map(candidate => (
              <div key={candidate.id}>
                <CandidateCard
                  candidate={candidate}
                  onBuy={openPurchase}
                />
              </div>
            ))}
        </div>

        {/* Chart Section - Global Context */}
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide">Histórico Geral</h3>
            {/* VENCE / PERDE Tabs */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setChartTab('VENCE')}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${chartTab === 'VENCE' ? 'bg-white text-vence shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
              >
                VENCE
              </button>
              <button
                onClick={() => setChartTab('PERDE')}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${chartTab === 'PERDE' ? 'bg-white text-perde shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
              >
                PERDE
              </button>
            </div>
          </div>

          {/* Chart */}
          <div className="relative">
            <BondingCurveChart
              data={chartData}
              lines={chartLines}
              currencyFormatter={(val) => `${val.toFixed(1)}%`}
            />
          </div>
        </div>

        {/* Whatsapp Button: Removed (moved to purchase flow) */}

        {/* Info Section (Rules, Disclaimer, Terms) */}
        <InfoTabs />

      </main>

      {/* Bottom Nav Mock */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-3 z-40">
        <div className="max-w-md mx-auto flex justify-around text-xs font-bold text-gray-400 uppercase tracking-tighter">
          <span className="text-black border-b-2 border-black pb-1 cursor-pointer">Presidente</span>
          <span onClick={() => setComingSoonOpen(true)} className="cursor-pointer hover:text-gray-600 transition-colors">Governador</span>
          <span onClick={() => setComingSoonOpen(true)} className="cursor-pointer hover:text-gray-600 transition-colors">Senador</span>
          <span onClick={() => setComingSoonOpen(true)} className="cursor-pointer hover:text-gray-600 transition-colors">Deputado</span>
        </div>
      </div>

      <ComingSoonModal
        isOpen={isComingSoonOpen}
        onClose={() => setComingSoonOpen(false)}
        title="Em breve"
      />

      <WalletModal
        isOpen={isWalletOpen}
        onClose={() => setIsWalletOpen(false)}
        portfolio={portfolio}
        candidates={candidates}
        balance={balance}
        onSell={sellFromPortfolio}
        onWithdraw={withdrawBalance}
      />

      {selectedCandidateId && purchaseType && selectedCandidate && (
        <PurchaseModal
          isOpen={true}
          onClose={closePurchase}
          candidate={selectedCandidate}
          type={purchaseType}
          onSuccess={handlePurchaseSuccess}
        />
      )}

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
