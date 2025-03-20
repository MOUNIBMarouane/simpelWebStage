import { motion } from "framer-motion";

const ProgressBar = ({ steps, currentStep }) => {
  return (
    <div className="w-full flex items-center justify-between relative mb-6">
      {/* Progress Line */}
      <motion.div
        className="absolute h-1 bg-slate-700/50 top-1/2 left-0 right-0 -translate-y-1/2"
        style={{ zIndex: 0 }}
      >
        <motion.div
          className="h-1 bg-blue-500"
          initial={{ width: "0%" }}
          animate={{
            width: `${((currentStep - 1) / (steps - 1)) * 100}%`,
          }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Step Circles */}
      {Array.from({ length: steps }, (_, i) => (
        <div key={i} className="relative z-10 flex flex-col items-center">
          <motion.div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
              i + 1 <= currentStep
                ? "bg-blue-500 text-white"
                : "bg-slate-700/50 text-gray-400"
            }`}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {i + 1}
          </motion.div>
          {i + 1 === currentStep && (
            <motion.div
              className="absolute -bottom-6 text-sm text-blue-500 font-medium"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            ></motion.div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProgressBar;
