import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'user' | 'admin';

export interface Address {
  id: string;
  name: string;
  phone: string;
  address: string;
  isDefault: boolean;
  type: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  addresses?: Address[];
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (user: User) => void;
  loginWithCredentials: (email: string, password: string) => User | null;
  register: (data: { name: string; email: string; password: string; phone?: string }) => User | null;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const USERS_STORAGE_KEY = 'tennis-auth-users';

interface StoredUser extends User {
  password: string;
}

const defaultAddresses: Address[] = [
  {
    id: '1',
    name: 'Nguyễn Văn A',
    phone: '0901 234 567',
    address: '123 Đường Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh',
    isDefault: true,
    type: 'Nhà riêng'
  },
  {
    id: '2',
    name: 'Nguyễn Văn A',
    phone: '0901 234 567',
    address: 'Tòa nhà Bitexco, Số 2 Hải Triều, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
    isDefault: false,
    type: 'Công ty'
  }
];

const demoUsers: StoredUser[] = [
  {
    id: '1',
    name: 'Admin',
    email: 'admin@tennispro.vn',
    phone: '0901234567',
    role: 'admin',
    password: 'admin123',
    addresses: defaultAddresses,
  },
  {
    id: '2',
    name: 'Nguyễn Văn A',
    email: 'user@example.com',
    phone: '0901234567',
    role: 'user',
    password: 'user123',
    addresses: defaultAddresses,
  },
];

function safeJsonParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function stripPassword(user: StoredUser): User {
  const { password: _password, ...safeUser } = user;
  return safeUser;
}

function getStoredUsers() {
  const registeredUsers = safeJsonParse<StoredUser[]>(
    localStorage.getItem(USERS_STORAGE_KEY),
    []
  );
  return [...demoUsers, ...registeredUsers];
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    return safeJsonParse<User | null>(localStorage.getItem('user'), null);
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = (userData: User) => {
    setUser(userData);
  };

  const loginWithCredentials = (email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const foundUser = getStoredUsers().find(
      storedUser => storedUser.email.toLowerCase() === normalizedEmail && storedUser.password === password
    );

    if (!foundUser) return null;

    const authenticatedUser = stripPassword(foundUser);
    setUser(authenticatedUser);
    return authenticatedUser;
  };

  const register = ({ name, email, password, phone = '' }: { name: string; email: string; password: string; phone?: string }) => {
    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = getStoredUsers().find(storedUser => storedUser.email.toLowerCase() === normalizedEmail);
    if (existingUser) return null;

    const registeredUsers = safeJsonParse<StoredUser[]>(
      localStorage.getItem(USERS_STORAGE_KEY),
      []
    );
    const newStoredUser: StoredUser = {
      id: Date.now().toString(),
      name: name.trim(),
      email: normalizedEmail,
      phone,
      role: 'user',
      password,
      addresses: [],
    };

    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([...registeredUsers, newStoredUser]));
    const newUser = stripPassword(newStoredUser);
    setUser(newUser);
    return newUser;
  };

  const logout = () => {
    setUser(null);
  };

  const updateUser = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);

      const registeredUsers = safeJsonParse<StoredUser[]>(
        localStorage.getItem(USERS_STORAGE_KEY),
        []
      );
      localStorage.setItem(
        USERS_STORAGE_KEY,
        JSON.stringify(registeredUsers.map(storedUser =>
          storedUser.id === updatedUser.id ? { ...storedUser, ...data } : storedUser
        ))
      );
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        loginWithCredentials,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
