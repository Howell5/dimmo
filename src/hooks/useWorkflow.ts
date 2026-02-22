import { useState, useCallback } from "react";
import type { WorkflowStep, Scene } from "../types";
import { MOCK_SCENES, WORKFLOW_STEPS } from "../data/mockData";

export function useWorkflow() {
  const [currentStep, setCurrentStep] = useState<WorkflowStep>("script");
  const [scenes, setScenes] = useState<Scene[]>(MOCK_SCENES);
  const [selectedSceneId, setSelectedSceneId] = useState<string | null>(
    "scene-1"
  );
  const [playheadTime, setPlayheadTime] = useState(0);

  const currentStepIndex = WORKFLOW_STEPS.findIndex(
    (s) => s.id === currentStep
  );

  const goToStep = useCallback((step: WorkflowStep) => {
    setCurrentStep(step);
  }, []);

  const nextStep = useCallback(() => {
    const idx = WORKFLOW_STEPS.findIndex((s) => s.id === currentStep);
    if (idx < WORKFLOW_STEPS.length - 1) {
      setCurrentStep(WORKFLOW_STEPS[idx + 1].id);
    }
  }, [currentStep]);

  const prevStep = useCallback(() => {
    const idx = WORKFLOW_STEPS.findIndex((s) => s.id === currentStep);
    if (idx > 0) {
      setCurrentStep(WORKFLOW_STEPS[idx - 1].id);
    }
  }, [currentStep]);

  const selectedScene = scenes.find((s) => s.id === selectedSceneId) ?? null;

  const updateScene = useCallback((id: string, updates: Partial<Scene>) => {
    setScenes((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
  }, []);

  const totalDuration = scenes.reduce((sum, s) => sum + s.duration, 0);

  return {
    currentStep,
    currentStepIndex,
    scenes,
    selectedSceneId,
    selectedScene,
    playheadTime,
    totalDuration,
    goToStep,
    nextStep,
    prevStep,
    setSelectedSceneId,
    setPlayheadTime,
    updateScene,
  };
}
