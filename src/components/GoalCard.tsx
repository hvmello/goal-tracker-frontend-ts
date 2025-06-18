
import React from 'react';
import { Goal } from '@/types/Goal';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Calendar, Clock } from 'lucide-react';
import { GoalStatus } from '@/components/GoalStatus';
import { cn } from '@/lib/utils';

interface GoalCardProps {
  goal: Goal;
}

export const GoalCard: React.FC<GoalCardProps> = ({ goal }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getDaysUntilDeadline = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysLeft = getDaysUntilDeadline(goal.deadline);

  const getProgressColor = (progress: number, status: string) => {
    if (status === 'concluido') return 'bg-green-500';
    if (status === 'atrasado') return 'bg-red-500';
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white/80 backdrop-blur-sm border-white/20 overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg text-gray-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
            {goal.title}
          </h3>
          <GoalStatus status={goal.status} />
        </div>
        <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
          {goal.description}
        </p>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Progress Section */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progresso</span>
            <span className="text-sm font-bold text-gray-900">{goal.progress}%</span>
          </div>
          <div className="relative">
            <Progress 
              value={goal.progress} 
              className="h-2 bg-gray-100"
            />
            <div 
              className={cn(
                "absolute top-0 left-0 h-2 rounded-full transition-all duration-500",
                getProgressColor(goal.progress, goal.status)
              )}
              style={{ width: `${goal.progress}%` }}
            />
          </div>
        </div>

        {/* Deadline Section */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(goal.deadline)}</span>
          </div>
          
          <div className={cn(
            "flex items-center gap-1 font-medium",
            daysLeft < 0 ? "text-red-600" : 
            daysLeft <= 2 ? "text-yellow-600" : 
            "text-gray-600"
          )}>
            <Clock className="h-4 w-4" />
            <span>
              {daysLeft < 0 ? `${Math.abs(daysLeft)} dias atrás` :
               daysLeft === 0 ? 'Hoje' :
               daysLeft === 1 ? '1 dia' :
               `${daysLeft} dias`}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
