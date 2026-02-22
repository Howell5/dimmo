import { motion } from "framer-motion";
import { ShieldCheck, Warning, Eye, User, Cube, Image, CheckCircle, XCircle } from "@phosphor-icons/react";
import { MOCK_ANCHORS } from "../../data/mockData";

const ANCHOR_TYPE_CONFIG = {
  character: { icon: <User size={18} />, label: "人物" },
  scene: { icon: <Image size={18} />, label: "场景" },
  element: { icon: <Cube size={18} />, label: "元素" },
};

function ScoreRing({ score, size = 64 }: { score: number; size?: number }) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 90 ? "#54c878" : score >= 75 ? "#e8b468" : "#e85454";
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={4} />
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={4} strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-mono font-bold" style={{ color }}>{score}</span>
      </div>
    </div>
  );
}

export function ConsistencySystem() {
  const avgScore = Math.round(MOCK_ANCHORS.reduce((s, a) => s + a.consistencyScore, 0) / MOCK_ANCHORS.length);
  const conflicts = MOCK_ANCHORS.filter((a) => a.consistencyScore < 80);

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto space-y-6">
        <div>
          <h2 className="text-xl font-heading font-semibold text-txt mb-1 flex items-center gap-2">
            <ShieldCheck size={22} className="text-gold" weight="fill" />
            一致性系统
          </h2>
          <p className="text-sm text-txt-2">追踪视觉锚点，维持所有场景间的风格一致性。</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
            className="p-5 rounded-xl bg-panel border border-edge flex flex-col items-center justify-center">
            <p className="text-[10px] font-mono text-txt-3 uppercase tracking-wider mb-3">综合评分</p>
            <ScoreRing score={avgScore} size={80} />
            <p className="text-xs text-txt-2 mt-2">
              {avgScore >= 85 ? "优秀" : avgScore >= 70 ? "良好" : "需改善"}一致性
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
            className="p-5 rounded-xl bg-panel border border-edge">
            <p className="text-[10px] font-mono text-txt-3 uppercase tracking-wider mb-3">锚点概览</p>
            <div className="space-y-3">
              {(["character", "scene", "element"] as const).map((type) => (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-txt-3">{ANCHOR_TYPE_CONFIG[type].icon}</span>
                    <span className="text-xs text-txt-2">{ANCHOR_TYPE_CONFIG[type].label}</span>
                  </div>
                  <span className="text-xs font-mono text-txt">{MOCK_ANCHORS.filter((a) => a.type === type).length}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}
            className="p-5 rounded-xl bg-panel border border-edge">
            <p className="text-[10px] font-mono text-txt-3 uppercase tracking-wider mb-3">警告</p>
            {conflicts.length > 0 ? (
              <div className="space-y-2">
                {conflicts.map((c) => (
                  <div key={c.id} className="flex items-center gap-2 p-2 rounded-lg bg-red/5 border border-red/20">
                    <Warning size={14} className="text-red flex-shrink-0" />
                    <div>
                      <p className="text-xs text-txt">{c.name}</p>
                      <p className="text-[10px] text-txt-3">评分：{c.consistencyScore}%</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-2 text-green">
                <CheckCircle size={16} />
                <span className="text-xs">未检测到冲突</span>
              </div>
            )}
          </motion.div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-heading font-semibold text-txt-2 uppercase tracking-wider flex items-center gap-2">
              <Eye size={14} className="text-gold" /> 视觉锚点
            </h3>
            <span className="text-[10px] font-mono text-txt-3">追踪 {MOCK_ANCHORS.length} 个锚点</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {MOCK_ANCHORS.map((anchor, i) => (
              <motion.div
                key={anchor.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.06 }}
                className="group p-4 rounded-xl bg-panel border border-edge hover:border-edge-2 transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: anchor.color + "22", color: anchor.color }}>
                      {ANCHOR_TYPE_CONFIG[anchor.type].icon}
                    </div>
                    <div>
                      <p className="text-sm font-heading font-medium text-txt">{anchor.name}</p>
                      <p className="text-[10px] font-mono text-txt-3 uppercase">{ANCHOR_TYPE_CONFIG[anchor.type].label}</p>
                    </div>
                  </div>
                  <ScoreRing score={anchor.consistencyScore} size={40} />
                </div>
                <p className="text-xs text-txt-2 leading-relaxed mb-3">{anchor.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: anchor.color }} />
                    <span className="text-[10px] text-txt-3">色彩锚点</span>
                  </div>
                  <span className="text-[10px] font-mono text-txt-3">{anchor.appearances} 个场景</span>
                </div>
                <div className="mt-2 flex items-center gap-1">
                  {anchor.consistencyScore >= 80
                    ? <><CheckCircle size={12} className="text-green" weight="fill" /><span className="text-[10px] text-green">一致</span></>
                    : <><XCircle size={12} className="text-red" weight="fill" /><span className="text-[10px] text-red">需关注</span></>
                  }
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
