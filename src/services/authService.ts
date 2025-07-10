
const API_BASE_URL = 'http://localhost:8080/api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export interface AuthResponseWrapper {
  success: boolean;
  data: {
    token: string;
    user: {
      id: number;
      name: string;
      email: string;
    };
  };
}

export const authService = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error(`Erro ao fazer login: ${response.status} - ${response.statusText}`);
      }

      const responseData = await response.json() as AuthResponseWrapper;
      console.log('Login response:', responseData);

      if (!responseData.success) {
        throw new Error('Login falhou: resposta do servidor indicou falha');
      }

      return responseData.data; // Return the nested data object
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Erro de conexão: Verifique se o backend está rodando em localhost:8080');
      }
      throw error;
    }
  },

  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error(`Erro ao criar conta: ${response.status} - ${response.statusText}`);
      }

      const responseData = await response.json() as AuthResponseWrapper;
      console.log('Register response:', responseData);

      if (!responseData.success) {
        throw new Error('Registro falhou: resposta do servidor indicou falha');
      }

      return responseData.data; // Return the nested data object
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Erro de conexão: Verifique se o backend está rodando em localhost:8080');
      }
      throw error;
    }
  },


  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getToken: (): string | null => {
    return localStorage.getItem('token');
  },

getUser: () => {
  try {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  } catch {
    
    localStorage.removeItem('user');
    return null;
  }
},

  setAuthData: (token: string, user: any) => {
    console.log('Setting auth data in localStorage:', { token, user });
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    // Verify data was set correctly
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    console.log('Verified localStorage data:', {
      tokenSet: storedToken === token,
      userSet: storedUser === JSON.stringify(user)
    });
  }

};
