import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAuthStore } from '../authStore';
import * as authService from '@/services/authService';
import * as storage from '@/utils/storage';

vi.mock('@/services/authService');
vi.mock('@/utils/storage');

describe('authStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.setState({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
    });
  });

  describe('loginWithToken', () => {
    it('should clear token from storage if /auth/me fails', async () => {
      const invalidToken = 'invalid-token-from-oauth';

      // Simulate /auth/me returning 401
      authService.me.mockRejectedValueOnce(new Error('401 Unauthorized'));

      const loginWithToken = useAuthStore.getState().loginWithToken;

      try {
        await loginWithToken(invalidToken);
      } catch {
        // Expected to throw
      }

      // Token should be cleared after validation failure
      expect(storage.clearToken).toHaveBeenCalled();

      // Auth state should NOT be set
      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
    });

    it('should store token if /auth/me succeeds', async () => {
      const validToken = 'valid-token-from-oauth';
      const mockUser = { id: 1, email: 'test@example.com', role: 'student' };

      // Simulate successful /auth/me
      authService.me.mockResolvedValueOnce({ data: mockUser });

      const loginWithToken = useAuthStore.getState().loginWithToken;
      const result = await loginWithToken(validToken);

      // Token should be stored
      expect(storage.setToken).toHaveBeenCalledWith(validToken);

      // Auth state should be set
      expect(result).toEqual(mockUser);
      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(true);
      expect(state.user).toEqual(mockUser);
    });
  });
});
