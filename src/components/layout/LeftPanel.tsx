import { motion } from "framer-motion";
import { Plus, MagnifyingGlass } from "@phosphor-icons/react";
import type { Scene } from "../../types";
import { SceneCard } from "../shared/SceneCard";
import { GlowButton } from "../shared/GlowButton";

interface LeftPanelProps {
  scenes: Scene[];
  selectedSceneId: string | null;
  onSelectScene: (id: string) => void;
}

export function LeftPanel({ scenes, selectedSceneId, onSelectScene }: LeftPanelProps) {
  return (
    <aside className="w-72 bg-panel border-r border-edge flex flex-col flex-shrink-0">
      <div className="p-3 border-b border-edge">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xs font-heading font-semibold text-txt-2 uppercase tracking-wider">
            场景列表
          </h2>
          <GlowButton variant="ghost" size="sm">
            <Plus size={14} />
          </GlowButton>
        </div>
        <div className="relative">
          <MagnifyingGlass size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-txt-3" />
          <input
            type="text"
            placeholder="搜索场景..."
            className="w-full bg-inset border border-edge rounded-lg pl-8 pr-3 py-1.5 text-xs text-txt placeholder:text-txt-3 outline-none focus:border-gold/30 transition-colors"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
        {scenes.map((scene, i) => (
          <SceneCard
            key={scene.id}
            scene={scene}
            isSelected={scene.id === selectedSceneId}
            onSelect={() => onSelectScene(scene.id)}
            index={i}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="p-3 border-t border-edge"
      >
        <div className="flex items-center justify-between text-[10px] text-txt-3 font-mono">
          <span>{scenes.length} 个场景</span>
          <span>共 {scenes.reduce((sum, s) => sum + s.duration, 0)} 秒</span>
        </div>
      </motion.div>
    </aside>
  );
}
