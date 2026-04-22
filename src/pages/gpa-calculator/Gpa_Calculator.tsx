import { useAcademicStatus } from "@/store/useAcademicStatus";
import { CustomCreditPlanner } from "@/pages/gpa-calculator/components/CustomCreditPlanner";
import { GpaResultsTable } from "./components/Gpa_ResultsTable";
import { GpaInput } from "./components/GpaInputs";

export const GpaCalculator = () => {
  const { currentGpa, accumulatedCredits, requiredCredits } = useAcademicStatus();

  const isDataValid = currentGpa && accumulatedCredits && requiredCredits && requiredCredits > accumulatedCredits;

  return (
    <div className="space-y-6">
      <GpaInput />
      <GpaResultsTable />

      {isDataValid && <CustomCreditPlanner />}
    </div>
  );
};
