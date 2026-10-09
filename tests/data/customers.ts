import type { Customer } from '../types/store';

export const validCustomer: Customer = {
  nome: 'Maria Silva',
  email: 'maria.silva@example.com',
  cep: '01310-100',
};

export const invalidCustomer: Customer = {
  nome: 'Maria',
  email: 'email-invalido',
  cep: '123',
};
