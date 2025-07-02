import { Goal } from '@/types/Goal';
import { authService } from './authService';

const API_BASE_URL = 'http://localhost:8080/api';

const getAuthHeaders = () => {
  const token = authService.getToken();
  console.log('goalService: Getting auth headers, token exists:', !!token);
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

export const goalService = {
  getAllGoals: async (): Promise<Goal[]> => {
    try {
      console.log('goalService: Fetching all goals for authenticated user');
      const headers = getAuthHeaders();
      console.log('goalService: Request headers:', headers);
      
      const response = await fetch(`${API_BASE_URL}/goals`, {
        method: 'GET',
        headers,
        credentials: 'include',
      });

      console.log('goalService: Response status:', response.status);
      console.log('goalService: Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        if (response.status === 401) {
          console.log('goalService: Unauthorized, logging out user');
          authService.logout();
          window.location.href = '/login';
          throw new Error('Sessão expirada. Faça login novamente.');
        }
        throw new Error(`Erro ao buscar metas: ${response.status} - ${response.statusText}`);
      }

      const json = await response.json();
      console.log('goalService: Goals response:', json);
      
      // Handle different response formats from your Go backend
      const goals = json.data || json || [];
      console.log('goalService: Parsed goals:', goals);
      
      return goals;
    } catch (error) {
      console.error('goalService: Error fetching goals:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Erro de conexão: Verifique se o backend está rodando em localhost:8080');
      }
      throw error;
    }
  },

  createGoal: async (goalData: {
    title: string;
    description?: string;
    dueDate: string;
  }): Promise<Goal> => {
    try {
      console.log('goalService: Creating goal:', goalData);
      const dueDateISO = new Date(goalData.dueDate).toISOString();

      const response = await fetch(`${API_BASE_URL}/goals`, {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify({
          title: goalData.title,
          description: goalData.description || '',
          dueDate: dueDateISO,
        }),
      });

      console.log('goalService: Create response status:', response.status);

      if (!response.ok) {
        if (response.status === 401) {
          authService.logout();
          window.location.href = '/login';
          throw new Error('Sessão expirada. Faça login novamente.');
        }
        throw new Error(`Erro ao criar meta: ${response.status} - ${response.statusText}`);
      }

      const json = await response.json();
      console.log('goalService: Created goal response:', json);
      return json.data ?? json;
    } catch (error) {
      console.error('goalService: Error creating goal:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Erro de conexão: Verifique se o backend está rodando em localhost:8080');
      }
      throw error;
    }
  },

  updateGoal: async (goalId: number, goalData: Partial<Goal>): Promise<Goal> => {
    try {
      const response = await fetch(`${API_BASE_URL}/goals/${goalId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify(goalData),
      });

      if (!response.ok) {
        if (response.status === 401) {
          authService.logout();
          window.location.href = '/login';
          throw new Error('Sessão expirada. Faça login novamente.');
        }
        throw new Error(`Erro ao atualizar meta: ${response.status} - ${response.statusText}`);
      }

      const json = await response.json();
      return json.data ?? json;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Erro de conexão: Verifique se o backend está rodando em localhost:8080');
      }
      throw error;
    }
  },

  updateGoalProgress: async (goalId: number, progress: number): Promise<Goal> => {
    try {
      const response = await fetch(`${API_BASE_URL}/goals/${goalId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify({ progress }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          authService.logout();
          window.location.href = '/login';
          throw new Error('Sessão expirada. Faça login novamente.');
        }
        throw new Error(`Erro ao atualizar progresso: ${response.status} - ${response.statusText}`);
      }

      const json = await response.json();
      return json.data ?? json;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Erro de conexão: Verifique se o backend está rodando em localhost:8080');
      }
      throw error;
    }
  },

  deleteGoal: async (goalId: number): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/goals/${goalId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
        credentials: 'include',
      });

      if (!response.ok) {
        if (response.status === 401) {
          authService.logout();
          window.location.href = '/login';
          throw new Error('Sessão expirada. Faça login novamente.');
        }
        throw new Error(`Erro ao excluir meta: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Erro de conexão: Verifique se o backend está rodando em localhost:8080');
      }
      throw error;
    }
  },
};
