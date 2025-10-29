import { useRef, useEffect } from "react";
import html2canvas from "html2canvas";
import { ProgressHeader } from "@/components/ProgressHeader";
import { CompatibilityGraph } from "@/components/CompatibilityGraph";
import { StackSummary } from "@/components/StackSummary";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Download, ExternalLink, AlertCircle } from "lucide-react";
import { useStackStore } from "@/lib/stackStore";

interface CompatibilityResultsProps {
  onBack: () => void;
  onReset: () => void;
}

export default function CompatibilityResults({ onBack, onReset }: CompatibilityResultsProps) {
  const { useCase, selectedProducts, compatibility, removeProduct, calculateCompatibility } = useStackStore();
  const { toast } = useToast();
  const exportRef = useRef<HTMLDivElement>(null);

  const productsArray = Array.from(selectedProducts.values());

  // Calculate compatibility on mount
  useEffect(() => {
    calculateCompatibility();
  }, [calculateCompatibility]);

  if (!useCase || productsArray.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground" />
          <p className="text-muted-foreground">No products in stack</p>
          <Button onClick={onBack}>Go Back</Button>
        </div>
      </div>
    );
  }

  const handleExportPNG = async () => {
    if (!exportRef.current) return;

    try {
      toast({
        title: "Generating image...",
        description: "Please wait while we create your stack visualization",
      });

      const canvas = await html2canvas(exportRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
      });

      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `web3-stack-${useCase.id}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();

      toast({
        title: "Success!",
        description: "Your stack has been exported as PNG",
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export failed",
        description: "There was an error exporting your stack",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <ProgressHeader
        currentStep={useCase.categories.length}
        totalSteps={useCase.categories.length}
        onBack={onBack}
        onReset={onReset}
        title={`${useCase.name} - Results`}
      />

      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        {/* Header Section */}
        <div className="text-center space-y-4 py-8">
          <h2 className="text-3xl md:text-4xl font-bold">
            Your {useCase.name} is Ready
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Here's how your selected products work together
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr,320px] gap-6">
          {/* Main Content - Compatibility Visualization */}
          <div ref={exportRef} className="space-y-6">
            <CompatibilityGraph
              products={productsArray}
              compatibility={compatibility}
            />
          </div>

          {/* Sidebar - Stack Summary & Actions */}
          <aside className="space-y-6">
            <StackSummary
              products={selectedProducts}
              onRemove={removeProduct}
              onExport={handleExportPNG}
              showExport={true}
            />

            {/* Claim Profile CTA */}
            <Card className="p-6 space-y-4 border-primary/50 bg-primary/5">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Claim Your Profile</h3>
                <p className="text-sm text-muted-foreground">
                  Are you building one of these products? Claim your profile on The Grid.
                </p>
              </div>
              <Button 
                className="w-full gap-2"
                size="lg"
                data-testid="button-claim-profile"
                onClick={() => {
                  window.open('https://thegrid.id', '_blank');
                }}
              >
                <ExternalLink className="w-4 h-4" />
                Claim Profile on The Grid
              </Button>
            </Card>

            {/* Actions */}
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={onBack}
                data-testid="button-modify-stack"
              >
                Modify Stack
              </Button>
              <Button
                variant="ghost"
                className="w-full"
                onClick={onReset}
                data-testid="button-build-new"
              >
                Build New Stack
              </Button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
