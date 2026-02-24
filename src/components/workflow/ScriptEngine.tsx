import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MagicWand,
  PencilSimple,
  ArrowRight,
  Lightning,
  TextT,
  LinkSimple,
  X,
} from "@phosphor-icons/react";
import type { Shot, Asset, AssetRef } from "../../types";
import { GlowButton } from "../shared/GlowButton";

interface ScriptEngineProps {
  shots: Shot[];
  assets: Asset[];
  selectedShotId: string | null;
  onSelectShot: (id: string) => void;
  onLinkAsset: (shotId: string, assetRef: AssetRef) => void;
  onUnlinkAsset: (shotId: string, assetId: string) => void;
}

const ASSET_TYPE_LABELS: Record<string, string> = {
  character: "角色",
  location: "场景",
  prop: "道具",
  style: "风格",
};

export function ScriptEngine({
  shots,
  assets,
  selectedShotId,
  onSelectShot,
  onLinkAsset,
  onUnlinkAsset,
}: ScriptEngineProps) {
  const [topic, setTopic] = useState("鼠疫的历史：从黑死病到现代公共卫生");
  const [isGenerating, setIsGenerating] = useState(false);
  const [linkingShotId, setLinkingShotId] = useState<string | null>(null);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-6"
      >
        <div>
          <h2 className="text-xl font-heading font-semibold text-txt mb-1 flex items-center gap-2">
            <MagicWand size={22} className="text-gold" weight="fill" />
            脚本工作台
          </h2>
          <p className="text-sm text-txt-2">
            输入你的视频主题，让 AI 生成结构化的分镜脚本与旁白。
          </p>
        </div>

        {/* Topic input */}
        <div className="p-4 rounded-xl bg-panel border border-edge">
          <label className="text-[10px] font-mono text-txt-3 uppercase tracking-wider block mb-2">
            视频主题
          </label>
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <TextT
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-txt-3"
              />
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full bg-inset border border-edge rounded-lg pl-10 pr-4 py-2.5 text-sm text-txt placeholder:text-txt-3 outline-none focus:border-gold/30 transition-colors"
                placeholder="例如：量子计算入门"
              />
            </div>
            <GlowButton onClick={handleGenerate}>
              <Lightning size={16} weight="fill" />
              {isGenerating ? "生成中..." : "生成脚本"}
            </GlowButton>
          </div>
        </div>

        {/* Shot grid */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-heading font-medium text-txt-2">
              分镜板
            </h3>
            <span className="text-[10px] font-mono text-txt-3">
              {shots.length} 个分镜 ·{" "}
              共 {shots.reduce((s, sc) => s + sc.duration, 0)} 秒
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <AnimatePresence>
              {shots.map((shot, i) => {
                const isSelected = shot.id === selectedShotId;
                const linkedAssets = shot.assetRefs
                  .map((ref) => ({
                    ref,
                    asset: assets.find((a) => a.id === ref.assetId),
                  }))
                  .filter(
                    (x): x is { ref: AssetRef; asset: Asset } =>
                      x.asset !== undefined
                  );

                return (
                  <motion.div
                    key={shot.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => onSelectShot(shot.id)}
                    className={`group relative p-4 rounded-xl cursor-pointer transition-all duration-300 border ${
                      isSelected
                        ? "bg-gold/8 border-gold/30 shadow-[0_0_24px_#e8b4681a]"
                        : "bg-panel border-edge hover:border-edge-2 hover:bg-raised"
                    }`}
                  >
                    <div
                      className={`absolute -top-2 -left-2 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-mono font-bold border ${
                        isSelected
                          ? "bg-gold text-base border-gold"
                          : "bg-raised text-txt-2 border-edge"
                      }`}
                    >
                      {shot.order}
                    </div>

                    <div
                      className="h-24 rounded-lg mb-3 flex items-end p-2"
                      style={{
                        background: `linear-gradient(135deg, ${shot.thumbnailColor}, ${shot.thumbnailColor}dd)`,
                      }}
                    >
                      <span className="text-[10px] font-mono text-white/60 bg-black/30 px-1.5 py-0.5 rounded">
                        {shot.shotType.toUpperCase()} · {shot.duration}秒
                      </span>
                    </div>

                    <h4
                      className={`text-sm font-heading font-medium mb-1.5 ${isSelected ? "text-gold" : "text-txt"}`}
                    >
                      {shot.title}
                    </h4>
                    <p className="text-xs text-txt-2 leading-relaxed line-clamp-3">
                      {shot.narration}
                    </p>

                    {/* Linked assets tags */}
                    {linkedAssets.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {linkedAssets.map(({ asset }) => (
                          <span
                            key={asset.id}
                            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] border border-edge bg-base"
                          >
                            <span
                              className="w-2 h-2 rounded-sm"
                              style={{ backgroundColor: asset.color }}
                            />
                            <span className="text-txt-2">{asset.name}</span>
                            {isSelected && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onUnlinkAsset(shot.id, asset.id);
                                }}
                                className="text-txt-3 hover:text-red transition-colors cursor-pointer"
                              >
                                <X size={8} />
                              </button>
                            )}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Visual keywords */}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {shot.visualKeywords.slice(0, 3).map((kw) => (
                        <span
                          key={kw}
                          className="px-1.5 py-0.5 rounded text-[9px] bg-inset text-txt-3 border border-edge"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setLinkingShotId(
                            linkingShotId === shot.id ? null : shot.id
                          );
                        }}
                        className="p-1.5 rounded-md bg-base/80 text-txt-2 hover:text-gold transition-colors cursor-pointer"
                        title="关联素材"
                      >
                        <LinkSimple size={14} />
                      </button>
                      <button className="p-1.5 rounded-md bg-base/80 text-txt-2 hover:text-gold transition-colors cursor-pointer">
                        <PencilSimple size={14} />
                      </button>
                    </div>

                    {i < shots.length - 1 && i % 2 === 0 && (
                      <div className="absolute -right-5 top-1/2 -translate-y-1/2 text-txt-3/30 hidden md:block">
                        <ArrowRight size={16} />
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Asset linking popover */}
        <AnimatePresence>
          {linkingShotId && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
              onClick={() => setLinkingShotId(null)}
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="bg-panel border border-edge rounded-xl p-4 w-80 max-h-96 overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-heading font-medium text-txt">
                    关联素材
                  </h3>
                  <button
                    onClick={() => setLinkingShotId(null)}
                    className="text-txt-3 hover:text-txt cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="space-y-1.5">
                  {assets.map((asset) => {
                    const shot = shots.find((s) => s.id === linkingShotId);
                    const isLinked = shot?.assetRefs.some(
                      (r) => r.assetId === asset.id
                    );
                    return (
                      <div
                        key={asset.id}
                        onClick={() => {
                          if (isLinked) {
                            onUnlinkAsset(linkingShotId, asset.id);
                          } else {
                            onLinkAsset(linkingShotId, {
                              assetId: asset.id,
                              assetType: asset.type,
                              role: ASSET_TYPE_LABELS[asset.type],
                            });
                          }
                        }}
                        className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all border ${
                          isLinked
                            ? "bg-gold/8 border-gold/30"
                            : "bg-inset border-edge hover:border-edge-2"
                        }`}
                      >
                        <div
                          className="w-6 h-6 rounded-md flex items-center justify-center"
                          style={{
                            backgroundColor: asset.color + "22",
                          }}
                        >
                          <div
                            className="w-3 h-3 rounded-sm"
                            style={{ backgroundColor: asset.color }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-xs font-medium ${isLinked ? "text-gold" : "text-txt"}`}
                          >
                            {asset.name}
                          </p>
                          <p className="text-[9px] text-txt-3">
                            {ASSET_TYPE_LABELS[asset.type]}
                          </p>
                        </div>
                        {isLinked && (
                          <span className="text-[9px] text-gold">已关联</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
