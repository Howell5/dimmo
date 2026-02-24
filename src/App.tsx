import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TopBar } from "./components/layout/TopBar";
import { LeftPanel } from "./components/layout/LeftPanel";
import { RightPanel } from "./components/layout/RightPanel";
import { BottomTimeline } from "./components/layout/BottomTimeline";
import { ConsistencyModal } from "./components/consistency/ConsistencyModal";
import { AssetEditor } from "./components/asset-library/AssetEditor";
import { ScriptEngine } from "./components/workflow/ScriptEngine";
import { VisualMatching } from "./components/workflow/VisualMatching";
import { ArrangeWorkbench } from "./components/workflow/ArrangeWorkbench";
import { useProject } from "./hooks/useProject";
import type { WorkspaceTab, Asset } from "./types";

function WorkspaceContent({
  tab,
  project,
}: {
  tab: WorkspaceTab;
  project: ReturnType<typeof useProject>;
}) {
  switch (tab) {
    case "script":
      return (
        <ScriptEngine
          shots={project.shots}
          assets={project.assets}
          selectedShotId={project.selectedShotId}
          onSelectShot={project.setSelectedShotId}
          onLinkAsset={project.linkAssetToShot}
          onUnlinkAsset={project.unlinkAssetFromShot}
        />
      );
    case "visual":
      return (
        <VisualMatching
          shots={project.shots}
          assets={project.assets}
          selectedShotId={project.selectedShotId}
          onSelectShot={project.setSelectedShotId}
        />
      );
    case "arrange":
      return <ArrangeWorkbench />;
  }
}

export default function App() {
  const project = useProject();
  const [consistencyModalOpen, setConsistencyModalOpen] = useState(false);
  const [assetEditorOpen, setAssetEditorOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);

  const handleAddAsset = () => {
    setEditingAsset(null);
    setAssetEditorOpen(true);
  };

  const handleEditAsset = (asset: Asset) => {
    setEditingAsset(asset);
    setAssetEditorOpen(true);
  };

  const handleSaveAsset = (asset: Asset) => {
    if (editingAsset) {
      project.updateAsset(asset.id, asset);
    } else {
      project.addAsset(asset);
    }
  };

  const handleDeleteAsset = (assetId: string) => {
    project.deleteAsset(assetId);
  };

  return (
    <div className="h-full flex flex-col film-grain">
      <TopBar
        currentTab={project.currentTab}
        onTabChange={project.goToTab}
      />

      <div className="flex-1 flex min-h-0">
        <LeftPanel
          assets={project.assets}
          shots={project.shots}
          selectedAssetId={project.selectedAssetId}
          onSelectAsset={project.setSelectedAssetId}
          onAddAsset={handleAddAsset}
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={project.currentTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="flex-1 flex min-w-0"
          >
            <WorkspaceContent tab={project.currentTab} project={project} />
          </motion.div>
        </AnimatePresence>

        <RightPanel
          selectedShot={project.selectedShot}
          selectedAsset={project.selectedAsset}
          currentTab={project.currentTab}
          assets={project.assets}
          shots={project.shots}
          consistencyReport={project.consistencyReport}
          onEditAsset={handleEditAsset}
          onDeleteAsset={handleDeleteAsset}
        />
      </div>

      <BottomTimeline
        shots={project.shots}
        playheadTime={project.playheadTime}
        totalDuration={project.totalDuration}
        onPlayheadChange={project.setPlayheadTime}
        consistencyReport={project.consistencyReport}
        onOpenConsistencyDetail={() => setConsistencyModalOpen(true)}
      />

      <ConsistencyModal
        isOpen={consistencyModalOpen}
        onClose={() => setConsistencyModalOpen(false)}
        report={project.consistencyReport}
        assets={project.assets}
      />

      <AssetEditor
        isOpen={assetEditorOpen}
        onClose={() => setAssetEditorOpen(false)}
        onSave={handleSaveAsset}
        existingAsset={editingAsset}
      />
    </div>
  );
}
