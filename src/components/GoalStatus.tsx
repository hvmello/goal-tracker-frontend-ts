
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Goal, GoalStatus as GoalStatusType } from '@/types/Goal';
import { CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GoalStatusProps {
  status: GoalStatusType;
  showIcon?: boolean;
}

export function getGoalStatus(goal: Goal): 'concluido' | 'em_andamento' | 'atrasado' {
  const today = new Date();
  const dueDate = new Date(goal.dueDate);
  
  if (goal.progress >= 100) {
    return 'concluido';
  } else if (dueDate < today) {
    return 'atrasado';
  } else {
    return 'em_andamento';
  }
}

export const GoalStatus: React.FC<GoalStatusProps> = ({ status, showIcon = true }) => {
  
  const getStatusConfig = (status: GoalStatusType) => {
    switch (status) {
      case 'concluido':
        return {
          label: 'Concluído',
          variant: 'default' as const,
          className: 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200',
          icon: CheckCircle
        };
      case 'em_andamento':
        return {
          label: 'Em Andamento',
          variant: 'secondary' as const,
          className: 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200',
          icon: Clock
        };
      case 'atrasado':
        return {
          label: 'Atrasado',
          variant: 'destructive' as const,
          className: 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200',
          icon: AlertTriangle
        };
      default:
        return {
          label: 'Indefinido',
          variant: 'outline' as const,
          className: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: Clock
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <Badge 
      variant={config.variant}
      className={cn(
        "px-2 py-1 text-xs font-medium transition-colors flex items-center gap-1",
        config.className
      )}
    >
      {showIcon && <Icon className="h-3 w-3" />}
      {config.label}
    </Badge>
  );
};
