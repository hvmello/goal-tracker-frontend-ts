
import { Goal } from '@/types/Goal';

// TODO: Alterar esta URL para o ambiente de produção quando necessário
const API_BASE_URL = 'http://localhost:8080';

// Configuração padrão para requisições com CORS
const getRequestConfig = (method: string, body?: any) => {
  const config: RequestInit = {
    method,
    mode: 'cors', // Habilita CORS
    credentials: 'omit', // Não envia cookies por padrão
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      // Headers adicionais para CORS
      'Access-Control-Allow-Origin': '*',
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  return config;
};

export const goalService = {
  // GET /goals - Buscar todas as metas
  getAllGoals: async (): Promise<Goal[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/goals`, getRequestConfig('GET'));

      if (!response.ok) {
        throw new Error(`Erro ao buscar metas: ${response.status} - ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Erro de conexão: Verifique se o backend está rodando em localhost:8080');
      }
      throw error;
    }
  },

  // POST /goals - Criar nova meta
  createGoal: async (goalData: {
    title: string;
    description?: string;
    dueDate: string;
  }): Promise<Goal> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/goals`, 
        getRequestConfig('POST', {
          title: goalData.title,
          description: goalData.description || '',
          dueDate: goalData.dueDate,
        })
      );

      if (!response.ok) {
        throw new Error(`Erro ao criar meta: ${response.status} - ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Erro de conexão: Verifique se o backend está rodando em localhost:8080');
      }
      throw error;
    }
  },

  // PUT /goals/:id - Atualizar meta existente
  updateGoal: async (goalId: number, goalData: Partial<Goal>): Promise<Goal> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/goals/${goalId}`, 
        getRequestConfig('PUT', goalData)
      );

      if (!response.ok) {
        throw new Error(`Erro ao atualizar meta: ${response.status} - ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Erro de conexão: Verifique se o backend está rodando em localhost:8080');
      }
      throw error;
    }
  },

  // PUT /goals/:id/progress - Atualizar apenas o progresso da meta
  updateGoalProgress: async (goalId: number, progress: number): Promise<Goal> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/goals/${goalId}`, 
        getRequestConfig('PUT', { progress })
      );

      if (!response.ok) {
        throw new Error(`Erro ao atualizar progresso: ${response.status} - ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Erro de conexão: Verifique se o backend está rodando em localhost:8080');
      }
      throw error;
    }
  },

  // DELETE /goals/:id - Excluir meta
  deleteGoal: async (goalId: number): Promise<void> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/goals/${goalId}`, 
        getRequestConfig('DELETE')
      );

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
