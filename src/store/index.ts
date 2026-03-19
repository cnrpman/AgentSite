import type { InjectionKey } from 'vue';
import { createStore, useStore as useVuexStore, type Store } from 'vuex';

const AUTH_STORAGE_KEY = 'agent-site-auth';

export interface RootState {
  /** Non-null means the browser session is treated as signed in. */
  authToken: string | null;
}

function readStoredToken(): string | null {
  if (typeof sessionStorage === 'undefined') return null;
  return sessionStorage.getItem(AUTH_STORAGE_KEY);
}

export const storeKey: InjectionKey<Store<RootState>> = Symbol('store');

export const store = createStore<RootState>({
  state: () => ({
    authToken: readStoredToken(),
  }),
  getters: {
    isAuthenticated: (s: RootState) => Boolean(s.authToken),
  },
  mutations: {
    setAuthToken(state, token: string | null) {
      state.authToken = token;
      if (typeof sessionStorage === 'undefined') return;
      if (token) sessionStorage.setItem(AUTH_STORAGE_KEY, token);
      else sessionStorage.removeItem(AUTH_STORAGE_KEY);
    },
  },
  actions: {
    /**
     * POST /api/login with password. Server sets httpOnly cookie; we set Vuex for UI.
     * Content under /content/* is only served when that cookie is present.
     */
    async login({ commit }, password: string): Promise<boolean> {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
        credentials: 'include',
      });
      if (!res.ok) return false;
      commit('setAuthToken', 'ok');
      return true;
    },
    /** Clear server cookie and local auth state. */
    async logout({ commit }) {
      await fetch('/api/logout', { method: 'POST', credentials: 'include' });
      commit('setAuthToken', null);
    },
  },
});

export function useStore(): Store<RootState> {
  return useVuexStore(storeKey);
}
