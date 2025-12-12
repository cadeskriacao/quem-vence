
import type { Database } from '../types/database.types';

export const MOCK_CANDIDATES: Database['public']['Tables']['candidates']['Row'][] = [
    {
        id: 'c1-001',
        name: 'Roberto Silva',
        role: 'Governador',
        price_vence: 12.50,
        price_perde: 7.50,
        supply_vence_sold: 2500,
        supply_perde_sold: 2250,
        status: 'active',
        image_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200&h=200',
    },
    {
        id: 'c1-002',
        name: 'Maria Souza',
        role: 'Governador',
        price_vence: 10.15,
        price_perde: 9.85,
        supply_vence_sold: 150,
        supply_perde_sold: 135,
        status: 'active',
        image_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200',
    }
];
