import { motion } from "framer-motion";
import {
  Eye,
  Camera,
  FilmSlate,
  ArrowsOutSimple,
  Crosshair,
  Binoculars,
  Drone,
  MagnifyingGlassPlus,
  ArrowsLeftRight,
  Path,
  VideoCamera,
} from "@phosphor-icons/react";
import type { Shot, ShotType, Asset, CameraMovement } from "../../types";

interface VisualMatchingProps {
  shots: Shot[];
  assets: Asset[];
  selectedShotId: string | null;
  onSelectShot: (id: string) => void;
}

const SHOT_CONFIG: Record<
  ShotType,
  {
    icon: React.ReactNode;
    label: string;
    description: string;
    color: string;
  }
> = {
  wide: {
    icon: <ArrowsOutSimple size={20} />,
    label: "远景",
    description: "建立环境与空间感",
    color: "#4466aa",
  },
  medium: {
    icon: <Camera size={20} />,
    label: "中景",
    description: "平衡主体与环境",
    color: "#66aa44",
  },
  closeup: {
    icon: <Crosshair size={20} />,
    label: "特写",
    description: "细节与情感表达",
    color: "#aa6644",
  },
  aerial: {
    icon: <Drone size={20} />,
    label: "航拍",
    description: "上帝视角俯瞰全局",
    color: "#6644aa",
  },
  macro: {
    icon: <MagnifyingGlassPlus size={20} />,
    label: "微距",
    description: "极致细节放大",
    color: "#44aaaa",
  },
  panning: {
    icon: <ArrowsLeftRight size={20} />,
    label: "摇镜",
    description: "水平扫视运动",
    color: "#aa44aa",
  },
  tracking: {
    icon: <Path size={20} />,
    label: "跟踪",
    description: "跟随主体移动",
    color: "#aaaa44",
  },
};

const CAMERA_MOVEMENT_LABELS: Record<CameraMovement, string> = {
  static: "静止",
  "pan-left": "左摇",
  "pan-right": "右摇",
  "tilt-up": "上摇",
  "tilt-down": "下摇",
  "dolly-in": "推进",
  "dolly-out": "拉远",
  "crane-up": "升起",
  "crane-down": "降落",
  orbit: "环绕",
};

function annotateNarration(text: string, keywords: string[]) {
  const parts: { text: string; highlighted: boolean }[] = [];
  let remaining = text;
  while (remaining.length > 0) {
    let earliest = -1;
    let matchedKw = "";
    for (const kw of keywords) {
      const idx = remaining.indexOf(kw);
      if (idx !== -1 && (earliest === -1 || idx < earliest)) {
        earliest = idx;
        matchedKw = kw;
      }
    }
    if (earliest === -1) {
      parts.push({ text: remaining, highlighted: false });
      break;
    }
    if (earliest > 0)
      parts.push({ text: remaining.slice(0, earliest), highlighted: false });
    parts.push({
      text: remaining.slice(earliest, earliest + matchedKw.length),
      highlighted: true,
    });
    remaining = remaining.slice(earliest + matchedKw.length);
  }
  return parts;
}

export function VisualMatching({
  shots,
  assets,
  selectedShotId,
  onSelectShot,
}: VisualMatchingProps) {
  const selectedShot = shots.find((s) => s.id === selectedShotId);

  // Resolve linked assets for selected shot
  const linkedAssets = selectedShot
    ? selectedShot.assetRefs
        .map((ref) => assets.find((a) => a.id === ref.assetId))
        .filter((a): a is Asset => a !== undefined)
    : [];

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto space-y-6"
      >
        <div>
          <h2 className="text-xl font-heading font-semibold text-txt mb-1 flex items-center gap-2">
            <Eye size={22} className="text-gold" weight="fill" />
            视觉工作台
          </h2>
          <p className="text-sm text-txt-2">
            AI 分析旁白文本，智能推荐最佳镜头类型与画面构图。
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: annotated narration */}
          <div className="space-y-3">
            <h3 className="text-xs font-heading font-semibold text-txt-2 uppercase tracking-wider flex items-center gap-2">
              <FilmSlate size={14} className="text-gold" /> 标注旁白
            </h3>
            <div className="space-y-2">
              {shots.map((shot, i) => {
                const isSelected = shot.id === selectedShotId;
                const parts = annotateNarration(
                  shot.narration,
                  shot.visualKeywords
                );
                return (
                  <motion.div
                    key={shot.id}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    onClick={() => onSelectShot(shot.id)}
                    className={`p-3 rounded-lg cursor-pointer transition-all duration-200 border ${
                      isSelected
                        ? "bg-gold/8 border-gold/30"
                        : "bg-panel border-edge hover:border-edge-2"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] font-mono text-txt-3">
                        S{String(shot.order).padStart(2, "0")}
                      </span>
                      <span
                        className={`text-xs font-heading font-medium ${isSelected ? "text-gold" : "text-txt"}`}
                      >
                        {shot.title}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed">
                      {parts.map((part, j) =>
                        part.highlighted ? (
                          <span
                            key={j}
                            className="text-gold bg-gold/10 px-0.5 rounded"
                          >
                            {part.text}
                          </span>
                        ) : (
                          <span key={j} className="text-txt-2">
                            {part.text}
                          </span>
                        )
                      )}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Right: shot suggestion + linked assets */}
          <div className="space-y-3">
            <h3 className="text-xs font-heading font-semibold text-txt-2 uppercase tracking-wider flex items-center gap-2">
              <Camera size={14} className="text-gold" /> 镜头建议
            </h3>
            {selectedShot ? (
              <motion.div
                key={selectedShot.id}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-3"
              >
                {/* Recommended shot type */}
                <div className="p-4 rounded-xl bg-gold/8 border border-gold/30">
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                      style={{
                        backgroundColor:
                          SHOT_CONFIG[selectedShot.shotType].color,
                      }}
                    >
                      {SHOT_CONFIG[selectedShot.shotType].icon}
                    </div>
                    <div>
                      <p className="text-xs font-mono text-gold uppercase">
                        推荐镜头
                      </p>
                      <p className="text-sm font-heading font-medium text-txt">
                        {SHOT_CONFIG[selectedShot.shotType].label}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-txt-2">
                    {SHOT_CONFIG[selectedShot.shotType].description}
                  </p>

                  {/* Camera movement */}
                  <div className="mt-3 flex items-center gap-2 p-2 rounded-lg bg-base/50 border border-edge">
                    <VideoCamera size={14} className="text-gold" />
                    <span className="text-[10px] font-mono text-txt-3 uppercase">
                      运镜
                    </span>
                    <span className="text-xs text-txt">
                      {CAMERA_MOVEMENT_LABELS[selectedShot.cameraMovement]}
                    </span>
                  </div>

                  {/* Visual preview placeholder */}
                  <div className="mt-3 h-28 rounded-lg bg-base/50 border border-edge flex items-center justify-center overflow-hidden relative">
                    <motion.div
                      className="absolute inset-0"
                      style={{
                        background: `radial-gradient(circle at center, ${SHOT_CONFIG[selectedShot.shotType].color}33 0%, transparent 70%)`,
                      }}
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                    <div className="relative text-center">
                      <Binoculars
                        size={28}
                        className="text-txt-3 mx-auto mb-1"
                      />
                      <p className="text-[10px] font-mono text-txt-3">
                        {SHOT_CONFIG[selectedShot.shotType].label}画面
                      </p>
                    </div>
                  </div>
                </div>

                {/* Linked assets */}
                {linkedAssets.length > 0 && (
                  <div>
                    <p className="text-[10px] font-mono text-txt-3 uppercase tracking-wider mb-2">
                      关联素材
                    </p>
                    <div className="space-y-1.5">
                      {linkedAssets.map((asset) => (
                        <div
                          key={asset.id}
                          className="flex items-center gap-2 p-2.5 rounded-lg bg-panel border border-edge"
                        >
                          <div
                            className="w-8 h-8 rounded-md"
                            style={{
                              backgroundColor: asset.color + "22",
                              border: `1px solid ${asset.color}44`,
                            }}
                          >
                            <div
                              className="w-full h-full rounded-md flex items-center justify-center"
                              style={{ color: asset.color }}
                            >
                              <div
                                className="w-4 h-4 rounded-sm"
                                style={{ backgroundColor: asset.color }}
                              />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-txt">
                              {asset.name}
                            </p>
                            <p className="text-[9px] text-txt-3">
                              {asset.description.slice(0, 40)}...
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Visual notes */}
                {selectedShot.visualNotes && (
                  <div className="p-3 rounded-lg bg-inset border border-edge">
                    <p className="text-[10px] font-mono text-txt-3 uppercase mb-1">
                      视觉笔记
                    </p>
                    <p className="text-xs text-txt-2 leading-relaxed">
                      {selectedShot.visualNotes}
                    </p>
                  </div>
                )}

                {/* Alternative shots */}
                <p className="text-[10px] font-mono text-txt-3 uppercase tracking-wider">
                  备选方案
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {(
                    Object.entries(SHOT_CONFIG) as [
                      ShotType,
                      (typeof SHOT_CONFIG)[ShotType],
                    ][]
                  )
                    .filter(([key]) => key !== selectedShot.shotType)
                    .slice(0, 4)
                    .map(([key, config], i) => (
                      <motion.div
                        key={key}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + i * 0.08 }}
                        className="p-3 rounded-lg bg-panel border border-edge hover:border-edge-2 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <div
                            className="w-6 h-6 rounded flex items-center justify-center text-white/80"
                            style={{
                              backgroundColor: config.color + "66",
                            }}
                          >
                            {config.icon}
                          </div>
                          <span className="text-xs font-medium text-txt">
                            {config.label}
                          </span>
                        </div>
                        <p className="text-[10px] text-txt-3">
                          {config.description}
                        </p>
                      </motion.div>
                    ))}
                </div>
              </motion.div>
            ) : (
              <div className="flex items-center justify-center h-64 text-txt-3 text-xs">
                选择一个分镜以查看镜头建议
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
