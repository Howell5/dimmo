import { ShieldCheck, Warning, Info } from "@phosphor-icons/react";
import type { ConsistencyReport } from "../../types";

interface ConsistencyStatusBarProps {
  report: ConsistencyReport;
  onOpenDetail: () => void;
}

export function ConsistencyStatusBar({
  report,
  onOpenDetail,
}: ConsistencyStatusBarProps) {
  const warningCount = report.issues.filter(
    (i) => i.severity === "warning" || i.severity === "error"
  ).length;
  const infoCount = report.issues.filter((i) => i.severity === "info").length;
  const scoreColor =
    report.overallScore >= 90
      ? "text-green"
      : report.overallScore >= 75
        ? "text-gold"
        : "text-red";

  return (
    <div className="flex items-center gap-2">
      <ShieldCheck size={14} className={scoreColor} />
      <span className={`text-[10px] font-mono font-bold ${scoreColor}`}>
        {report.overallScore}
      </span>
      {warningCount > 0 && (
        <span className="flex items-center gap-0.5 text-[10px] text-gold">
          <Warning size={10} />
          {warningCount}
        </span>
      )}
      {infoCount > 0 && (
        <span className="flex items-center gap-0.5 text-[10px] text-txt-3">
          <Info size={10} />
          {infoCount}
        </span>
      )}
      <button
        onClick={onOpenDetail}
        className="text-[10px] text-txt-3 hover:text-gold transition-colors cursor-pointer underline underline-offset-2"
      >
        详情
      </button>
    </div>
  );
}
