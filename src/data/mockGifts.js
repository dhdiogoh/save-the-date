// Dados mockados só pra visualização do grid (fotos do Unsplash, uso livre). Quando a
// integração estiver pronta, isso vira um fetch no Supabase (tabela `gift_items`) com o
// mesmo formato abaixo — nome, imagem e link de pagamento (InfinitePay) vindos do banco.
export const mockGifts = [
  {
    id: 1,
    nome: 'Jogo de Panelas',
    imagem: 'https://images.unsplash.com/photo-1607123021911-6cc5e318284c?w=600&h=600&fit=crop&q=80&auto=format',
    valor_centavos: 32000,
    status: 'disponivel',
  },
  {
    id: 2,
    nome: 'Liquidificador',
    imagem: 'https://images.unsplash.com/photo-1654064754916-e3edeb09c042?w=600&h=600&fit=crop&q=80&auto=format',
    valor_centavos: 18000,
    status: 'disponivel',
  },
  {
    id: 3,
    nome: 'Jogo de Toalhas',
    imagem: 'https://images.unsplash.com/photo-1635352558665-0b01650e9b84?w=600&h=600&fit=crop&q=80&auto=format',
    valor_centavos: 14000,
    status: 'presenteado',
  },
  {
    id: 4,
    nome: 'Ventilador',
    imagem: 'https://images.unsplash.com/photo-1565515856776-dfd807686055?w=600&h=600&fit=crop&q=80&auto=format',
    valor_centavos: 25000,
    status: 'disponivel',
  },
  {
    id: 5,
    nome: 'Kit Churrasco',
    imagem: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&h=600&fit=crop&q=80&auto=format',
    valor_centavos: 40000,
    status: 'disponivel',
  },
  {
    id: 6,
    nome: 'Cafeteira',
    imagem: 'https://images.unsplash.com/photo-1746289573063-2bee3bd96667?w=600&h=600&fit=crop&q=80&auto=format',
    valor_centavos: 8000,
    status: 'disponivel',
  },
]
