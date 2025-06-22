import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { GoalCard } from '@/components/GoalCard';
import { CreateGoalForm } from '@/components/CreateGoalForm';
import { Goal } from '@/types/Goal';
import { goalService } from '@/services/goalService';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { AlertCircle, Target, TrendingUp, Plus } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  
  const { data: goals, isLoading, error } = useQuery({
    queryKey: ['goals'],
    queryFn: goalService.getAllGoals,
  });

  const handleUpdateProgress = async (goalId: number, newProgress: number) => {
    try {
      await goalService.updateGoalProgress(goalId, newProgress);
      
      // Atualizar o cache local
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
      console.error('Erro ao atualizar progresso:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o progresso da meta.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteGoal = async (goalId: number) => {
    try {
      await goalService.deleteGoal(goalId);
      
      // Atualizar o cache local
      queryClient.setQueryData(['goals'], (oldGoals: Goal[] | undefined) => {
        if (!oldGoals) return oldGoals;
        return oldGoals.filter(goal => goal.id !== goalId);
      });

      toast({
        title: "Meta excluída!",
        description: "A meta foi excluída com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao excluir meta:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir a meta.",
        variant: "destructive",
      });
    }
  };

  const handleCreateGoal = async (goalData: { title: string; description?: string; dueDate: string }) => {
    try {
      const newGoal = await goalService.createGoal(goalData);
      
      // Atualizar o cache local
      queryClient.setQueryData(['goals'], (oldGoals: Goal[] | undefined) => {
        if (!oldGoals) return [newGoal];
        return [newGoal, ...oldGoals];
      });

      toast({
        title: "Meta criada!",
        description: `A meta "${goalData.title}" foi criada com sucesso.`,
      });
    } catch (error) {
      console.error('Erro ao criar meta:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar a meta.",
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <Alert className="max-w-md mx-auto mt-20">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Erro ao carregar as metas. Verifique se o backend está rodando em localhost:8080 e tente novamente.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  const stats = goals ? getStatsFromGoals(goals) : { total: 0, completed: 0, inProgress: 0, overdue: 0 };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header - Fixed positioning for mobile */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-white/20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 md:mb-6 gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Dashboard de Metas
              </h1>
              <p className="text-gray-600 text-sm md:text-base">
                Acompanhe seu progresso e mantenha-se motivado
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                onClick={() => setIsCreateFormOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white w-full md:w-auto"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nova Meta
              </Button>
              <Target className="h-6 w-6 md:h-8 md:w-8 text-indigo-600 hidden md:block" />
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <div className="bg-white rounded-xl p-3 md:p-4 shadow-sm border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-gray-600">Total</p>
                  <p className="text-lg md:text-2xl font-bold text-gray-900">
                    {isLoading ? <Skeleton className="h-5 md:h-6 w-6 md:w-8" /> : stats.total}
                  </p>
                </div>
                <Target className="h-4 w-4 md:h-5 md:w-5 text-gray-400" />
              </div>
            </div>

            <div className="bg-white rounded-xl p-3 md:p-4 shadow-sm border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-gray-600">Concluídas</p>
                  <p className="text-lg md:text-2xl font-bold text-green-600">
                    {isLoading ? <Skeleton className="h-5 md:h-6 w-6 md:w-8" /> : stats.completed}
                  </p>
                </div>
                <TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-green-500" />
              </div>
            </div>

            <div className="bg-white rounded-xl p-3 md:p-4 shadow-sm border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-gray-600">Em Andamento</p>
                  <p className="text-lg md:text-2xl font-bold text-blue-600">
                    {isLoading ? <Skeleton className="h-5 md:h-6 w-6 md:w-8" /> : stats.inProgress}
                  </p>
                </div>
                <div className="h-4 w-4 md:h-5 md:w-5 bg-blue-500 rounded-full animate-pulse" />
              </div>
            </div>

            <div className="bg-white rounded-xl p-3 md:p-4 shadow-sm border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-gray-600">Atrasadas</p>
                  <p className="text-lg md:text-2xl font-bold text-red-600">
                    {isLoading ? <Skeleton className="h-5 md:h-6 w-6 md:w-8" /> : stats.overdue}
                  </p>
                </div>
                <AlertCircle className="h-4 w-4 md:h-5 md:w-5 text-red-500" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-white/20">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
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

      {/* Create Goal Form Modal */}
      <CreateGoalForm
        isOpen={isCreateFormOpen}
        onClose={() => setIsCreateFormOpen(false)}
        onCreateGoal={handleCreateGoal}
      />
    </div>
  );
};

export default Index;
