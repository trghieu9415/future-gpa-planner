import { LetterSystem, PlusSystem } from "@/consts/GradingScale";
import { GradingSystem } from "@/pages/gpa-calculator/types/grade";
import { useAcademicStatus } from "@/store/useAcademicStatus";
import { useState, useEffect } from "react";

export type SystemType = "letter" | "plus" | "custom";

export function useGradingStorage() {
  const [selectedType, setSelectedType] = useState<SystemType>("letter");
  const [customSystem, setCustomSystem] = useState<GradingSystem>(LetterSystem);

  const { setGradingSystem } = useAcademicStatus();

  useEffect(() => {
    const savedCustom = localStorage.getItem("grading_custom");
    if (savedCustom) setCustomSystem(JSON.parse(savedCustom));
  }, []);

  const saveType = (type: SystemType) => {
    setSelectedType(type);
    if (type === "letter") {
      setGradingSystem(LetterSystem);
    } else if (type === "plus") {
      setGradingSystem(PlusSystem);
    } else {
      if (customSystem.grades.length == 0) {
        saveCustomSystem(LetterSystem);
        setGradingSystem(LetterSystem);
      } else {
        setGradingSystem(customSystem);
      }
    }
  };

  const saveCustomSystem = (system: GradingSystem) => {
    setCustomSystem(system);
    localStorage.setItem("grading_custom", JSON.stringify(system));
  };

  return { selectedType, saveType, customSystem, saveCustomSystem };
}
