
import { Goal } from '@/types/Goal';

// TODO: Alterar esta URL para o ambiente de produção quando necessário
const API_BASE_URL = 'http://localhost:8080';

export const goalService = {
  // GET /goals - Buscar todas as metas
  getAllGoals: async (): Promise<Goal[]> => {
    const response = await fetch(`${API_BASE_URL}/goals`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar metas: ${response.status}`);
    }

    return response.json();
  },

  // POST /goals - Criar nova meta
  createGoal: async (goalData: {
    title: string;
    description?: string;
    dueDate: string;
  }): Promise<Goal> => {
    const response = await fetch(`${API_BASE_URL}/goals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: goalData.title,
        description: goalData.description || '',
        dueDate: goalData.dueDate,
      }),
    });

    if (!response.ok) {
      throw new Error(`Erro ao criar meta: ${response.status}`);
    }

    return response.json();
  },

  // PUT /goals/:id - Atualizar meta existente
  updateGoal: async (goalId: number, goalData: Partial<Goal>): Promise<Goal> => {
    const response = await fetch(`${API_BASE_URL}/goals/${goalId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(goalData),
    });

    if (!response.ok) {
      throw new Error(`Erro ao atualizar meta: ${response.status}`);
    }

    return response.json();
  },

  // PUT /goals/:id/progress - Atualizar apenas o progresso da meta
  updateGoalProgress: async (goalId: number, progress: number): Promise<Goal> => {
    const response = await fetch(`${API_BASE_URL}/goals/${goalId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ progress }),
    });

    if (!response.ok) {
      throw new Error(`Erro ao atualizar progresso: ${response.status}`);
    }

    return response.json();
  },

  // DELETE /goals/:id - Excluir meta
  deleteGoal: async (goalId: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/goals/${goalId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Erro ao excluir meta: ${response.status}`);
    }
  },
};
