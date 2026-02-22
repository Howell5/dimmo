import { motion } from "framer-motion";
import {
  FilmStrip,
  Clock,
  Camera,
  DotsSixVertical,
} from "@phosphor-icons/react";
import type { Scene } from "../../types";

interface SceneCardProps {
  scene: Scene;
  isSelected: boolean;
  onSelect: () => void;
  index: number;
}

const SHOT_LABELS: Record<string, string> = {
  wide: "远景",
  medium: "中景",
  closeup: "特写",
  aerial: "航拍",
  macro: "微距",
  panning: "摇镜",
  tracking: "跟踪",
};

export function SceneCard({ scene, isSelected, onSelect, index }: SceneCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      onClick={onSelect}
      className={`group relative p-4 rounded-xl cursor-pointer transition-all duration-300 border ${
        isSelected
          ? "bg-gold/8 border-gold/30 shadow-[0_0_24px_#e8b4681f]"
          : "bg-inset border-edge hover:bg-raised hover:border-edge-2"
      }`}
    >
      <div className="absolute top-3 left-1.5 text-txt-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <DotsSixVertical size={16} />
      </div>

      <div className="flex gap-3 pl-3">
        <div
          className="w-20 h-14 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden"
          style={{ backgroundColor: scene.thumbnailColor }}
        >
          <FilmStrip size={24} className={isSelected ? "text-gold" : "text-white/30"} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono text-txt-3">
              {String(scene.order).padStart(2, "0")}
            </span>
            <h4 className={`text-sm font-heading font-medium truncate ${isSelected ? "text-gold" : "text-txt"}`}>
              {scene.title}
            </h4>
          </div>

          <p className="text-xs text-txt-2 line-clamp-2 leading-relaxed mb-2">
            {scene.narration}
          </p>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 text-[10px] text-txt-3">
              <Clock size={12} />
              {scene.duration}秒
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] text-txt-3">
              <Camera size={12} />
              {SHOT_LABELS[scene.shotType]}
            </span>
          </div>
        </div>
      </div>

      {isSelected && (
        <motion.div
          layoutId="scene-indicator"
          className="absolute left-0 top-3 bottom-3 w-0.5 bg-gold rounded-full"
        />
      )}
    </motion.div>
  );
}
