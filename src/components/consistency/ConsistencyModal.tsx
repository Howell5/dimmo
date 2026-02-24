import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Warning,
  Info,
  X,
  CheckCircle,
  XCircle,
} from "@phosphor-icons/react";
import type { ConsistencyReport, Asset } from "../../types";

interface ConsistencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: ConsistencyReport;
  assets: Asset[];
}

function ScoreRing({ score, size = 64 }: { score: number; size?: number }) {
  const radius = (size - 8) / 2;
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
          strokeWidth={4}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={4}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-mono font-bold" style={{ color }}>
          {score}
        </span>
      </div>
    </div>
  );
}

const SEVERITY_CONFIG = {
  error: {
    icon: <XCircle size={14} className="text-red" weight="fill" />,
    label: "错误",
    bg: "bg-red/5 border-red/20",
  },
  warning: {
    icon: <Warning size={14} className="text-gold" />,
    label: "警告",
    bg: "bg-gold/5 border-gold/20",
  },
  info: {
    icon: <Info size={14} className="text-blue-400" />,
    label: "提示",
    bg: "bg-blue-400/5 border-blue-400/20",
  },
};

export function ConsistencyModal({
  isOpen,
  onClose,
  report,
  assets,
}: ConsistencyModalProps) {
  const avgAssetScore =
    assets.length > 0
      ? Math.round(
          assets.reduce((s, a) => s + a.consistencyScore, 0) / assets.length
        )
      : 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-panel border border-edge rounded-2xl w-[640px] max-h-[80vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-edge">
              <div className="flex items-center gap-2">
                <ShieldCheck size={20} className="text-gold" weight="fill" />
                <h2 className="text-lg font-heading font-semibold text-txt">
                  一致性报告
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-md text-txt-3 hover:text-txt hover:bg-raised transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {/* Score overview */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-inset border border-edge flex flex-col items-center">
                  <p className="text-[10px] font-mono text-txt-3 uppercase tracking-wider mb-2">
                    综合评分
                  </p>
                  <ScoreRing score={report.overallScore} size={72} />
                  <p className="text-xs text-txt-2 mt-2">
                    {report.overallScore >= 85
                      ? "优秀"
                      : report.overallScore >= 70
                        ? "良好"
                        : "需改善"}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-inset border border-edge flex flex-col items-center">
                  <p className="text-[10px] font-mono text-txt-3 uppercase tracking-wider mb-2">
                    素材平均分
                  </p>
                  <ScoreRing score={avgAssetScore} size={72} />
                  <p className="text-xs text-txt-2 mt-2">
                    {assets.length} 个素材
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-inset border border-edge flex flex-col items-center justify-center">
                  <p className="text-[10px] font-mono text-txt-3 uppercase tracking-wider mb-3">
                    问题统计
                  </p>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <XCircle size={12} className="text-red" weight="fill" />
                      <span className="text-xs text-txt-2">
                        错误：
                        {
                          report.issues.filter((i) => i.severity === "error")
                            .length
                        }
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Warning size={12} className="text-gold" />
                      <span className="text-xs text-txt-2">
                        警告：
                        {
                          report.issues.filter((i) => i.severity === "warning")
                            .length
                        }
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Info size={12} className="text-blue-400" />
                      <span className="text-xs text-txt-2">
                        提示：
                        {
                          report.issues.filter((i) => i.severity === "info")
                            .length
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Issues list */}
              <div>
                <h3 className="text-xs font-heading font-semibold text-txt-2 uppercase tracking-wider mb-3">
                  问题详情
                </h3>
                <div className="space-y-2">
                  {report.issues.map((issue) => {
                    const config = SEVERITY_CONFIG[issue.severity];
                    const relatedAsset = issue.assetId
                      ? assets.find((a) => a.id === issue.assetId)
                      : null;
                    return (
                      <motion.div
                        key={issue.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`flex items-start gap-3 p-3 rounded-lg border ${config.bg}`}
                      >
                        <div className="flex-shrink-0 mt-0.5">
                          {config.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-txt leading-relaxed">
                            {issue.message}
                          </p>
                          {relatedAsset && (
                            <div className="flex items-center gap-1.5 mt-1.5">
                              <div
                                className="w-2.5 h-2.5 rounded-sm"
                                style={{
                                  backgroundColor: relatedAsset.color,
                                }}
                              />
                              <span className="text-[10px] text-txt-3">
                                {relatedAsset.name}
                              </span>
                            </div>
                          )}
                        </div>
                        <span className="text-[9px] text-txt-3 flex-shrink-0">
                          {config.label}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Asset scores */}
              <div>
                <h3 className="text-xs font-heading font-semibold text-txt-2 uppercase tracking-wider mb-3">
                  素材一致性
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {assets.map((asset) => (
                    <div
                      key={asset.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-inset border border-edge"
                    >
                      <div
                        className="w-8 h-8 rounded-md flex items-center justify-center"
                        style={{
                          backgroundColor: asset.color + "22",
                          color: asset.color,
                        }}
                      >
                        <div
                          className="w-4 h-4 rounded-sm"
                          style={{ backgroundColor: asset.color }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-txt truncate">
                          {asset.name}
                        </p>
                        <div className="flex items-center gap-1 mt-0.5">
                          {asset.consistencyScore >= 80 ? (
                            <CheckCircle
                              size={10}
                              className="text-green"
                              weight="fill"
                            />
                          ) : (
                            <XCircle
                              size={10}
                              className="text-red"
                              weight="fill"
                            />
                          )}
                          <span className="text-[10px] text-txt-3">
                            {asset.consistencyScore}%
                          </span>
                        </div>
                      </div>
                      <ScoreRing score={asset.consistencyScore} size={32} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
