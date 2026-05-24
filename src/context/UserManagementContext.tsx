import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'user';
  status: 'Hoạt động' | 'Khóa';
  joinDate: string;
  avatar?: string;
}

const initialUsers: AdminUser[] = [
  { id: '1', name: 'Admin', email: 'admin@tennispro.vn', phone: '0901234567', role: 'admin', status: 'Hoạt động', joinDate: '01/01/2026' },
  { id: '2', name: 'Nguyễn Văn A', email: 'user@example.com', phone: '0912345678', role: 'user', status: 'Hoạt động', joinDate: '15/01/2026' },
  { id: '3', name: 'Trần Thị B', email: 'tranthib@example.com', phone: '0987654321', role: 'user', status: 'Hoạt động', joinDate: '20/02/2026' },
  { id: '4', name: 'Lê Văn C', email: 'levanc@example.com', phone: '0933445566', role: 'user', status: 'Khóa', joinDate: '05/03/2026' },
  { id: '5', name: 'Phạm Thị D', email: 'phamthid@example.com', phone: '0977889900', role: 'user', status: 'Hoạt động', joinDate: '10/03/2026' },
];

interface UserManagementContextType {
  users: AdminUser[];
  addUser: (user: AdminUser) => void;
  updateUser: (id: string, user: Partial<AdminUser>) => void;
  deleteUser: (id: string) => void;
}

const UserManagementContext = createContext<UserManagementContextType | undefined>(undefined);

export function UserManagementProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<AdminUser[]>(initialUsers);

  const addUser = (user: AdminUser) => {
    setUsers(prev => [...prev, user]);
  };

  const updateUser = (id: string, updatedData: Partial<AdminUser>) => {
    setUsers(prev => 
      prev.map(user => 
        user.id === id ? { ...user, ...updatedData } : user
      )
    );
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(user => user.id !== id));
  };

  return (
    <UserManagementContext.Provider value={{ users, addUser, updateUser, deleteUser }}>
      {children}
    </UserManagementContext.Provider>
  );
}

export function useUserManagement() {
  const context = useContext(UserManagementContext);
  if (context === undefined) {
    throw new Error('useUserManagement must be used within a UserManagementProvider');
  }
  return context;
}
