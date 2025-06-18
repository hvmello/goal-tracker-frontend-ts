
export type GoalStatus = 'em_andamento' | 'concluido' | 'atrasado';

export interface Goal {
  id: number;
  title: string;
  description: string;
  deadline: string;
  progress: number;
  status: GoalStatus;
}
