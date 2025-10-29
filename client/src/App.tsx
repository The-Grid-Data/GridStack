import { useState } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import UseCaseSelection from "@/pages/UseCaseSelection";
import ProductSelection from "@/pages/ProductSelection";
import CompatibilityResults from "@/pages/CompatibilityResults";
import { useStackStore } from "@/lib/stackStore";
import type { UseCaseTemplate } from "@shared/schema";

type AppStep = 'use-case' | 'product-selection' | 'results';

function AppContent() {
  const [step, setStep] = useState<AppStep>('use-case');
  const { setUseCase, reset } = useStackStore();

  const handleSelectUseCase = (useCase: UseCaseTemplate) => {
    setUseCase(useCase);
    setStep('product-selection');
  };

  const handleBackToUseCases = () => {
    reset();
    setStep('use-case');
  };

  const handleCompleteSelection = () => {
    setStep('results');
  };

  const handleBackToSelection = () => {
    setStep('product-selection');
  };

  return (
    <>
      {step === 'use-case' && (
        <UseCaseSelection onSelectUseCase={handleSelectUseCase} />
      )}
      
      {step === 'product-selection' && (
        <ProductSelection 
          onBack={handleBackToUseCases}
          onComplete={handleCompleteSelection}
        />
      )}
      
      {step === 'results' && (
        <CompatibilityResults 
          onBack={handleBackToSelection}
          onReset={handleBackToUseCases}
        />
      )}
    </>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppContent />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
