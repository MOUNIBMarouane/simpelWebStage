import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSubTypeForm } from "./SubTypeFormProvider";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Info,
  PencilLine,
  Lightbulb,
  Copy,
  FileEdit,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export const SubTypeBasicInfo = () => {
  const {
    formData,
    updateForm,
    errors: formErrors,
    setErrors,
  } = useSubTypeForm();
  const [showSuggestions, setShowSuggestions] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: formData.name || "",
      description: formData.description || "",
    },
    mode: "onChange", // Validate on change for immediate feedback
  });

  const handleChange = (field: keyof FormValues, value: string) => {
    form.setValue(field, value);
    updateForm({ [field]: value });

    // Validate name field
    if (field === "name") {
      validateName(value);
    }
  };

  const nameValue = form.watch("name");

  // Validate name function
  const validateName = (value: string) => {
    const errors: Record<string, string> = { ...formErrors };

    if (!value || value.trim().length === 0) {
      errors.name = "Name is required";
    } else if (value.length < 2) {
      errors.name = "Name must be at least 2 characters";
    } else {
      delete errors.name;
    }

    setErrors(errors);
  };

  // Validate on mount and when name changes
  useEffect(() => {
    if (nameValue !== undefined) {
      validateName(nameValue);
    }
  }, [nameValue]);

  // Generate code suggestions based on dates
  const generateCodeSuggestions = () => {
    const suggestions = [];
    const currentDate = new Date();
    const startDate = formData.startDate
      ? new Date(formData.startDate)
      : currentDate;

    // Get year and month
    const year = startDate.getFullYear().toString().slice(-2);
    const month = (startDate.getMonth() + 1).toString().padStart(2, "0");

    // Generate suggestions
    suggestions.push(`STR-${year}${month}`); // STR-YYMM
    suggestions.push(`STN-${year}-${month}`); // STN-YY-MM
    suggestions.push(`TYN-${year}`); // TYN-YY

    return suggestions;
  };

  const suggestions = generateCodeSuggestions();

  const applySuggestion = (suggestion: string) => {
    handleChange("name", suggestion);
    setShowSuggestions(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <FileEdit className="h-5 w-5 text-blue-400" />
          <h3 className="text-blue-200 text-base font-medium">
            Subtype Information
          </h3>
        </div>

        <Form {...form}>
          <form className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-blue-300 text-sm flex items-center">
                      Name <span className="text-red-400 ml-0.5">*</span>
                    </FormLabel>
                    <Badge
                      variant="outline"
                      className="text-[10px] px-1 py-0 h-4 bg-blue-900/30 text-blue-300 border-blue-900/50"
                    >
                      Required
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative group flex-1">
                      <FormControl>
                        <Input
                          placeholder="Enter subtype name"
                          {...field}
                          onChange={(e) => handleChange("name", e.target.value)}
                          className={`h-9 pl-9 bg-blue-950/40 border-blue-900/50 focus:border-blue-400 focus:ring-1 focus:ring-blue-400/30 text-white rounded-md text-sm ${
                            formErrors.name ? "border-red-500" : ""
                          }`}
                        />
                      </FormControl>
                      <FileText className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-400 pointer-events-none" />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowSuggestions(!showSuggestions)}
                      className="h-9 px-2 bg-blue-900/30 border-blue-900/40 hover:bg-blue-800/40 text-blue-300"
                      title="Show name suggestions"
                    >
                      <Lightbulb className="h-4 w-4" />
                    </Button>
                  </div>

                  <AnimatePresence>
                    {showSuggestions && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-blue-900/30 rounded-md p-2 border border-blue-900/40 mt-2"
                      >
                        <div className="text-xs text-blue-300 mb-2 flex items-center">
                          <Lightbulb className="h-3.5 w-3.5 mr-1.5 text-amber-400/80" />
                          <span>Suggested names based on selected dates:</span>
                        </div>
                        <div className="space-y-2">
                          {suggestions.map((suggestion, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between bg-blue-900/40 p-2 rounded-md hover:bg-blue-800/40 transition-colors cursor-pointer"
                              onClick={() => applySuggestion(suggestion)}
                            >
                              <span className="text-sm text-white font-medium">
                                {suggestion}
                              </span>
                              <div className="flex items-center text-blue-400 text-xs">
                                <Copy className="h-3 w-3 mr-1" />
                                Apply
                              </div>
                            </div>
                          ))}
                        </div>
                        <p className="text-[10px] text-blue-400/70 mt-2">
                          Choose a name that is meaningful and relates to your
                          document subtype's purpose and date range.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {formErrors.name && (
                    <p className="text-red-400 text-xs flex items-center mt-1">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {formErrors.name}
                    </p>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-blue-300 text-sm">
                      Description
                    </FormLabel>
                    <Badge
                      variant="outline"
                      className="text-[10px] px-1 py-0 h-4 bg-blue-900/30 text-blue-300/70 border-blue-900/50"
                    >
                      Optional
                    </Badge>
                  </div>
                  <FormControl>
                    <Textarea
                      placeholder="Enter a description for this subtype"
                      {...field}
                      onChange={(e) =>
                        handleChange("description", e.target.value)
                      }
                      className="min-h-[80px] bg-blue-950/40 border-blue-900/50 focus:border-blue-400 focus:ring-1 focus:ring-blue-400/30 text-white rounded-md text-sm resize-none"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {formErrors.name && (
              <div className="bg-red-900/20 border border-red-900/30 rounded-md p-3 flex items-center gap-3">
                <div className="text-red-400">
                  <AlertCircle className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-red-200">
                    Please provide a valid name before continuing
                  </p>
                </div>
              </div>
            )}

            <div className="bg-blue-950/40 border border-blue-900/30 rounded-md p-3 flex items-center gap-3">
              <div className="text-blue-400">
                <Info className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-blue-200">
                  Enter a meaningful name and description for this subtype. The
                  name should be unique and easily identifiable.
                </p>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </motion.div>
  );
};
