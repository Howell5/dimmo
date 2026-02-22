import { AnimatePresence, motion } from "framer-motion";
import { TopBar } from "./components/layout/TopBar";
import { LeftPanel } from "./components/layout/LeftPanel";
import { RightPanel } from "./components/layout/RightPanel";
import { BottomTimeline } from "./components/layout/BottomTimeline";
import { ScriptEngine } from "./components/workflow/ScriptEngine";
import { VisualMatching } from "./components/workflow/VisualMatching";
import { ConsistencySystem } from "./components/workflow/ConsistencySystem";
import { TimelineEditor } from "./components/workflow/TimelineEditor";
import { MultimodalIntegration } from "./components/workflow/MultimodalIntegration";
import { useWorkflow } from "./hooks/useWorkflow";
import type { WorkflowStep } from "./types";

function WorkflowContent({
  step,
  scenes,
  selectedSceneId,
  onSelectScene,
}: {
  step: WorkflowStep;
  scenes: ReturnType<typeof useWorkflow>["scenes"];
  selectedSceneId: string | null;
  onSelectScene: (id: string) => void;
}) {
  switch (step) {
    case "script":
      return (
        <ScriptEngine
          scenes={scenes}
          selectedSceneId={selectedSceneId}
          onSelectScene={onSelectScene}
        />
      );
    case "visual":
      return (
        <VisualMatching
          scenes={scenes}
          selectedSceneId={selectedSceneId}
          onSelectScene={onSelectScene}
        />
      );
    case "consistency":
      return <ConsistencySystem />;
    case "timeline":
      return <TimelineEditor />;
    case "multimodal":
      return <MultimodalIntegration />;
  }
}

export default function App() {
  const workflow = useWorkflow();

  return (
    <div className="h-full flex flex-col film-grain">
      {/* Top bar */}
      <TopBar
        currentStep={workflow.currentStep}
        currentStepIndex={workflow.currentStepIndex}
        onStepChange={workflow.goToStep}
      />

      {/* Main content area */}
      <div className="flex-1 flex min-h-0">
        {/* Left sidebar */}
        <LeftPanel
          scenes={workflow.scenes}
          selectedSceneId={workflow.selectedSceneId}
          onSelectScene={workflow.setSelectedSceneId}
        />

        {/* Center content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={workflow.currentStep}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="flex-1 flex min-w-0"
          >
            <WorkflowContent
              step={workflow.currentStep}
              scenes={workflow.scenes}
              selectedSceneId={workflow.selectedSceneId}
              onSelectScene={workflow.setSelectedSceneId}
            />
          </motion.div>
        </AnimatePresence>

        {/* Right sidebar */}
        <RightPanel
          selectedScene={workflow.selectedScene}
          currentStep={workflow.currentStep}
        />
      </div>

      {/* Bottom timeline */}
      <BottomTimeline
        scenes={workflow.scenes}
        playheadTime={workflow.playheadTime}
        totalDuration={workflow.totalDuration}
        onPlayheadChange={workflow.setPlayheadTime}
      />
    </div>
  );
}
