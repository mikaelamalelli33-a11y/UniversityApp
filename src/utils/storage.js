// All localStorage access goes through this file.
// If storage strategy changes, only this file needs updating.

const TOKEN_KEY = import.meta.env.VITE_TOKEN_KEY || 'uamd_access_token';
const REFRESH_TOKEN_KEY = import.meta.env.VITE_REFRESH_TOKEN_KEY || 'uamd_refresh_token';

export const storage = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: (value) => localStorage.setItem(TOKEN_KEY, value),
  removeToken: () => localStorage.removeItem(TOKEN_KEY),

  getRefreshToken: () => localStorage.getItem(REFRESH_TOKEN_KEY),
  setRefreshToken: (value) => localStorage.setItem(REFRESH_TOKEN_KEY, value),
  removeRefreshToken: () => localStorage.removeItem(REFRESH_TOKEN_KEY),

  clearAllTokens: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
};
