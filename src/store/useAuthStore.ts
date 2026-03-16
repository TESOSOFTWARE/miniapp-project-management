import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'ADMIN' | 'SUPER_ADMIN' | 'VIEWER';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  permissions: string[];
  avatar?: string;
}

interface AuthState {
  currentUser: AdminUser | null;
  allUsers: AdminUser[];
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  addUser: (user: Omit<AdminUser, 'id'>) => void;
  removeUser: (id: string) => void;
  updatePermissions: (id: string, permissions: string[]) => void;
  updateUserRole: (id: string, role: UserRole) => void;
}

// Initial default admin
const DEFAULT_ADMIN: AdminUser = {
  id: '1',
  name: 'System Admin',
  email: 'admin@promanage.com',
  password: 'admin123',
  role: 'SUPER_ADMIN',
  permissions: ['all'],
  avatar: 'SA'
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      currentUser: null,
      allUsers: [DEFAULT_ADMIN],
      
      login: async (email, password) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            const user = useAuthStore.getState().allUsers.find(
              u => u.email === email && u.password === password
            );
            if (user) {
              // Don't expose password in currentUser session
              const { password: _, ...safeUser } = user;
              set({ currentUser: { ...safeUser, password: '' } as AdminUser });
              resolve(true);
            } else {
              resolve(false);
            }
          }, 800);
        });
      },
      
      logout: () => set({ currentUser: null }),
      
      addUser: (userData) => set((state) => ({
        allUsers: [...state.allUsers, { ...userData, id: Math.random().toString(36).substr(2, 9) }]
      })),
      
      removeUser: (id) => set((state) => ({
        allUsers: state.allUsers.filter(u => u.id !== id)
      })),
      
      updatePermissions: (id, permissions) => set((state) => ({
        allUsers: state.allUsers.map(u => u.id === id ? { ...u, permissions } : u),
        currentUser: state.currentUser?.id === id ? { ...state.currentUser, permissions } : state.currentUser
      })),

      updateUserRole: (id, role) => set((state) => ({
        allUsers: state.allUsers.map(u => u.id === id ? { ...u, role } : u),
        currentUser: state.currentUser?.id === id ? { ...state.currentUser, role } : state.currentUser
      })),
    }),
    {
      name: 'pm-auth-storage',
    }
  )
);
