import { motion } from "framer-motion";
import { Play, Pause, SkipBack, SkipForward } from "@phosphor-icons/react";
import { useState } from "react";
import type { Scene } from "../../types";

interface BottomTimelineProps {
  scenes: Scene[];
  playheadTime: number;
  totalDuration: number;
  onPlayheadChange: (time: number) => void;
}

export function BottomTimeline({ scenes, playheadTime, totalDuration, onPlayheadChange }: BottomTimelineProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const progressPercent = totalDuration > 0 ? (playheadTime / totalDuration) * 100 : 0;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="h-12 bg-panel border-t border-edge flex items-center px-4 gap-3 flex-shrink-0">
      <div className="flex items-center gap-1">
        <button onClick={() => onPlayheadChange(0)} className="p-1.5 rounded-md text-txt-3 hover:text-txt hover:bg-raised transition-colors cursor-pointer">
          <SkipBack size={14} />
        </button>
        <button onClick={() => setIsPlaying(!isPlaying)} className="p-1.5 rounded-md text-gold hover:bg-gold/10 transition-colors cursor-pointer">
          {isPlaying ? <Pause size={16} weight="fill" /> : <Play size={16} weight="fill" />}
        </button>
        <button onClick={() => onPlayheadChange(totalDuration)} className="p-1.5 rounded-md text-txt-3 hover:text-txt hover:bg-raised transition-colors cursor-pointer">
          <SkipForward size={14} />
        </button>
      </div>

      <span className="text-[11px] font-mono text-txt-2 min-w-[80px]">
        {formatTime(playheadTime)} / {formatTime(totalDuration)}
      </span>

      <div
        className="flex-1 h-6 relative cursor-pointer"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const pct = (e.clientX - rect.left) / rect.width;
          onPlayheadChange(Math.max(0, Math.min(totalDuration, pct * totalDuration)));
        }}
      >
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-2 bg-inset rounded-full overflow-hidden">
          <div className="relative h-full flex">
            {scenes.map((scene) => (
              <div
                key={scene.id}
                className="h-full border-r border-base/50 last:border-r-0"
                style={{ width: `${(scene.duration / totalDuration) * 100}%`, backgroundColor: scene.thumbnailColor, opacity: 0.6 }}
              />
            ))}
          </div>
          <motion.div className="absolute top-0 left-0 h-full bg-gold/30" style={{ width: `${progressPercent}%` }} />
        </div>
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-gold shadow-[0_0_8px_#e8b46880] -translate-x-1/2"
          style={{ left: `${progressPercent}%` }}
        />
      </div>

      <span className="text-[10px] font-mono text-txt-3">{scenes.length} 个场景</span>
    </div>
  );
}
