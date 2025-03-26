import { useState } from "react";
import { Save } from "lucide-react";

const MultiStepForm = () => {
  const [step, setStep] = useState(1); // Track current step
  const [formData, setFormData] = useState({
    typeKey: "",
    typeName: "",
    typeAttr: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleNext = () => {
    if (step < 3) setStep((prev) => prev + 1); // Move to next step
  };

  const handleBack = () => {
    if (step > 1) setStep((prev) => prev - 1); // Move to previous step
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      console.log("Form Data Submitted:", formData);
      setLoading(false);
    }, 2000);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-6">
      {/* Step Progress Indicator */}
      <StepProgress steps={3} currentStep={step} />

      {/* Step 1: Type Key */}
      {step === 1 && (
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">
            Type Key
          </label>
          <input
            id="typeKey"
            value={formData.typeKey}
            onChange={handleChange}
            className="w-full px-4 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      {/* Step 2: Type Name */}
      {step === 2 && (
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">
            Type Name *
          </label>
          <input
            id="typeName"
            value={formData.typeName}
            onChange={handleChange}
            className="w-full px-4 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      )}

      {/* Step 3: Type Attribute */}
      {step === 3 && (
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">
            Type Attribute
          </label>
          <input
            id="typeAttr"
            value={formData.typeAttr}
            onChange={handleChange}
            className="w-full px-4 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      {/* Navigation divs */}
      <div className="flex justify-between">
        {step > 1 && (
          <div
            type="div"
            onClick={handleBack}
            className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition-all"
          >
            Back
          </div>
        )}
        {step < 3 ? (
          <div
            type="div"
            onClick={handleNext}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-all"
          >
            Next
          </div>
        ) : (
          <div
            type="submit"
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
            disabled={loading}
          >
            <Save size={20} />
            {loading ? "Saving..." : "Save Document Type"}
          </div>
        )}
      </div>
    </form>
  );
};

export default MultiStepForm;
