import { DocumentType } from "@/models/document";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { SubTypeFormProvider } from "./components/SubTypeFormProvider";
import { MultiStepSubTypeForm } from "./components/MultiStepSubTypeForm";

interface SubTypeCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
  documentTypes: DocumentType[];
}

export const SubTypeCreateDialog = ({
  open,
  onOpenChange,
  onSubmit,
  documentTypes,
}: SubTypeCreateDialogProps) => {
  const handleClose = () => {
    onOpenChange(false);
  };

  // Get the first document type from the array if available
  const documentType =
    documentTypes && documentTypes.length > 0 ? documentTypes[0] : undefined;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-[#1a2251] border-blue-900/50 text-white sm:max-w-[500px] max-h-[95vh] p-0 overflow-hidden">
        <div className="flex flex-col h-full">
          <DialogHeader className="pb-2 border-b border-blue-900/30 p-4 flex-shrink-0">
            <DialogTitle className="text-lg text-white">
              Create New Subtype
            </DialogTitle>
            <DialogDescription className="text-blue-300 text-sm">
              Complete each step to create a new document subtype
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto">
            <SubTypeFormProvider
              onSubmit={onSubmit}
              documentType={documentType}
              onClose={handleClose}
            >
              <MultiStepSubTypeForm onCancel={handleClose} />
            </SubTypeFormProvider>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
