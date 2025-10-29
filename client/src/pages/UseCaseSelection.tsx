import { UseCaseCard } from "@/components/UseCaseCard";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { USE_CASES, type UseCaseTemplate } from "@shared/schema";

interface UseCaseSelectionProps {
  onSelectUseCase: (useCase: UseCaseTemplate) => void;
}

export default function UseCaseSelection({ onSelectUseCase }: UseCaseSelectionProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="flex items-center justify-between h-16 px-4 md:px-6 max-w-7xl mx-auto">
          <h1 className="text-lg md:text-xl font-semibold">Web3 Stack Builder</h1>
          <Button variant="ghost" size="sm" className="gap-2" data-testid="button-start-over">
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Start Over</span>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 md:py-16 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-12 md:mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Build Your Web3 Stack
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Select products for your use case and discover compatibility across
              your Web3 infrastructure using The Grid's relationship data
            </p>
          </div>

          {/* Use Case Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {USE_CASES.map((useCase) => (
              <UseCaseCard
                key={useCase.id}
                useCase={useCase}
                onSelect={() => onSelectUseCase(useCase)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4 md:px-6 mt-12">
        <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
          <p>Powered by The Grid's product relationship data</p>
        </div>
      </footer>
    </div>
  );
}
