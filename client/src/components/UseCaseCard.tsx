import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Gamepad2, 
  CreditCard, 
  Image as ImageIcon, 
  Code,
  ChevronRight 
} from "lucide-react";
import type { UseCaseTemplate } from "@shared/schema";

const iconMap = {
  TrendingUp,
  Gamepad2,
  CreditCard,
  Image: ImageIcon,
  Code,
};

interface UseCaseCardProps {
  useCase: UseCaseTemplate;
  onSelect: () => void;
}

export function UseCaseCard({ useCase, onSelect }: UseCaseCardProps) {
  const IconComponent = iconMap[useCase.icon as keyof typeof iconMap];
  const requiredCount = useCase.categories.filter(c => c.required).length;
  const optionalCount = useCase.categories.filter(c => !c.required).length;

  return (
    <Card
      onClick={onSelect}
      data-testid={`card-usecase-${useCase.id}`}
      className="min-h-[180px] p-6 cursor-pointer transition-all duration-150 hover-elevate active-elevate-2 hover:scale-[1.02]"
    >
      <div className="flex flex-col h-full gap-4">
        <div className="flex items-start justify-between gap-4">
          <div className="p-3 rounded-lg bg-primary/10">
            {IconComponent && <IconComponent className="w-6 h-6 text-primary" />}
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
        </div>
        
        <div className="flex-1 flex flex-col gap-2">
          <h3 className="text-lg font-semibold">{useCase.name}</h3>
          <p className="text-sm text-muted-foreground leading-normal line-clamp-2">
            {useCase.description}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="text-xs">
            {requiredCount} Required
          </Badge>
          {optionalCount > 0 && (
            <Badge variant="outline" className="text-xs">
              {optionalCount} Optional
            </Badge>
          )}
        </div>
      </div>
    </Card>
  );
}
