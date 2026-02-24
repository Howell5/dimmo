import { motion } from "framer-motion";
import {
  User,
  MapPin,
  Cube,
  Palette,
  PencilSimple,
  Trash,
  FilmStrip,
} from "@phosphor-icons/react";
import type { Asset, Shot } from "../../types";

interface AssetDetailProps {
  asset: Asset;
  shots: Shot[];
  onEdit: () => void;
  onDelete: () => void;
}

const ASSET_TYPE_ICONS = {
  character: <User size={18} />,
  location: <MapPin size={18} />,
  prop: <Cube size={18} />,
  style: <Palette size={18} />,
};

const ASSET_TYPE_LABELS: Record<string, string> = {
  character: "角色",
  location: "场景",
  prop: "道具",
  style: "风格",
};

function ScoreRing({ score, size = 48 }: { score: number; size?: number }) {
  const radius = (size - 6) / 2;
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
          strokeWidth={3}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={3}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-mono font-bold" style={{ color }}>
          {score}
        </span>
      </div>
    </div>
  );
}

export function AssetDetail({
  asset,
  shots,
  onEdit,
  onDelete,
}: AssetDetailProps) {
  const referencingShots = shots.filter((s) =>
    s.assetRefs.some((r) => r.assetId === asset.id)
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-4"
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{
            backgroundColor: asset.color + "22",
            color: asset.color,
          }}
        >
          {ASSET_TYPE_ICONS[asset.type]}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-heading font-semibold text-txt">
            {asset.name}
          </h3>
          <span className="text-[10px] font-mono text-txt-3 uppercase">
            {ASSET_TYPE_LABELS[asset.type]}
          </span>
        </div>
        <ScoreRing score={asset.consistencyScore} />
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={onEdit}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-inset border border-edge text-txt-2 hover:text-txt hover:border-edge-2 transition-colors cursor-pointer"
        >
          <PencilSimple size={12} />
          编辑
        </button>
        <button
          onClick={onDelete}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-inset border border-edge text-txt-3 hover:text-red hover:border-red/30 transition-colors cursor-pointer"
        >
          <Trash size={12} />
          删除
        </button>
      </div>

      {/* Description */}
      <div className="p-3 rounded-lg bg-inset border border-edge">
        <p className="text-xs text-txt-2 leading-relaxed">
          {asset.description}
        </p>
      </div>

      {/* Color */}
      <div className="flex items-center gap-2">
        <div
          className="w-5 h-5 rounded-md"
          style={{ backgroundColor: asset.color }}
        />
        <span className="text-[10px] font-mono text-txt-3">{asset.color}</span>
      </div>

      {/* Tags */}
      {asset.tags.length > 0 && (
        <div>
          <p className="text-[10px] font-mono text-txt-3 uppercase tracking-wider mb-1.5">
            标签
          </p>
          <div className="flex flex-wrap gap-1">
            {asset.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-full bg-inset border border-edge text-[10px] text-txt-2"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Type-specific fields */}
      <div className="space-y-2">
        <p className="text-[10px] font-mono text-txt-3 uppercase tracking-wider">
          详细属性
        </p>
        {asset.type === "character" && (
          <>
            <Field label="外貌" value={asset.appearance} />
            <Field label="服饰" value={asset.costume} />
          </>
        )}
        {asset.type === "location" && (
          <>
            <Field label="氛围" value={asset.atmosphere} />
            <Field label="光照" value={asset.lighting} />
          </>
        )}
        {asset.type === "prop" && (
          <>
            <Field label="视觉特征" value={asset.visualTraits} />
            <Field label="比例" value={asset.scale} />
          </>
        )}
        {asset.type === "style" && (
          <>
            <Field label="艺术风格" value={asset.artStyle} />
            <Field
              label="配色方案"
              value={asset.colorScheme.join(", ")}
            />
            <Field label="规则" value={asset.rules.join("; ")} />
          </>
        )}
      </div>

      {/* Referencing shots */}
      {referencingShots.length > 0 && (
        <div>
          <p className="text-[10px] font-mono text-txt-3 uppercase tracking-wider mb-1.5">
            引用此素材的分镜
          </p>
          <div className="space-y-1">
            {referencingShots.map((shot) => (
              <div
                key={shot.id}
                className="flex items-center gap-2 p-2 rounded-lg bg-inset border border-edge"
              >
                <FilmStrip size={12} className="text-txt-3" />
                <span className="text-[10px] font-mono text-txt-3">
                  S{String(shot.order).padStart(2, "0")}
                </span>
                <span className="text-xs text-txt-2 truncate">
                  {shot.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="p-2 rounded-md bg-base border border-edge">
      <p className="text-[9px] font-mono text-txt-3 uppercase mb-0.5">
        {label}
      </p>
      <p className="text-xs text-txt-2">{value}</p>
    </div>
  );
}
