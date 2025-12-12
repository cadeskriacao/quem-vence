import { useState } from 'react'
import { CandidateCard } from './components/CandidateCard'
import { BondingCurveChart } from './components/BondingCurveChart'
import { PurchaseModal } from './components/PurchaseModal'
import { Info, Wallet } from 'lucide-react'
import { useMarketSimulation } from './hooks/useMarketSimulation'
import { useUserPortfolio } from './hooks/useUserPortfolio'
import { WalletModal } from './components/WalletModal'

function App() {
  const { candidates, history, executeTrade } = useMarketSimulation();
  const { portfolio, balance, addToPortfolio, sellFromPortfolio, withdrawBalance } = useUserPortfolio();

  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  const [purchaseType, setPurchaseType] = useState<'VENCE' | 'PERDE' | null>(null);

  // Chart selection state
  const [chartCandidateId, setChartCandidateId] = useState<string | null>(null);
  const [isWalletOpen, setIsWalletOpen] = useState(false);

  // Default to first candidate for chart if none selected
  const activeChartId = chartCandidateId || candidates[0]?.id;
  const activeChartCandidate = candidates.find(c => c.id === activeChartId);

  const selectedCandidate = candidates.find(c => c.id === selectedCandidateId);

  const openPurchase = (type: 'VENCE' | 'PERDE', candidateId: string) => {
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
            {/* Wallet Button */}
            <button
              onClick={() => setIsWalletOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-colors"
            >
              <Wallet size={16} className="text-gray-900" />
              <div className="flex flex-col items-start leading-none">
                <span className="text-[10px] uppercase font-bold text-gray-400">Saldo</span>
                <span className="text-xs font-bold text-gray-900">R$ {balance.toFixed(2)}</span>
              </div>
            </button>

            <div className="flex flex-col items-end">
              <div className="text-xs text-gray-400 font-medium">Vol R$10.000</div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <img src="https://flagcdn.com/w20/br.png" alt="Brasil" className="w-5 h-auto rounded-sm" />
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-md mx-auto pt-20 px-4 space-y-6">

        {/* Candidates List - Cards */}
        <div className="space-y-4">
          {candidates.map(candidate => (
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
          </div>

          {/* Chip Selector */}
          <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
            {candidates.map(c => (
              <button
                key={c.id}
                onClick={() => setChartCandidateId(c.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors border ${activeChartId === c.id
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
                  }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          {/* Chart */}
          {activeChartCandidate && (
            <div className="relative">
              <div className="absolute top-2 right-2 flex gap-4 text-xs font-bold">
                <div className="flex items-center gap-1 text-vence">
                  <div className="w-2 h-2 bg-vence rounded-full"></div> VENCE
                </div>
                <div className="flex items-center gap-1 text-perde">
                  <div className="w-2 h-2 bg-perde rounded-full"></div> PERDE
                </div>
              </div>
              <BondingCurveChart
                history={history[activeChartId] || []}
              />
            </div>
          )}
        </div>

        {/* Whatsapp Button: Removed (moved to purchase flow) */}

        {/* Rules Teaser */}
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold uppercase text-gray-900">Regras</h3>
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Info size={12} /> Oct 4, 2026
            </span>
          </div>
          <p className="text-sm text-gray-600">
            O mercado fecha no dia da eleição. Ganhos são distribuídos proporcionalmente aos tokens VENCE do vencedor.
          </p>
        </div>

      </main>

      {/* Bottom Nav Mock */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-3 z-40">
        <div className="max-w-md mx-auto flex justify-around text-xs font-bold text-gray-400 uppercase tracking-tighter">
          <span className="text-black border-b-2 border-black pb-1">Presidente</span>
          <span>Governador</span>
          <span>Senador</span>
          <span>Deputado</span>
        </div>
      </div>

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
    </div>
  )
}

export default App
