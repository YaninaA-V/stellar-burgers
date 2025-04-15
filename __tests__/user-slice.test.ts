import { TUser } from '../src/utils/types'
import userReducer, {
  initialState,
  checkUser,
  clearUserData,
  authCheck
} from '../src/services/user/user-slice';

import { login, logout, checkUserAuth, updateUser } from '../src/services/user/user-actions';

describe('Тестирование userReducer', () => {
  it('получить исходное состояние', () => {
    const state = userReducer(undefined, { type: 'unknown' });
    expect(state).toEqual(initialState);
  });

  describe('Синхронные экшены', () => {
    it('проверка обновления данных пользователя', () => {
      const user: TUser = { name: 'Tester', email: 'test@yandex.ru' };
      const action = checkUser(user);
      const state = userReducer(initialState, action);
      expect(state.user).toEqual(user);
    });

    it('проверка сброса данных пользователя', () => {
      const stateWithUser = {
        ...initialState,
        user: { name: 'Tester', email: 'test@yandex.ru' },
        isAuthenticated: true,
        isAuthChecked: false
      };
      const state = userReducer(stateWithUser, clearUserData());
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isAuthChecked).toBe(true);
    });

    it('проверка завершения аутентификации', () => {
      const state = userReducer(initialState, authCheck());
      expect(state.isAuthChecked).toBe(true);
    });
  });

  describe('Асинхронные экшены', () => {
    describe('login', () => {
      it('отработка login.pending', () => {
        const state = userReducer(initialState, login.pending('testRequestId', { email: '', password: '' }));
        expect(state.isLoading).toBe(true);
        expect(state.loginError).toBeNull();
      });

      it('отработка login.fulfilled', () => {
        const user: TUser = { name: 'Tester', email: 'test@yandex.ru' };
        const state = userReducer(
          { ...initialState, isLoading: true },
          login.fulfilled(user, 'testRequestId', { email: '', password: '' })
        );
        expect(state.user).toEqual(user);
        expect(state.isAuthenticated).toBe(true);
        expect(state.isLoading).toBe(false);
      });

      it('отработка login.rejected', () => {
        const error = { message: 'Login failed' };
        const state = userReducer(
          { ...initialState, isLoading: true },
          login.rejected(new Error('Login failed'), '', { email: '', password: '' })
        );
        expect(state.isLoading).toBe(false);
        expect(state.loginError).not.toBeNull();
      });
    });

    describe('logout', () => {
      it('отработка logout.fulfilled', () => {
        const stateWithUser = {
          ...initialState,
          user: { name: 'Tester', email: 'test@yandex.ru' },
          isAuthenticated: true
        };
        const state = userReducer(stateWithUser, logout.fulfilled(undefined, 'testRequestId'));
        expect(state.user).toBeNull();
        expect(state.isAuthenticated).toBe(false);
        expect(state.isAuthChecked).toBe(true);
      });
    });

    describe('checkUserAuth', () => {
      it('отработка checkUserAuth.pending', () => {
        const state = userReducer(initialState, checkUserAuth.pending(''));
        expect(state.isLoading).toBe(true);
    });

    it('отработка в состоянии аутентификации checkUserAuth.fulfilled', () => {
      const user: TUser = { name: 'Tester', email: 'test@yandex.ru' };
        const stateAfterCheckUser = userReducer(
          initialState,
          checkUser(user)
        );
        const state = userReducer(
          stateAfterCheckUser,
          checkUserAuth.fulfilled(user, '')
        );
        expect(state.isAuthChecked).toBe(true);
        expect(state.isAuthenticated).toBe(true);
        expect(state.isLoading).toBe(false);
    });

    it('отработка неаутентифицированного checkUserAuth.fulfilled', () => {
      const state = userReducer(
        initialState,
        checkUserAuth.fulfilled(null, '')
      );
      expect(state.isAuthChecked).toBe(true);
      expect(state.isAuthenticated).toBe(false);
      expect(state.isLoading).toBe(false);
    });

    it('отработка checkUserAuth.rejected', () => {
      const stateWithUser = {
        ...initialState,
        user: { name: 'Tester', email: 'test@yandex.ru' },
        isAuthenticated: true
      };
      const state = userReducer(
        stateWithUser,
        checkUserAuth.rejected(new Error('Error'), '')
      );
      expect(state.user).toBeNull();
      expect(state.isAuthChecked).toBe(true);
      expect(state.isAuthenticated).toBe(false);
      expect(state.isLoading).toBe(false);
    });
  });

  describe('updateUser', () => {
    it('отработка updateUser.fulfilled', () => {
      const updatedUser: TUser = { name: 'Updated', email: 'updated@yandex.ru' };
      const state = userReducer(
        initialState,
        updateUser.fulfilled(updatedUser, '', updatedUser)
      );
      expect(state.user).toEqual(updatedUser);
    });
  });
  });
})
