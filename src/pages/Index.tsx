
import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { GoalCard } from '@/components/GoalCard';
import { Goal } from '@/types/Goal';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Target, TrendingUp } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

// Mock API function - replace with your actual API endpoint
const fetchGoals = async (): Promise<Goal[]> => {
  // Simulating API call with mock data
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return [
    {
      id: 1,
      title: "Exercitar-se 30 minutos",
      description: "Fazer exercícios físicos por pelo menos 30 minutos diariamente para manter a saúde",
      deadline: "2024-06-25",
      progress: 75,
      status: "em_andamento"
    },
    {
      id: 2,
      title: "Ler 20 páginas",
      description: "Ler 20 páginas de livros técnicos ou de desenvolvimento pessoal",
      deadline: "2024-06-20",
      progress: 100,
      status: "concluido"
    },
    {
      id: 3,
      title: "Meditar 15 minutos",
      description: "Praticar meditação mindfulness para reduzir o estresse e aumentar o foco",
      deadline: "2024-06-18",
      progress: 30,
      status: "atrasado"
    },
    {
      id: 4,
      title: "Estudar programação",
      description: "Dedicar 2 horas ao estudo de novas tecnologias e frameworks",
      deadline: "2024-06-24",
      progress: 60,
      status: "em_andamento"
    },
    {
      id: 5,
      title: "Beber 2L de água",
      description: "Manter-se hidratado bebendo pelo menos 2 litros de água por dia",
      deadline: "2024-06-22",
      progress: 85,
      status: "em_andamento"
    },
    {
      id: 6,
      title: "Organizar workspace",
      description: "Manter o ambiente de trabalho limpo e organizado para aumentar produtividade",
      deadline: "2024-06-19",
      progress: 100,
      status: "concluido"
    }
  ];
};

const Index = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: goals, isLoading, error } = useQuery({
    queryKey: ['goals'],
    queryFn: fetchGoals,
  });

  const handleUpdateProgress = async (goalId: number, newProgress: number) => {
    try {
      // Here you would normally make an API call to update the goal
      // For now, we'll just update the local cache
      
      queryClient.setQueryData(['goals'], (oldGoals: Goal[] | undefined) => {
        if (!oldGoals) return oldGoals;
        
        return oldGoals.map(goal => 
          goal.id === goalId 
            ? { 
                ...goal, 
                progress: newProgress,
                status: newProgress === 100 ? 'concluido' as const : goal.status
              }
            : goal
        );
      });

      toast({
        title: "Progresso atualizado!",
        description: `O progresso da meta foi atualizado para ${newProgress}%.`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o progresso da meta.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteGoal = async (goalId: number) => {
    try {
      // Here you would normally make an API call to delete the goal
      // For now, we'll just update the local cache
      
      queryClient.setQueryData(['goals'], (oldGoals: Goal[] | undefined) => {
        if (!oldGoals) return oldGoals;
        return oldGoals.filter(goal => goal.id !== goalId);
      });

      toast({
        title: "Meta excluída!",
        description: "A meta foi excluída com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível excluir a meta.",
        variant: "destructive",
      });
    }
  };

  const getStatsFromGoals = (goals: Goal[]) => {
    const total = goals.length;
    const completed = goals.filter(goal => goal.status === 'concluido').length;
    const inProgress = goals.filter(goal => goal.status === 'em_andamento').length;
    const overdue = goals.filter(goal => goal.status === 'atrasado').length;
    
    return { total, completed, inProgress, overdue };
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
        <div className="max-w-7xl mx-auto">
          <Alert className="max-w-md mx-auto mt-20">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Erro ao carregar as metas. Tente novamente mais tarde.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  const stats = goals ? getStatsFromGoals(goals) : { total: 0, completed: 0, inProgress: 0, overdue: 0 };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Dashboard de Metas
              </h1>
              <p className="text-gray-600">
                Acompanhe seu progresso e mantenha-se motivado
              </p>
            </div>
            <Target className="h-8 w-8 text-indigo-600" />
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {isLoading ? <Skeleton className="h-6 w-8" /> : stats.total}
                  </p>
                </div>
                <Target className="h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Concluídas</p>
                  <p className="text-2xl font-bold text-green-600">
                    {isLoading ? <Skeleton className="h-6 w-8" /> : stats.completed}
                  </p>
                </div>
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Em Andamento</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {isLoading ? <Skeleton className="h-6 w-8" /> : stats.inProgress}
                  </p>
                </div>
                <div className="h-5 w-5 bg-blue-500 rounded-full animate-pulse" />
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Atrasadas</p>
                  <p className="text-2xl font-bold text-red-600">
                    {isLoading ? <Skeleton className="h-6 w-8" /> : stats.overdue}
                  </p>
                </div>
                <AlertCircle className="h-5 w-5 text-red-500" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-white/20">
                <Skeleton className="h-6 w-3/4 mb-3" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3 mb-4" />
                <Skeleton className="h-2 w-full mb-4" />
                <div className="flex justify-between items-center">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {goals?.map((goal) => (
              <GoalCard 
                key={goal.id} 
                goal={goal} 
                onUpdateProgress={handleUpdateProgress}
                onDeleteGoal={handleDeleteGoal}
              />
            ))}
          </div>
        )}

        {goals && goals.length === 0 && (
          <div className="text-center py-12">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma meta encontrada
            </h3>
            <p className="text-gray-600">
              Comece criando sua primeira meta para acompanhar seu progresso.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
