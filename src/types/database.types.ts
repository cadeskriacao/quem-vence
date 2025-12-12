export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            candidates: {
                Row: {
                    id: string
                    name: string
                    price_vence: number
                    price_perde: number
                    supply_vence_sold: number
                    supply_perde_sold: number
                    status: 'active' | 'archived'
                    image_url: string
                    role: string
                }
                Insert: {
                    id?: string
                    name: string
                    price_vence: number
                    price_perde: number
                    supply_vence_sold?: number
                    status?: 'active' | 'archived'
                    image_url?: string
                    role?: string
                }
                Update: {
                    id?: string
                    name?: string
                    price_vence?: number
                    price_perde?: number
                    supply_vence_sold?: number
                    status?: 'active' | 'archived'
                    image_url?: string
                    role?: string
                }
            }
            users: {
                Row: {
                    cpf: string
                    whatsapp: string
                    created_at: string
                }
                Insert: {
                    cpf: string
                    whatsapp: string
                    created_at?: string
                }
                Update: {
                    cpf?: string
                    whatsapp?: string
                    created_at?: string
                }
            }
            transactions: {
                Row: {
                    id: string
                    user_cpf: string
                    token_type: 'VENCE' | 'PERDE'
                    quantity: number
                    total_amount: number
                    unit_price_avg: number
                    status: 'pending' | 'paid' | 'failed'
                    candidate_id: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_cpf: string
                    token_type: 'VENCE' | 'PERDE'
                    quantity: number
                    total_amount: number
                    unit_price_avg: number
                    status?: 'pending' | 'paid' | 'failed'
                    candidate_id: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_cpf?: string
                    token_type?: 'VENCE' | 'PERDE'
                    quantity?: number
                    total_amount?: number
                    unit_price_avg?: number
                    status?: 'pending' | 'paid' | 'failed'
                    candidate_id?: string
                    created_at?: string
                }
            }
        }
    }
}
