import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSubTypeForm } from "./SubTypeFormProvider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SubTypeFormActionsProps {
  onCancel: () => void;
}

export const SubTypeFormActions = ({ onCancel }: SubTypeFormActionsProps) => {
  const {
    currentStep,
    nextStep,
    prevStep,
    submitForm,
    totalSteps,
    isSubmitting,
    hasErrors,
    errors,
  } = useSubTypeForm();

  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;
  const hasFormErrors = hasErrors();

  // Get error message for current step
  const getErrorMessage = () => {
    if (currentStep === 1) {
      if (errors.startDate) return errors.startDate;
      if (errors.endDate) return errors.endDate;
      return "Please fix date errors before continuing";
    } else if (currentStep === 2) {
      if (errors.name) return errors.name;
      return "Please fix form errors before continuing";
    }
    return "Please fix all errors before submitting";
  };

  return (
    <div className="flex justify-between gap-3">
      <Button
        type="button"
        variant="outline"
        onClick={isFirstStep ? onCancel : prevStep}
        className="flex-1 h-10 bg-transparent border-blue-800 hover:bg-blue-900/40 text-blue-300 text-sm font-medium"
      >
        Back
      </Button>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              disabled={hasFormErrors || isSubmitting}
              onClick={isLastStep ? submitForm : nextStep}
              className={`flex-1 h-10 text-white text-sm font-medium ${
                hasFormErrors
                  ? "bg-blue-600/50 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-500"
              }`}
            >
              {isSubmitting ? (
                <span className="animate-pulse">Creating...</span>
              ) : isLastStep ? (
                "Create"
              ) : (
                <span className="flex items-center justify-center">
                  Continue
                  <ChevronRight className="ml-1 h-4 w-4" />
                </span>
              )}
            </Button>
          </TooltipTrigger>
          {hasFormErrors && (
            <TooltipContent
              side="top"
              className="bg-red-900/90 border-red-800 text-white"
            >
              <p>{getErrorMessage()}</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
