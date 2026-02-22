import { motion } from "framer-motion";
import { FilmReel, Export, CaretRight, Play } from "@phosphor-icons/react";
import type { WorkflowStep } from "../../types";
import { WORKFLOW_STEPS } from "../../data/mockData";
import { GlowButton } from "../shared/GlowButton";

interface TopBarProps {
  currentStep: WorkflowStep;
  currentStepIndex: number;
  onStepChange: (step: WorkflowStep) => void;
}

export function TopBar({ currentStep, currentStepIndex, onStepChange }: TopBarProps) {
  return (
    <header className="h-14 bg-panel border-b border-edge flex items-center px-4 gap-4 flex-shrink-0">
      <div className="flex items-center gap-2.5 mr-4">
        <div className="w-8 h-8 rounded-lg bg-gold/15 border border-gold/30 flex items-center justify-center">
          <FilmReel size={18} className="text-gold" weight="fill" />
        </div>
        <div>
          <h1 className="text-sm font-heading font-semibold text-txt leading-none">
            AI Director
          </h1>
          <p className="text-[10px] text-txt-3 font-mono mt-0.5">
            鼠疫的历史 v1.0
          </p>
        </div>
      </div>

      <div className="w-px h-7 bg-edge" />

      <nav className="flex items-center gap-1 flex-1 justify-center">
        {WORKFLOW_STEPS.map((step, i) => {
          const isActive = step.id === currentStep;
          const isPast = i < currentStepIndex;
          return (
            <div key={step.id} className="flex items-center">
              <motion.button
                onClick={() => onStepChange(step.id)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`relative flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-gold/15 text-gold border border-gold/30"
                    : isPast
                      ? "text-txt-2 hover:text-txt hover:bg-raised"
                      : "text-txt-3 hover:text-txt-2 hover:bg-raised"
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono border ${
                    isActive
                      ? "bg-gold/20 border-gold/50 text-gold"
                      : isPast
                        ? "bg-raised border-edge-2 text-txt-2"
                        : "bg-inset border-edge text-txt-3"
                  }`}
                >
                  {isPast ? <Play size={8} weight="fill" /> : i + 1}
                </span>
                <span className="hidden lg:inline">{step.shortLabel}</span>
                {isActive && (
                  <motion.div
                    layoutId="step-active"
                    className="absolute inset-0 rounded-md border border-gold/30"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </motion.button>
              {i < WORKFLOW_STEPS.length - 1 && (
                <CaretRight size={12} className="mx-0.5 text-txt-3/50" />
              )}
            </div>
          );
        })}
      </nav>

      <div className="w-px h-7 bg-edge" />

      <div className="flex items-center gap-2 ml-2">
        <GlowButton variant="primary" size="sm">
          <Export size={14} />
          导出
        </GlowButton>
      </div>
    </header>
  );
}
