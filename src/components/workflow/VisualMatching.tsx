import { motion } from "framer-motion";
import { Eye, Camera, FilmSlate, ArrowsOutSimple, Crosshair, Binoculars, Drone, MagnifyingGlassPlus, ArrowsLeftRight, Path } from "@phosphor-icons/react";
import type { Scene, ShotType } from "../../types";

interface VisualMatchingProps {
  scenes: Scene[];
  selectedSceneId: string | null;
  onSelectScene: (id: string) => void;
}

const SHOT_CONFIG: Record<ShotType, { icon: React.ReactNode; label: string; description: string; color: string }> = {
  wide: { icon: <ArrowsOutSimple size={20} />, label: "远景", description: "建立环境与空间感", color: "#4466aa" },
  medium: { icon: <Camera size={20} />, label: "中景", description: "平衡主体与环境", color: "#66aa44" },
  closeup: { icon: <Crosshair size={20} />, label: "特写", description: "细节与情感表达", color: "#aa6644" },
  aerial: { icon: <Drone size={20} />, label: "航拍", description: "上帝视角俯瞰全局", color: "#6644aa" },
  macro: { icon: <MagnifyingGlassPlus size={20} />, label: "微距", description: "极致细节放大", color: "#44aaaa" },
  panning: { icon: <ArrowsLeftRight size={20} />, label: "摇镜", description: "水平扫视运动", color: "#aa44aa" },
  tracking: { icon: <Path size={20} />, label: "跟踪", description: "跟随主体移动", color: "#aaaa44" },
};

function annotateNarration(text: string, keywords: string[]) {
  const parts: { text: string; highlighted: boolean }[] = [];
  let remaining = text;
  while (remaining.length > 0) {
    let earliest = -1;
    let matchedKw = "";
    for (const kw of keywords) {
      const idx = remaining.indexOf(kw);
      if (idx !== -1 && (earliest === -1 || idx < earliest)) { earliest = idx; matchedKw = kw; }
    }
    if (earliest === -1) { parts.push({ text: remaining, highlighted: false }); break; }
    if (earliest > 0) parts.push({ text: remaining.slice(0, earliest), highlighted: false });
    parts.push({ text: remaining.slice(earliest, earliest + matchedKw.length), highlighted: true });
    remaining = remaining.slice(earliest + matchedKw.length);
  }
  return parts;
}

export function VisualMatching({ scenes, selectedSceneId, onSelectScene }: VisualMatchingProps) {
  const selectedScene = scenes.find((s) => s.id === selectedSceneId);
  return (
    <div className="flex-1 overflow-y-auto p-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto space-y-6">
        <div>
          <h2 className="text-xl font-heading font-semibold text-txt mb-1 flex items-center gap-2">
            <Eye size={22} className="text-gold" weight="fill" />
            语义视觉匹配
          </h2>
          <p className="text-sm text-txt-2">AI 分析旁白文本，智能推荐最佳镜头类型与画面构图。</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="text-xs font-heading font-semibold text-txt-2 uppercase tracking-wider flex items-center gap-2">
              <FilmSlate size={14} className="text-gold" /> 标注旁白
            </h3>
            <div className="space-y-2">
              {scenes.map((scene, i) => {
                const isSelected = scene.id === selectedSceneId;
                const parts = annotateNarration(scene.narration, scene.visualKeywords);
                return (
                  <motion.div
                    key={scene.id}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    onClick={() => onSelectScene(scene.id)}
                    className={`p-3 rounded-lg cursor-pointer transition-all duration-200 border ${
                      isSelected ? "bg-gold/8 border-gold/30" : "bg-panel border-edge hover:border-edge-2"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] font-mono text-txt-3">S{String(scene.order).padStart(2, "0")}</span>
                      <span className={`text-xs font-heading font-medium ${isSelected ? "text-gold" : "text-txt"}`}>{scene.title}</span>
                    </div>
                    <p className="text-xs leading-relaxed">
                      {parts.map((part, j) =>
                        part.highlighted
                          ? <span key={j} className="text-gold bg-gold/10 px-0.5 rounded">{part.text}</span>
                          : <span key={j} className="text-txt-2">{part.text}</span>
                      )}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-heading font-semibold text-txt-2 uppercase tracking-wider flex items-center gap-2">
              <Camera size={14} className="text-gold" /> 镜头建议
            </h3>
            {selectedScene ? (
              <motion.div key={selectedScene.id} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="space-y-3">
                <div className="p-4 rounded-xl bg-gold/8 border border-gold/30">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: SHOT_CONFIG[selectedScene.shotType].color }}>
                      {SHOT_CONFIG[selectedScene.shotType].icon}
                    </div>
                    <div>
                      <p className="text-xs font-mono text-gold uppercase">推荐镜头</p>
                      <p className="text-sm font-heading font-medium text-txt">{SHOT_CONFIG[selectedScene.shotType].label}</p>
                    </div>
                  </div>
                  <p className="text-xs text-txt-2">{SHOT_CONFIG[selectedScene.shotType].description}</p>
                  <div className="mt-3 h-28 rounded-lg bg-base/50 border border-edge flex items-center justify-center overflow-hidden relative">
                    <motion.div
                      className="absolute inset-0"
                      style={{ background: `radial-gradient(circle at center, ${SHOT_CONFIG[selectedScene.shotType].color}33 0%, transparent 70%)` }}
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <div className="relative text-center">
                      <Binoculars size={28} className="text-txt-3 mx-auto mb-1" />
                      <p className="text-[10px] font-mono text-txt-3">{SHOT_CONFIG[selectedScene.shotType].label}画面</p>
                    </div>
                  </div>
                </div>

                <p className="text-[10px] font-mono text-txt-3 uppercase tracking-wider">备选方案</p>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.entries(SHOT_CONFIG) as [ShotType, (typeof SHOT_CONFIG)[ShotType]][])
                    .filter(([key]) => key !== selectedScene.shotType)
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
                          <div className="w-6 h-6 rounded flex items-center justify-center text-white/80" style={{ backgroundColor: config.color + "66" }}>
                            {config.icon}
                          </div>
                          <span className="text-xs font-medium text-txt">{config.label}</span>
                        </div>
                        <p className="text-[10px] text-txt-3">{config.description}</p>
                      </motion.div>
                    ))}
                </div>
              </motion.div>
            ) : (
              <div className="flex items-center justify-center h-64 text-txt-3 text-xs">选择一个场景以查看镜头建议</div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
