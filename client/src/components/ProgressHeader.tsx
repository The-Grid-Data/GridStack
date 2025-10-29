import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, RotateCcw } from "lucide-react";

interface ProgressHeaderProps {
  currentStep: number;
  totalSteps: number;
  onBack?: () => void;
  onReset: () => void;
  title?: string;
}

export function ProgressHeader({ 
  currentStep, 
  totalSteps, 
  onBack,
  onReset,
  title = "Build Your Stack"
}: ProgressHeaderProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <header className="sticky top-0 z-50 bg-background border-b">
      <div className="flex items-center justify-between h-16 px-4 md:px-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-4 flex-1">
          {onBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              data-testid="button-back"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
          <h1 className="text-lg md:text-xl font-semibold">{title}</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-medium">
              Step {currentStep} of {totalSteps}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="gap-2"
            data-testid="button-reset"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Start Over</span>
          </Button>
        </div>
      </div>
      
      <Progress value={progress} className="h-1 rounded-none" />
    </header>
  );
}
