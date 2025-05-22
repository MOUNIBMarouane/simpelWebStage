import { useSubTypeForm } from "./SubTypeFormProvider";
import { Calendar, FileText, Info } from "lucide-react";

export const SubTypeFormProgress = () => {
  const { currentStep, totalSteps } = useSubTypeForm();

  const steps = [
    {
      number: 1,
      title: "Dates",
      description: "Set date range and status",
      icon: Calendar,
    },
    {
      number: 2,
      title: "Basic Info",
      description: "Enter subtype details",
      icon: Info,
    },
    {
      number: 3,
      title: "Review",
      description: "Review and submit",
      icon: FileText,
    },
  ];

  return (
    <div>
      <div className="text-center mb-2">
        <p className="text-xs text-blue-300">
          Step {currentStep} of {totalSteps}
        </p>
      </div>

      <div className="flex justify-center items-center mb-3">
        {steps.map((step, index) => {
          const StepIcon = step.icon;
          const isActive = currentStep === step.number;
          const isCompleted = currentStep > step.number;

          return (
            <div key={step.number} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isActive
                      ? "bg-blue-500 text-white"
                      : isCompleted
                      ? "bg-blue-600/60 text-white"
                      : "bg-blue-900/40 text-blue-400/70"
                  }`}
                >
                  <StepIcon className="h-4 w-4" />
                </div>
                <span
                  className={`text-xs mt-1 ${
                    isActive ? "text-blue-300" : "text-blue-400/70"
                  }`}
                >
                  {step.title}
                </span>
              </div>

              {index < steps.length - 1 && (
                <div className="mx-3 w-16 h-[1px] bg-blue-900/40">
                  <div
                    className="h-full bg-blue-500"
                    style={{
                      width: isCompleted ? "100%" : "0%",
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="bg-blue-950/40 border border-blue-900/30 rounded py-1.5 px-3 text-center">
        <span className="text-xs text-blue-300">
          {steps[currentStep - 1]?.description}
        </span>
      </div>
    </div>
  );
};
