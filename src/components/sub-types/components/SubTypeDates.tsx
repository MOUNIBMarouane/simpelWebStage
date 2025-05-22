import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSubTypeForm } from "./SubTypeFormProvider";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  CalendarClock,
  CalendarDays,
  Info,
  Power,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import React, { useRef, useEffect } from "react";

const formSchema = z.object({
  startDate: z.union([z.string().min(1, "Start date is required"), z.date()]),
  endDate: z.union([z.string().min(1, "End date is required"), z.date()]),
  isActive: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

// Add a style block to hide the calendar icon in date inputs
const dateInputStyles = `
  /* Hide the native calendar icon in Webkit browsers */
  input[type="date"]::-webkit-calendar-picker-indicator {
    display: none;
    -webkit-appearance: none;
  }
  
  /* For Firefox */
  input[type="date"]::-moz-calendar-picker-indicator {
    display: none;
  }
  
  /* For Edge */
  input[type="date"]::-ms-clear {
    display: none;
  }
`;

export const SubTypeDates = () => {
  const {
    formData,
    updateForm,
    errors: formErrors,
    setErrors,
  } = useSubTypeForm();
  const startDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);

  // Set default dates if not provided
  const today = new Date();
  const nextYear = new Date();
  nextYear.setFullYear(today.getFullYear() + 1);

  const defaultStartDate = today.toISOString().split("T")[0];
  const defaultEndDate = nextYear.toISOString().split("T")[0];

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      startDate: formData.startDate || defaultStartDate,
      endDate: formData.endDate || defaultEndDate,
      isActive: formData.isActive ?? true,
    },
    mode: "onChange", // Validate on change for immediate feedback
  });

  // Convert dates to strings if needed
  const getDateString = (dateValue: Date | string | undefined): string => {
    if (!dateValue) return "";
    if (dateValue instanceof Date) {
      return dateValue.toISOString().split("T")[0];
    }
    return dateValue;
  };

  const handleChange = (field: keyof FormValues, value: any) => {
    form.setValue(field, value);
    updateForm({ [field]: value });

    // Trigger validation after value change
    validateDates();
  };

  const startDateValue = form.watch("startDate") || defaultStartDate;
  const endDateValue = form.watch("endDate") || defaultEndDate;
  const isActiveValue = form.watch("isActive");

  // Function to open the native date picker
  const openDatePicker = (ref: React.RefObject<HTMLInputElement>) => {
    if (ref.current) {
      ref.current.showPicker();
    }
  };

  // Validate dates function
  const validateDates = () => {
    const errors: Record<string, string> = {};

    // Check if dates are valid
    if (!startDateValue) {
      errors.startDate = "Start date is required";
    }

    if (!endDateValue) {
      errors.endDate = "End date is required";
    }

    // Check if end date is after start date
    if (startDateValue && endDateValue) {
      const start = new Date(startDateValue);
      const end = new Date(endDateValue);

      if (end <= start) {
        errors.endDate = "End date must be after start date";
      }
    }

    // Update form errors
    setErrors(errors);

    return Object.keys(errors).length === 0;
  };

  // Validate on mount and when dates change
  useEffect(() => {
    validateDates();
  }, [startDateValue, endDateValue]);

  // Calculate duration between dates
  const calculateDuration = () => {
    if (!startDateValue || !endDateValue) return null;

    const start = new Date(startDateValue);
    const end = new Date(endDateValue);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;

    // Check if end date is before start date
    if (end < start)
      return { valid: false, message: "End date must be after start date" };

    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Calculate months and years
    let months = (end.getFullYear() - start.getFullYear()) * 12;
    months += end.getMonth() - start.getMonth();

    // Handle edge case where day of month affects month calculation
    if (end.getDate() < start.getDate()) {
      months--;
    }

    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;

    let durationText = "";
    if (years > 0) {
      durationText += `${years} year${years > 1 ? "s" : ""}`;
      if (remainingMonths > 0)
        durationText += ` ${remainingMonths} month${
          remainingMonths > 1 ? "s" : ""
        }`;
    } else if (months > 0) {
      durationText += `${months} month${months > 1 ? "s" : ""}`;
    } else {
      durationText += `${diffDays} day${diffDays > 1 ? "s" : ""}`;
    }

    return { valid: true, days: diffDays, text: durationText };
  };

  const duration = calculateDuration();
  const hasDateErrors = !!(formErrors.startDate || formErrors.endDate);

  // Ensure form data has default dates set
  React.useEffect(() => {
    // If dates are not set in formData, set the defaults
    if (!formData.startDate) {
      updateForm({ startDate: defaultStartDate });
    }
    if (!formData.endDate) {
      updateForm({ endDate: defaultEndDate });
    }
  }, []);

  // Format date for display
  const formatDisplayDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Add style tag to hide native calendar icon */}
      <style>{dateInputStyles}</style>

      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <CalendarClock className="h-5 w-5 text-blue-400" />
          <h3 className="text-blue-200 text-base font-medium">
            Date Range and Status
          </h3>
        </div>

        <Form {...form}>
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <FormLabel className="text-blue-300 text-sm flex items-center">
                        Start Date{" "}
                        <span className="text-red-400 ml-0.5">*</span>
                      </FormLabel>
                      <Badge
                        variant="outline"
                        className="text-[10px] px-1 py-0 h-4 bg-blue-900/30 text-blue-300 border-blue-900/50"
                      >
                        Required
                      </Badge>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <div
                          className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-400 z-10 cursor-pointer"
                          onClick={() => openDatePicker(startDateRef)}
                        >
                          <CalendarDays className="h-4 w-4" />
                        </div>
                        <Input
                          ref={startDateRef}
                          type="date"
                          {...field}
                          value={getDateString(field.value) || defaultStartDate}
                          onChange={(e) => {
                            handleChange("startDate", e.target.value);
                          }}
                          className={`h-9 pl-9 bg-blue-950/40 border-blue-900/50 focus:border-blue-400 focus:ring-1 focus:ring-blue-400/30 text-white rounded-md text-sm appearance-none ${
                            formErrors.startDate ? "border-red-500" : ""
                          }`}
                          onClick={(e) => e.currentTarget.showPicker()}
                        />
                      </div>
                    </FormControl>
                    {formErrors.startDate && (
                      <p className="text-red-400 text-xs flex items-center mt-1">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {formErrors.startDate}
                      </p>
                    )}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <FormLabel className="text-blue-300 text-sm flex items-center">
                        End Date <span className="text-red-400 ml-0.5">*</span>
                      </FormLabel>
                      <Badge
                        variant="outline"
                        className="text-[10px] px-1 py-0 h-4 bg-blue-900/30 text-blue-300 border-blue-900/50"
                      >
                        Required
                      </Badge>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <div
                          className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-400 z-10 cursor-pointer"
                          onClick={() => openDatePicker(endDateRef)}
                        >
                          <CalendarDays className="h-4 w-4" />
                        </div>
                        <Input
                          ref={endDateRef}
                          type="date"
                          {...field}
                          value={getDateString(field.value) || defaultEndDate}
                          onChange={(e) => {
                            handleChange("endDate", e.target.value);
                          }}
                          className={`h-9 pl-9 bg-blue-950/40 border-blue-900/50 focus:border-blue-400 focus:ring-1 focus:ring-blue-400/30 text-white rounded-md text-sm appearance-none ${
                            formErrors.endDate ? "border-red-500" : ""
                          }`}
                          onClick={(e) => e.currentTarget.showPicker()}
                        />
                      </div>
                    </FormControl>
                    {formErrors.endDate && (
                      <p className="text-red-400 text-xs flex items-center mt-1">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {formErrors.endDate}
                      </p>
                    )}
                  </FormItem>
                )}
              />
            </div>

            {duration && duration.valid !== false && (
              <div className="bg-blue-950/40 border border-blue-900/30 rounded-md p-3 flex items-center gap-3">
                <div className="text-blue-400">
                  <CalendarClock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-blue-200">
                    Duration:{" "}
                    <span className="text-blue-300">{duration.text}</span>
                  </p>
                </div>
              </div>
            )}

            {hasDateErrors && (
              <div className="bg-red-900/20 border border-red-900/30 rounded-md p-3 flex items-center gap-3">
                <div className="text-red-400">
                  <AlertCircle className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-red-200">
                    Please fix the date errors before continuing
                  </p>
                </div>
              </div>
            )}

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <div className="flex items-center justify-between bg-blue-950/40 border border-blue-900/30 rounded-md p-3">
                    <div className="flex items-center gap-3">
                      <div className="text-blue-400">
                        <Power className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm text-blue-200 font-medium">
                          Status
                        </p>
                      </div>
                    </div>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-blue-300">
                          {isActiveValue ? "Active" : "Inactive"}
                        </span>
                        <Switch
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            handleChange("isActive", checked);
                          }}
                          className="data-[state=checked]:bg-blue-600"
                        />
                      </div>
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
    </motion.div>
  );
};
