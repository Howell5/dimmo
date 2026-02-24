import { motion } from "framer-motion";
import { FilmReel, Export } from "@phosphor-icons/react";
import type { WorkspaceTab } from "../../types";
import { WORKSPACE_TABS } from "../../data/mockData";
import { GlowButton } from "../shared/GlowButton";

interface TopBarProps {
  currentTab: WorkspaceTab;
  onTabChange: (tab: WorkspaceTab) => void;
}

export function TopBar({ currentTab, onTabChange }: TopBarProps) {
  return (
    <header className="h-14 bg-panel border-b border-edge flex items-center px-4 gap-4 flex-shrink-0">
      <div className="flex items-center gap-2.5 mr-4">
        <div className="w-8 h-8 rounded-lg bg-gold/15 border border-gold/30 flex items-center justify-center">
          <FilmReel size={18} className="text-gold" weight="fill" />
        </div>
        <div>
          <h1 className="text-sm font-heading font-semibold text-txt leading-none">
            AI Director
          </h1>
          <p className="text-[10px] text-txt-3 font-mono mt-0.5">
            鼠疫的历史 v1.0
          </p>
        </div>
      </div>

      <div className="w-px h-7 bg-edge" />

      <nav className="flex items-center gap-1 flex-1 justify-center">
        {WORKSPACE_TABS.map((tab) => {
          const isActive = tab.id === currentTab;
          return (
            <motion.button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`relative flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-medium transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-gold/15 text-gold border border-gold/30"
                  : "text-txt-3 hover:text-txt-2 hover:bg-raised border border-transparent"
              }`}
            >
              <span className="hidden lg:inline">{tab.shortLabel}</span>
              <span className="lg:hidden">{tab.shortLabel}</span>
              {isActive && (
                <motion.div
                  layoutId="tab-active"
                  className="absolute inset-0 rounded-md border border-gold/30"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </nav>

      <div className="w-px h-7 bg-edge" />

      <div className="flex items-center gap-2 ml-2">
        <GlowButton variant="primary" size="sm">
          <Export size={14} />
          导出
        </GlowButton>
      </div>
    </header>
  );
}
