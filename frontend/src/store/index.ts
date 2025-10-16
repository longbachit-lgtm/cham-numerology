import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
}

interface Profile {
  fullName: string;
  dob: string;
  gender?: string;
  jobField?: string;
  jobRole?: string;
  tz: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: User) => void;
  setProfile: (profile: Profile) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      profile: null,
      isAuthenticated: false,
      setAuth: (token, user) => {
        localStorage.setItem('token', token);
        set({ token, user, isAuthenticated: true });
      },
      setProfile: (profile) => set({ profile }),
      logout: () => {
        localStorage.removeItem('token');
        set({ token: null, user: null, profile: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

interface FeedState {
  todayFeed: any | null;
  tomorrowFeed: any | null;
  periodFeed: any | null;
  setTodayFeed: (feed: any) => void;
  setTomorrowFeed: (feed: any) => void;
  setPeriodFeed: (feed: any) => void;
}

export const useFeedStore = create<FeedState>((set) => ({
  todayFeed: null,
  tomorrowFeed: null,
  periodFeed: null,
  setTodayFeed: (feed) => set({ todayFeed: feed }),
  setTomorrowFeed: (feed) => set({ tomorrowFeed: feed }),
  setPeriodFeed: (feed) => set({ periodFeed: feed }),
}));

interface Todo {
  id: string;
  text: string;
  sourceTag?: string;
  dueAt?: string;
  doneAt?: string;
  createdAt: string;
}

interface TodoState {
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
  addTodo: (todo: Todo) => void;
  updateTodo: (id: string, updates: Partial<Todo>) => void;
  removeTodo: (id: string) => void;
}

export const useTodoStore = create<TodoState>((set) => ({
  todos: [],
  setTodos: (todos) => set({ todos }),
  addTodo: (todo) => set((state) => ({ todos: [todo, ...state.todos] })),
  updateTodo: (id, updates) =>
    set((state) => ({
      todos: state.todos.map((todo) =>
        todo.id === id ? { ...todo, ...updates } : todo
      ),
    })),
  removeTodo: (id) =>
    set((state) => ({
      todos: state.todos.filter((todo) => todo.id !== id),
    })),
}));
