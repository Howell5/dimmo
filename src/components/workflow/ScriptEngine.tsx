import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MagicWand, PencilSimple, ArrowRight, Lightning, TextT } from "@phosphor-icons/react";
import type { Scene } from "../../types";
import { GlowButton } from "../shared/GlowButton";

interface ScriptEngineProps {
  scenes: Scene[];
  selectedSceneId: string | null;
  onSelectScene: (id: string) => void;
}

export function ScriptEngine({ scenes, selectedSceneId, onSelectScene }: ScriptEngineProps) {
  const [topic, setTopic] = useState("鼠疫的历史：从黑死病到现代公共卫生");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-6">
        <div>
          <h2 className="text-xl font-heading font-semibold text-txt mb-1 flex items-center gap-2">
            <MagicWand size={22} className="text-gold" weight="fill" />
            脚本引擎
          </h2>
          <p className="text-sm text-txt-2">输入你的视频主题，让 AI 生成结构化的分镜脚本与旁白。</p>
        </div>

        <div className="p-4 rounded-xl bg-panel border border-edge">
          <label className="text-[10px] font-mono text-txt-3 uppercase tracking-wider block mb-2">视频主题</label>
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <TextT size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-txt-3" />
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

        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-heading font-medium text-txt-2">分镜板</h3>
            <span className="text-[10px] font-mono text-txt-3">
              {scenes.length} 个场景 · 共 {scenes.reduce((s, sc) => s + sc.duration, 0)} 秒
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <AnimatePresence>
              {scenes.map((scene, i) => {
                const isSelected = scene.id === selectedSceneId;
                return (
                  <motion.div
                    key={scene.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => onSelectScene(scene.id)}
                    className={`group relative p-4 rounded-xl cursor-pointer transition-all duration-300 border ${
                      isSelected
                        ? "bg-gold/8 border-gold/30 shadow-[0_0_24px_#e8b4681a]"
                        : "bg-panel border-edge hover:border-edge-2 hover:bg-raised"
                    }`}
                  >
                    <div className={`absolute -top-2 -left-2 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-mono font-bold border ${
                      isSelected ? "bg-gold text-base border-gold" : "bg-raised text-txt-2 border-edge"
                    }`}>
                      {scene.order}
                    </div>

                    <div
                      className="h-24 rounded-lg mb-3 flex items-end p-2"
                      style={{ background: `linear-gradient(135deg, ${scene.thumbnailColor}, ${scene.thumbnailColor}dd)` }}
                    >
                      <span className="text-[10px] font-mono text-white/60 bg-black/30 px-1.5 py-0.5 rounded">
                        {scene.shotType.toUpperCase()} · {scene.duration}秒
                      </span>
                    </div>

                    <h4 className={`text-sm font-heading font-medium mb-1.5 ${isSelected ? "text-gold" : "text-txt"}`}>
                      {scene.title}
                    </h4>
                    <p className="text-xs text-txt-2 leading-relaxed line-clamp-3">{scene.narration}</p>

                    <div className="flex flex-wrap gap-1 mt-2">
                      {scene.visualKeywords.slice(0, 3).map((kw) => (
                        <span key={kw} className="px-1.5 py-0.5 rounded text-[9px] bg-inset text-txt-3 border border-edge">{kw}</span>
                      ))}
                    </div>

                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 rounded-md bg-base/80 text-txt-2 hover:text-gold transition-colors cursor-pointer">
                        <PencilSimple size={14} />
                      </button>
                    </div>

                    {i < scenes.length - 1 && i % 2 === 0 && (
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
      </motion.div>
    </div>
  );
}
