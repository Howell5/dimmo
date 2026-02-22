import { motion, AnimatePresence } from "framer-motion";
import { Sparkle, LightbulbFilament, Camera, Palette, Lightning } from "@phosphor-icons/react";
import type { Scene, WorkflowStep } from "../../types";

interface RightPanelProps {
  selectedScene: Scene | null;
  currentStep: WorkflowStep;
}

interface Suggestion { icon: React.ReactNode; title: string; description: string; }

const SHOT_ZH: Record<string, string> = {
  wide: "远景", medium: "中景", closeup: "特写",
  aerial: "航拍", macro: "微距", panning: "摇镜", tracking: "跟踪",
};

function getSuggestions(step: WorkflowStep, scene: Scene | null): Suggestion[] {
  if (!scene) return [];
  const base: Record<WorkflowStep, Suggestion[]> = {
    script: [
      { icon: <LightbulbFilament size={16} className="text-gold" />, title: "增强叙事", description: "添加一段黑死病与现代疫情的类比，拉近观众共鸣。" },
      { icon: <Sparkle size={16} className="text-gold" />, title: "过渡衔接", description: "用一个反问句将本场景与下一场景自然串联。" },
    ],
    visual: [
      { icon: <Camera size={16} className="text-gold" />, title: "推荐镜头", description: `尝试${SHOT_ZH[scene.shotType]}镜头配合缓慢推进运镜。` },
      { icon: <Palette size={16} className="text-gold" />, title: "色彩方案", description: "暗褐色与暖黄色调为主，营造中世纪质感。" },
    ],
    consistency: [
      { icon: <Lightning size={16} className="text-gold" />, title: "风格冲突", description: "本场景光照与场景一的既定色调有偏差，建议调整。" },
      { icon: <Palette size={16} className="text-gold" />, title: "锚点建议", description: "复用场景一的中世纪街道背景以保持连贯性。" },
    ],
    timeline: [
      { icon: <Lightning size={16} className="text-gold" />, title: "节奏提示", description: "此场景节奏偏快，建议延长 2 秒以增强沉浸感。" },
      { icon: <Sparkle size={16} className="text-gold" />, title: "音画同步", description: "将 14.2 秒处的音乐重拍与画面转场对齐。" },
    ],
    multimodal: [
      { icon: <Sparkle size={16} className="text-gold" />, title: "配音匹配", description: "「沉稳」音色最适合历史纪录片风格的旁白。" },
      { icon: <LightbulbFilament size={16} className="text-gold" />, title: "音效机会", description: "在场景转换处添加教堂丧钟音效增强氛围。" },
    ],
  };
  return base[step] ?? [];
}

export function RightPanel({ selectedScene, currentStep }: RightPanelProps) {
  const suggestions = getSuggestions(currentStep, selectedScene);
  return (
    <aside className="w-64 bg-panel border-l border-edge flex flex-col flex-shrink-0">
      <div className="p-3 border-b border-edge">
        <div className="flex items-center gap-2">
          <Sparkle size={14} className="text-gold" weight="fill" />
          <h2 className="text-xs font-heading font-semibold text-txt-2 uppercase tracking-wider">AI 建议</h2>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-3">
        <AnimatePresence mode="wait">
          {selectedScene ? (
            <motion.div
              key={`${currentStep}-${selectedScene.id}`}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.25 }}
              className="space-y-3"
            >
              <div className="p-2.5 rounded-lg bg-inset border border-edge">
                <p className="text-[10px] text-txt-3 font-mono mb-1">场景 {String(selectedScene.order).padStart(2, "0")}</p>
                <p className="text-sm font-heading font-medium text-txt">{selectedScene.title}</p>
              </div>
              <div>
                <p className="text-[10px] text-txt-3 font-mono mb-1.5">关键词</p>
                <div className="flex flex-wrap gap-1">
                  {selectedScene.visualKeywords.map((kw) => (
                    <span key={kw} className="px-2 py-0.5 rounded-full bg-inset border border-edge text-[10px] text-txt-2">{kw}</span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[10px] text-txt-3 font-mono mb-1.5">建议</p>
                <div className="space-y-2">
                  {suggestions.map((s, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="p-2.5 rounded-lg bg-inset border border-edge hover:border-gold/20 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {s.icon}
                        <span className="text-xs font-medium text-txt group-hover:text-gold transition-colors">{s.title}</span>
                      </div>
                      <p className="text-[11px] text-txt-2 leading-relaxed">{s.description}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-full text-center py-12">
              <Sparkle size={32} className="text-txt-3 mb-3" />
              <p className="text-xs text-txt-3">选择一个场景查看 AI 建议</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </aside>
  );
}
