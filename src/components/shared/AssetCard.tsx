import { motion } from "framer-motion";
import { User, MapPin, Cube, Palette } from "@phosphor-icons/react";
import type { Asset, Shot } from "../../types";

interface AssetCardProps {
  asset: Asset;
  isSelected: boolean;
  onSelect: () => void;
  shots: Shot[];
  index: number;
}

const ASSET_TYPE_ICONS = {
  character: <User size={14} />,
  location: <MapPin size={14} />,
  prop: <Cube size={14} />,
  style: <Palette size={14} />,
};

const ASSET_TYPE_LABELS: Record<string, string> = {
  character: "角色",
  location: "场景",
  prop: "道具",
  style: "风格",
};

function MiniScoreRing({ score, size = 24 }: { score: number; size?: number }) {
  const radius = (size - 4) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 90 ? "#54c878" : score >= 75 ? "#e8b468" : "#e85454";
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={2}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className="text-[8px] font-mono font-bold"
          style={{ color }}
        >
          {score}
        </span>
      </div>
    </div>
  );
}

export function AssetCard({
  asset,
  isSelected,
  onSelect,
  shots,
  index,
}: AssetCardProps) {
  const refCount = shots.filter((s) =>
    s.assetRefs.some((r) => r.assetId === asset.id)
  ).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      onClick={onSelect}
      className={`group relative p-3 rounded-lg cursor-pointer transition-all duration-200 border ${
        isSelected
          ? "bg-gold/8 border-gold/30 shadow-[0_0_16px_#e8b4681a]"
          : "bg-inset border-edge hover:bg-raised hover:border-edge-2"
      }`}
    >
      <div className="flex items-start gap-2.5">
        <div
          className="w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0"
          style={{
            backgroundColor: asset.color + "22",
            color: asset.color,
          }}
        >
          {ASSET_TYPE_ICONS[asset.type]}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <h4
              className={`text-xs font-heading font-medium truncate ${
                isSelected ? "text-gold" : "text-txt"
              }`}
            >
              {asset.name}
            </h4>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-txt-3">
            <span className="px-1 py-0.5 rounded bg-base border border-edge">
              {ASSET_TYPE_LABELS[asset.type]}
            </span>
            <span>{refCount} 引用</span>
          </div>
        </div>

        <MiniScoreRing score={asset.consistencyScore} />
      </div>

      {isSelected && (
        <motion.div
          layoutId="asset-indicator"
          className="absolute left-0 top-2 bottom-2 w-0.5 bg-gold rounded-full"
        />
      )}
    </motion.div>
  );
}
