
import { User, Issue, UserRole } from './types';

const STORAGE_KEYS = {
  USERS: 'fmx_users',
  ISSUES: 'fmx_issues',
  AUTH: 'fmx_auth_v2'
};

export const MockDB = {
  getUsers: (): User[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]'),
  saveUser: (user: User) => {
    const users = MockDB.getUsers();
    users.push(user);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },
  findUserByEmail: (email: string): User | undefined => {
    return MockDB.getUsers().find(u => u.email === email);
  },
  
  getIssues: (): Issue[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.ISSUES) || '[]'),
  saveIssue: (issue: Issue) => {
    const issues = MockDB.getIssues();
    issues.push(issue);
    localStorage.setItem(STORAGE_KEYS.ISSUES, JSON.stringify(issues));
  },
  updateIssue: (updatedIssue: Issue) => {
    const issues = MockDB.getIssues();
    const index = issues.findIndex(i => i.id === updatedIssue.id);
    if (index !== -1) {
      issues[index] = { ...updatedIssue, updatedAt: Date.now() };
      localStorage.setItem(STORAGE_KEYS.ISSUES, JSON.stringify(issues));
    }
  },
  
  getAuth: (): User | null => JSON.parse(localStorage.getItem(STORAGE_KEYS.AUTH) || 'null'),
  setAuth: (user: User | null) => localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(user)),
  logout: () => localStorage.removeItem(STORAGE_KEYS.AUTH)
};
