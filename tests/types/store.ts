export type ProductId = 'P001' | 'P002' | 'P003' | 'P004' | 'P005' | 'P006' | 'P007' | 'P008';

export interface Product {
  id: ProductId;
  nome: string;
  descricao: string;
  categoria: string;
  preco: number;
}

export interface CartItemInput {
  produtoId: ProductId;
  quantidade: number;
}

export interface CalculateCartRequest {
  itens: CartItemInput[];
  cupom?: string;
}

export interface CalculatedItem {
  produtoId: ProductId;
  nome: string;
  precoUnitario: number;
  quantidade: number;
  total: number;
}

export interface CouponResult {
  codigo?: string;
  aplicado: boolean;
  mensagem: string;
}

export interface CartCalculation {
  itens: CalculatedItem[];
  subtotal: number;
  desconto: number;
  frete: number;
  freteGratis: boolean;
  valorFaltanteFreteGratis: number;
  total: number;
  cupom: CouponResult | null;
}

export interface Customer {
  nome: string;
  email: string;
  cep: string;
}

export interface CreateOrderRequest extends CalculateCartRequest {
  cliente: Customer;
}

export interface OrderResponse extends CartCalculation {
  numero: string;
  criadoEm: string;
  cliente: Customer;
}

export interface ApiErrorBody {
  erro: {
    codigo: string;
    mensagem: string;
    campo?: string;
    campos?: Record<string, string>;
  };
}
