
import { useState } from 'react'
import { MOCK_CANDIDATES } from './data/mock'
import { CandidateCard } from './components/CandidateCard'
import { BondingCurveChart } from './components/BondingCurveChart'
import { PurchaseModal } from './components/PurchaseModal'
import type { Database } from './types/database.types'
import { calculatePurchase } from './lib/bondingCurve'
import { TrendingUp, Users, Info } from 'lucide-react'

type Candidate = Database['public']['Tables']['candidates']['Row'];

function App() {
  const [candidates, setCandidates] = useState<Candidate[]>(MOCK_CANDIDATES);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [purchaseType, setPurchaseType] = useState<'VENCE' | 'PERDE' | null>(null);

  const openPurchase = (type: 'VENCE' | 'PERDE', candidateId: string) => {
    const candidate = candidates.find(c => c.id === candidateId);
    if (candidate) {
      setSelectedCandidate(candidate);
      setPurchaseType(type);
    }
  };

  const closePurchase = () => {
    setSelectedCandidate(null);
    setPurchaseType(null);
  };

  const handlePurchaseSuccess = (qty: number, _cpf: string, _whatsapp: string) => {
    if (!selectedCandidate || !purchaseType) return;

    // Update local state to reflect the purchase and price change
    setCandidates(prev => prev.map(c => {
      if (c.id === selectedCandidate.id) {
        const currentSold = purchaseType === 'VENCE' ? c.supply_vence_sold : c.supply_perde_sold;
        const { newNextPrice } = calculatePurchase(currentSold, qty);

        // Update the sold count and price
        return {
          ...c,
          supply_vence_sold: purchaseType === 'VENCE' ? c.supply_vence_sold + qty : c.supply_vence_sold,
          supply_perde_sold: purchaseType === 'PERDE' ? c.supply_perde_sold + qty : c.supply_perde_sold,
          price_vence: purchaseType === 'VENCE' ? (newNextPrice ?? 0) : c.price_vence,
          price_perde: purchaseType === 'PERDE' ? (newNextPrice ?? 0) : c.price_perde
        };
      }
      return c;
    }));
  };

  return (
    <div className="min-h-screen bg-bg-main pb-20">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-black/50 backdrop-blur-lg border-b border-white/5">
        <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
          <div className="font-black text-xl tracking-tighter italic bg-gradient-to-r from-vence to-perde bg-clip-text text-transparent">
            QUEM VENCE?
          </div>
          <div className="text-xs font-mono text-gray-500 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            LIVE
          </div>
        </div>
      </nav>

      <main className="max-w-md mx-auto pt-20 px-4 space-y-8">
        {/* Intro */}
        <section className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Mercado de Predição Política</h1>
          <p className="text-gray-400 text-sm">
            Compre tokens de apoio ou rejeição. O preço flutua baseado na demanda em tempo real.
          </p>
        </section>

        {/* Global Market Stats Mock */}
        <section className="grid grid-cols-2 gap-4">
          <div className="glass-panel p-4 rounded-xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-vence/20 flex items-center justify-center text-vence">
              <TrendingUp size={20} />
            </div>
            <div>
              <div className="text-xs text-gray-400">Vol. 24h</div>
              <div className="font-bold">R$ 45.2k</div>
            </div>
          </div>
          <div className="glass-panel p-4 rounded-xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-500">
              <Users size={20} />
            </div>
            <div>
              <div className="text-xs text-gray-400">Traders</div>
              <div className="font-bold">1.2k</div>
            </div>
          </div>
        </section>

        {/* Candidates List */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-lg">Candidatos em Alta</h2>
            <button className="text-xs text-vence hover:underline">Ver todos</button>
          </div>

          {candidates.map(candidate => (
            <div key={candidate.id} className="space-y-4">
              <CandidateCard
                candidate={candidate}
                onBuy={openPurchase}
              />
              <div className="px-2">
                <div className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                  <Info size={12} />
                  Histórico de Preços (Simulação)
                </div>
                <BondingCurveChart candidate={candidate} />
              </div>
            </div>
          ))}
        </section>
      </main>

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
