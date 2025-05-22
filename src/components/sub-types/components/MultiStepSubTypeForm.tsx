import { useSubTypeForm } from "./SubTypeFormProvider";
import { SubTypeFormProgress } from "./SubTypeFormProgress";
import { SubTypeBasicInfo } from "./SubTypeBasicInfo";
import { SubTypeDates } from "../components/SubTypeDates";
import { SubTypeReview } from "../components/SubTypeReview";
import { SubTypeFormActions } from "./SubTypeFormActions";
import { AnimatePresence, motion } from "framer-motion";

interface MultiStepSubTypeFormProps {
  onCancel: () => void;
}

export const MultiStepSubTypeForm = ({
  onCancel,
}: MultiStepSubTypeFormProps) => {
  const { currentStep } = useSubTypeForm();

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <SubTypeDates />;
      case 2:
        return <SubTypeBasicInfo />;
      case 3:
        return <SubTypeReview />;
      default:
        return <SubTypeDates />;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 pt-4 pb-3 flex-shrink-0">
        <SubTypeFormProgress />
      </div>

      <div className="flex-1 px-6 py-2 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            {renderStepContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="px-6 py-4 border-t border-blue-900/30 flex-shrink-0">
        <SubTypeFormActions onCancel={onCancel} />
      </div>
    </div>
  );
};
