import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, FloppyDisk } from "@phosphor-icons/react";
import type {
  Asset,
  AssetType,
  CharacterAsset,
  LocationAsset,
  PropAsset,
  StyleGuideAsset,
} from "../../types";
import { GlowButton } from "../shared/GlowButton";

interface AssetEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (asset: Asset) => void;
  existingAsset?: Asset | null;
}

const ASSET_TYPE_OPTIONS: { id: AssetType; label: string }[] = [
  { id: "character", label: "角色" },
  { id: "location", label: "场景" },
  { id: "prop", label: "道具" },
  { id: "style", label: "风格" },
];

const PRESET_COLORS = [
  "#e85454",
  "#e8b468",
  "#54c878",
  "#4466aa",
  "#6644aa",
  "#44aaaa",
  "#aa44aa",
  "#3a3a3a",
  "#8a7a5a",
  "#cc8844",
];

function generateId() {
  return `asset-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

export function AssetEditor({
  isOpen,
  onClose,
  onSave,
  existingAsset,
}: AssetEditorProps) {
  const isEdit = !!existingAsset;
  const [assetType, setAssetType] = useState<AssetType>(
    existingAsset?.type ?? "character"
  );
  const [name, setName] = useState(existingAsset?.name ?? "");
  const [description, setDescription] = useState(
    existingAsset?.description ?? ""
  );
  const [color, setColor] = useState(existingAsset?.color ?? PRESET_COLORS[0]);
  const [tags, setTags] = useState(existingAsset?.tags.join(", ") ?? "");

  // Character fields
  const [appearance, setAppearance] = useState(
    existingAsset?.type === "character"
      ? (existingAsset as CharacterAsset).appearance
      : ""
  );
  const [costume, setCostume] = useState(
    existingAsset?.type === "character"
      ? (existingAsset as CharacterAsset).costume
      : ""
  );

  // Location fields
  const [atmosphere, setAtmosphere] = useState(
    existingAsset?.type === "location"
      ? (existingAsset as LocationAsset).atmosphere
      : ""
  );
  const [lighting, setLighting] = useState(
    existingAsset?.type === "location"
      ? (existingAsset as LocationAsset).lighting
      : ""
  );

  // Prop fields
  const [visualTraits, setVisualTraits] = useState(
    existingAsset?.type === "prop"
      ? (existingAsset as PropAsset).visualTraits
      : ""
  );
  const [scale, setScale] = useState(
    existingAsset?.type === "prop" ? (existingAsset as PropAsset).scale : ""
  );

  // Style fields
  const [artStyle, setArtStyle] = useState(
    existingAsset?.type === "style"
      ? (existingAsset as StyleGuideAsset).artStyle
      : ""
  );
  const [colorScheme, setColorScheme] = useState(
    existingAsset?.type === "style"
      ? (existingAsset as StyleGuideAsset).colorScheme.join(", ")
      : ""
  );
  const [rules, setRules] = useState(
    existingAsset?.type === "style"
      ? (existingAsset as StyleGuideAsset).rules.join("\n")
      : ""
  );

  const handleSave = () => {
    const parsedTags = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const base = {
      id: existingAsset?.id ?? generateId(),
      name,
      description,
      color,
      tags: parsedTags,
      referenceImages: existingAsset?.referenceImages ?? [],
      consistencyScore: existingAsset?.consistencyScore ?? 80,
      createdAt: existingAsset?.createdAt ?? Date.now(),
    };

    let asset: Asset;
    switch (assetType) {
      case "character":
        asset = { ...base, type: "character", appearance, costume };
        break;
      case "location":
        asset = { ...base, type: "location", atmosphere, lighting };
        break;
      case "prop":
        asset = { ...base, type: "prop", visualTraits, scale };
        break;
      case "style":
        asset = {
          ...base,
          type: "style",
          artStyle,
          colorScheme: colorScheme
            .split(",")
            .map((c) => c.trim())
            .filter(Boolean),
          rules: rules.split("\n").filter(Boolean),
        };
        break;
    }

    onSave(asset);
    onClose();
  };

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
            className="bg-panel border border-edge rounded-2xl w-[500px] max-h-[80vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-edge">
              <h2 className="text-base font-heading font-semibold text-txt">
                {isEdit ? "编辑素材" : "新建素材"}
              </h2>
              <button
                onClick={onClose}
                className="p-1.5 rounded-md text-txt-3 hover:text-txt hover:bg-raised transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Type selector (only for new) */}
              {!isEdit && (
                <div>
                  <label className="text-[10px] font-mono text-txt-3 uppercase tracking-wider block mb-1.5">
                    素材类型
                  </label>
                  <div className="flex gap-2">
                    {ASSET_TYPE_OPTIONS.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setAssetType(opt.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border cursor-pointer ${
                          assetType === opt.id
                            ? "bg-gold/15 text-gold border-gold/30"
                            : "bg-inset text-txt-2 border-edge hover:border-edge-2"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Common fields */}
              <div>
                <label className="text-[10px] font-mono text-txt-3 uppercase tracking-wider block mb-1.5">
                  名称
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-inset border border-edge rounded-lg px-3 py-2 text-sm text-txt placeholder:text-txt-3 outline-none focus:border-gold/30 transition-colors"
                  placeholder="素材名称"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-txt-3 uppercase tracking-wider block mb-1.5">
                  描述
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full bg-inset border border-edge rounded-lg px-3 py-2 text-sm text-txt placeholder:text-txt-3 outline-none focus:border-gold/30 transition-colors resize-none"
                  placeholder="描述该素材的视觉特征..."
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-txt-3 uppercase tracking-wider block mb-1.5">
                  配色
                </label>
                <div className="flex gap-1.5">
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      className={`w-7 h-7 rounded-md cursor-pointer transition-all ${
                        color === c
                          ? "ring-2 ring-gold ring-offset-2 ring-offset-panel"
                          : "hover:scale-110"
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono text-txt-3 uppercase tracking-wider block mb-1.5">
                  标签（逗号分隔）
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full bg-inset border border-edge rounded-lg px-3 py-2 text-sm text-txt placeholder:text-txt-3 outline-none focus:border-gold/30 transition-colors"
                  placeholder="标签1, 标签2, 标签3"
                />
              </div>

              {/* Type-specific fields */}
              {assetType === "character" && (
                <>
                  <div>
                    <label className="text-[10px] font-mono text-txt-3 uppercase tracking-wider block mb-1.5">
                      外貌特征
                    </label>
                    <input
                      type="text"
                      value={appearance}
                      onChange={(e) => setAppearance(e.target.value)}
                      className="w-full bg-inset border border-edge rounded-lg px-3 py-2 text-sm text-txt placeholder:text-txt-3 outline-none focus:border-gold/30 transition-colors"
                      placeholder="描述角色外貌..."
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-txt-3 uppercase tracking-wider block mb-1.5">
                      服饰
                    </label>
                    <input
                      type="text"
                      value={costume}
                      onChange={(e) => setCostume(e.target.value)}
                      className="w-full bg-inset border border-edge rounded-lg px-3 py-2 text-sm text-txt placeholder:text-txt-3 outline-none focus:border-gold/30 transition-colors"
                      placeholder="描述角色服饰..."
                    />
                  </div>
                </>
              )}

              {assetType === "location" && (
                <>
                  <div>
                    <label className="text-[10px] font-mono text-txt-3 uppercase tracking-wider block mb-1.5">
                      氛围
                    </label>
                    <input
                      type="text"
                      value={atmosphere}
                      onChange={(e) => setAtmosphere(e.target.value)}
                      className="w-full bg-inset border border-edge rounded-lg px-3 py-2 text-sm text-txt placeholder:text-txt-3 outline-none focus:border-gold/30 transition-colors"
                      placeholder="描述场景氛围..."
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-txt-3 uppercase tracking-wider block mb-1.5">
                      光照
                    </label>
                    <input
                      type="text"
                      value={lighting}
                      onChange={(e) => setLighting(e.target.value)}
                      className="w-full bg-inset border border-edge rounded-lg px-3 py-2 text-sm text-txt placeholder:text-txt-3 outline-none focus:border-gold/30 transition-colors"
                      placeholder="描述光照条件..."
                    />
                  </div>
                </>
              )}

              {assetType === "prop" && (
                <>
                  <div>
                    <label className="text-[10px] font-mono text-txt-3 uppercase tracking-wider block mb-1.5">
                      视觉特征
                    </label>
                    <input
                      type="text"
                      value={visualTraits}
                      onChange={(e) => setVisualTraits(e.target.value)}
                      className="w-full bg-inset border border-edge rounded-lg px-3 py-2 text-sm text-txt placeholder:text-txt-3 outline-none focus:border-gold/30 transition-colors"
                      placeholder="描述道具视觉特征..."
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-txt-3 uppercase tracking-wider block mb-1.5">
                      比例
                    </label>
                    <input
                      type="text"
                      value={scale}
                      onChange={(e) => setScale(e.target.value)}
                      className="w-full bg-inset border border-edge rounded-lg px-3 py-2 text-sm text-txt placeholder:text-txt-3 outline-none focus:border-gold/30 transition-colors"
                      placeholder="道具比例/尺寸..."
                    />
                  </div>
                </>
              )}

              {assetType === "style" && (
                <>
                  <div>
                    <label className="text-[10px] font-mono text-txt-3 uppercase tracking-wider block mb-1.5">
                      艺术风格
                    </label>
                    <input
                      type="text"
                      value={artStyle}
                      onChange={(e) => setArtStyle(e.target.value)}
                      className="w-full bg-inset border border-edge rounded-lg px-3 py-2 text-sm text-txt placeholder:text-txt-3 outline-none focus:border-gold/30 transition-colors"
                      placeholder="例如：油画风、扁平插画、写实3D..."
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-txt-3 uppercase tracking-wider block mb-1.5">
                      配色方案（逗号分隔色值）
                    </label>
                    <input
                      type="text"
                      value={colorScheme}
                      onChange={(e) => setColorScheme(e.target.value)}
                      className="w-full bg-inset border border-edge rounded-lg px-3 py-2 text-sm text-txt placeholder:text-txt-3 outline-none focus:border-gold/30 transition-colors"
                      placeholder="#ff6600, #333333, #ffffff"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-txt-3 uppercase tracking-wider block mb-1.5">
                      风格规则（每行一条）
                    </label>
                    <textarea
                      value={rules}
                      onChange={(e) => setRules(e.target.value)}
                      rows={3}
                      className="w-full bg-inset border border-edge rounded-lg px-3 py-2 text-sm text-txt placeholder:text-txt-3 outline-none focus:border-gold/30 transition-colors resize-none"
                      placeholder="保持暖色调&#10;避免高饱和度&#10;使用柔和光影"
                    />
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2 p-4 border-t border-edge">
              <GlowButton variant="secondary" size="sm" onClick={onClose}>
                取消
              </GlowButton>
              <GlowButton
                variant="primary"
                size="sm"
                onClick={handleSave}
                disabled={!name.trim()}
              >
                <FloppyDisk size={14} />
                {isEdit ? "保存" : "创建"}
              </GlowButton>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
