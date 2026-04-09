export const USER_SESSION_KEY = 'kdinsight_user_session';
export const ACTIVE_BROWSER_USER_KEY = 'kdinsight_active_browser_user';

export type UserRoleLower = 'admin' | 'client';

export type UserSession = {
  email: string;
  role: UserRoleLower;
  signedInAt: number;
};

function apiRoleToSession(api: 'ADMIN' | 'CLIENT'): UserRoleLower {
  return api === 'ADMIN' ? 'admin' : 'client';
}

export function sessionRoleToApi(role: UserRoleLower): 'ADMIN' | 'CLIENT' {
  return role === 'admin' ? 'ADMIN' : 'CLIENT';
}

export function readUserSession(): UserSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(USER_SESSION_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as UserSession;
    if (!data.email || (data.role !== 'admin' && data.role !== 'client')) return null;

    const activeEmail = localStorage.getItem(ACTIVE_BROWSER_USER_KEY);
    if (!activeEmail) {
      localStorage.setItem(ACTIVE_BROWSER_USER_KEY, data.email);
      return data;
    }

    if (activeEmail !== data.email) {
      sessionStorage.removeItem(USER_SESSION_KEY);
      return null;
    }

    return data;
  } catch {
    return null;
  }
}

export function writeUserSession(session: Omit<UserSession, 'role'> & { role: 'ADMIN' | 'CLIENT' }): void {
  localStorage.setItem(ACTIVE_BROWSER_USER_KEY, session.email);
  sessionStorage.setItem(
    USER_SESSION_KEY,
    JSON.stringify({
      email: session.email,
      role: apiRoleToSession(session.role),
      signedInAt: session.signedInAt,
    }),
  );
}

export function clearUserSession(): void {
  sessionStorage.removeItem(USER_SESSION_KEY);
  localStorage.removeItem(ACTIVE_BROWSER_USER_KEY);
}
