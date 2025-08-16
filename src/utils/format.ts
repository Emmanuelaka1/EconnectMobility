export const formatCurrency = (amount: number): string => {
  return `${(amount / 1000).toLocaleString()} FCFA`;
};

export const formatCurrencyFull = (amount: number): string => {
  return `${amount.toLocaleString()} FCFA`;
};
