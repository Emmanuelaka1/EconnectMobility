// Utilitaires pour la gestion de l'authentification
export const setAuthToken = (token: string) => {
  localStorage.setItem('token', token);
};

export const setApiKey = (apiKey: string) => {
  localStorage.setItem('API_KEY', apiKey);
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};

export const getApiKey = (): string | null => {
  return localStorage.getItem('API_KEY');
};

export const removeAuthToken = () => {
  localStorage.removeItem('token');
};

export const removeApiKey = () => {
  localStorage.removeItem('API_KEY');
};

export const isAuthenticated = (): boolean => {
  const token = getAuthToken();
  const apiKey = getApiKey();
  return !!(token || apiKey);
};

export const clearAuth = () => {
  removeAuthToken();
  removeApiKey();
};