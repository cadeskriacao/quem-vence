import { useState } from 'react'
import { CandidateCard } from './components/CandidateCard'
import { BondingCurveChart } from './components/BondingCurveChart'
import { PurchaseModal } from './components/PurchaseModal'
import { Info } from 'lucide-react'
import { useMarketSimulation } from './hooks/useMarketSimulation'

function App() {
  const { candidates, history, executeTrade } = useMarketSimulation();

  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  const [purchaseType, setPurchaseType] = useState<'VENCE' | 'PERDE' | null>(null);

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
      executeTrade(selectedCandidateId, purchaseType, amount);
      closePurchase();
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
          <div className="flex flex-col items-end">
            <div className="text-xs text-gray-400 font-medium">Vol R$10.000</div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <img src="https://flagcdn.com/w20/br.png" alt="Brasil" className="w-5 h-auto rounded-sm" />
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
          {/* Passing first candidate just for demo chart visuals */}
          {candidates.length > 0 && <BondingCurveChart
            history={history[candidates[0].id] || []}
          />}
        </div>

        {/* WhatsApp Button */}
        <button className="w-full py-4 bg-white border-2 border-gray-900 text-gray-900 font-black uppercase tracking-wide text-sm hover:bg-gray-50 transition-colors shadow-sm active:translate-y-0.5">
          Compartilhar Whatsapp
        </button>

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

      {selectedCandidate && purchaseType && (
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
