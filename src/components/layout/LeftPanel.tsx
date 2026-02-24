import { useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  MagnifyingGlass,
  User,
  MapPin,
  Cube,
  Palette,
} from "@phosphor-icons/react";
import type { Asset, AssetType, Shot } from "../../types";
import { AssetCard } from "../shared/AssetCard";
import { GlowButton } from "../shared/GlowButton";

interface LeftPanelProps {
  assets: Asset[];
  shots: Shot[];
  selectedAssetId: string | null;
  onSelectAsset: (id: string) => void;
  onAddAsset?: () => void;
}

const ASSET_SUB_TABS: { id: AssetType | "all"; label: string; icon: React.ReactNode }[] = [
  { id: "all", label: "全部", icon: null },
  { id: "character", label: "角色", icon: <User size={12} /> },
  { id: "location", label: "场景", icon: <MapPin size={12} /> },
  { id: "prop", label: "道具", icon: <Cube size={12} /> },
  { id: "style", label: "风格", icon: <Palette size={12} /> },
];

export function LeftPanel({
  assets,
  shots,
  selectedAssetId,
  onSelectAsset,
  onAddAsset,
}: LeftPanelProps) {
  const [activeSubTab, setActiveSubTab] = useState<AssetType | "all">("all");
  const [search, setSearch] = useState("");

  const filteredAssets = assets.filter((a) => {
    if (activeSubTab !== "all" && a.type !== activeSubTab) return false;
    if (search && !a.name.includes(search) && !a.description.includes(search))
      return false;
    return true;
  });

  return (
    <aside className="w-72 bg-panel border-r border-edge flex flex-col flex-shrink-0">
      <div className="p-3 border-b border-edge">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xs font-heading font-semibold text-txt-2 uppercase tracking-wider">
            素材库
          </h2>
          <GlowButton variant="ghost" size="sm" onClick={onAddAsset}>
            <Plus size={14} />
          </GlowButton>
        </div>
        <div className="relative mb-2">
          <MagnifyingGlass
            size={14}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-txt-3"
          />
          <input
            type="text"
            placeholder="搜索素材..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-inset border border-edge rounded-lg pl-8 pr-3 py-1.5 text-xs text-txt placeholder:text-txt-3 outline-none focus:border-gold/30 transition-colors"
          />
        </div>
        <div className="flex gap-1">
          {ASSET_SUB_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium transition-all cursor-pointer border ${
                activeSubTab === tab.id
                  ? "bg-gold/15 text-gold border-gold/30"
                  : "text-txt-3 hover:text-txt-2 hover:bg-raised border-transparent"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
        {filteredAssets.map((asset, i) => (
          <AssetCard
            key={asset.id}
            asset={asset}
            isSelected={asset.id === selectedAssetId}
            onSelect={() => onSelectAsset(asset.id)}
            shots={shots}
            index={i}
          />
        ))}
        {filteredAssets.length === 0 && (
          <div className="flex items-center justify-center h-32 text-xs text-txt-3">
            暂无素材
          </div>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="p-3 border-t border-edge"
      >
        <div className="flex items-center justify-between text-[10px] text-txt-3 font-mono">
          <span>{assets.length} 个素材</span>
          <span>
            {filteredAssets.length !== assets.length &&
              `显示 ${filteredAssets.length} / `}
            {assets.length} 个
          </span>
        </div>
      </motion.div>
    </aside>
  );
}
