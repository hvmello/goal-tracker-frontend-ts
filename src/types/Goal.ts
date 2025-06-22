
export type GoalStatus = 'em_andamento' | 'concluido' | 'atrasado';

export interface Goal {
  id: number;
  title: string;
  description: string;
  dueDate: string; // O backend retorna como string ISO
  progress: number;
  status?: GoalStatus; // Opcional pois pode ser calculado no frontend
  createdAt?: string; // Campos do backend (opcionais no frontend)
  updatedAt?: string;
}
