import { Goal } from '@/types/Goal';

const API_BASE_URL = 'http://localhost:8080/api';

export const goalService = {
  getAllGoals: async (): Promise<Goal[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/goals`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Erro ao buscar metas: ${response.status} - ${response.statusText}`);
      }

      const json = await response.json();
      // Retorna só o array de metas dentro de data
      return json.data;
    } catch (error) {
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

      const dueDateISO = new Date(goalData.dueDate).toISOString();

      const response = await fetch(`${API_BASE_URL}/goals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          title: goalData.title,
          description: goalData.description || '',
          dueDate: dueDateISO,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro ao criar meta: ${response.status} - ${response.statusText}`);
      }

      const json = await response.json();
      return json.data ?? json; // caso retorne o objeto com data ou só o objeto
    } catch (error) {
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
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(goalData),
      });

      if (!response.ok) {
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
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ progress }),
      });

      if (!response.ok) {
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
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
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
