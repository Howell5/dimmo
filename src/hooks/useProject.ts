import { useState, useCallback, useMemo } from "react";
import type {
  WorkspaceTab,
  Shot,
  Asset,
  AssetRef,
  ConsistencyReport,
} from "../types";
import {
  MOCK_SHOTS,
  MOCK_ASSETS,
  MOCK_CONSISTENCY_REPORT,
} from "../data/mockData";

export function useProject() {
  const [currentTab, setCurrentTab] = useState<WorkspaceTab>("script");
  const [shots, setShots] = useState<Shot[]>(MOCK_SHOTS);
  const [assets, setAssets] = useState<Asset[]>(MOCK_ASSETS);
  const [selectedShotId, setSelectedShotId] = useState<string | null>(
    "shot-1"
  );
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [playheadTime, setPlayheadTime] = useState(0);
  const [consistencyReport, setConsistencyReport] =
    useState<ConsistencyReport>(MOCK_CONSISTENCY_REPORT);

  // Tab navigation
  const goToTab = useCallback((tab: WorkspaceTab) => {
    setCurrentTab(tab);
  }, []);

  // Shot CRUD
  const addShot = useCallback((shot: Shot) => {
    setShots((prev) => [...prev, shot]);
  }, []);

  const updateShot = useCallback((id: string, updates: Partial<Shot>) => {
    setShots((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
  }, []);

  const deleteShot = useCallback(
    (id: string) => {
      setShots((prev) => prev.filter((s) => s.id !== id));
      if (selectedShotId === id) setSelectedShotId(null);
    },
    [selectedShotId]
  );

  const reorderShots = useCallback((orderedIds: string[]) => {
    setShots((prev) => {
      const map = new Map(prev.map((s) => [s.id, s]));
      return orderedIds
        .map((id, i) => {
          const shot = map.get(id);
          return shot ? { ...shot, order: i + 1 } : null;
        })
        .filter((s): s is Shot => s !== null);
    });
  }, []);

  // Asset CRUD
  const addAsset = useCallback((asset: Asset) => {
    setAssets((prev) => [...prev, asset]);
  }, []);

  const updateAsset = useCallback((id: string, updates: Partial<Asset>) => {
    setAssets((prev) =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      prev.map((a) => (a.id === id ? ({ ...a, ...updates } as any) : a))
    );
  }, []);

  const deleteAsset = useCallback(
    (id: string) => {
      setAssets((prev) => prev.filter((a) => a.id !== id));
      // Also remove refs from shots
      setShots((prev) =>
        prev.map((s) => ({
          ...s,
          assetRefs: s.assetRefs.filter((r) => r.assetId !== id),
        }))
      );
      if (selectedAssetId === id) setSelectedAssetId(null);
    },
    [selectedAssetId]
  );

  // Shot-Asset linking
  const linkAssetToShot = useCallback(
    (shotId: string, assetRef: AssetRef) => {
      setShots((prev) =>
        prev.map((s) => {
          if (s.id !== shotId) return s;
          // Avoid duplicate links
          if (s.assetRefs.some((r) => r.assetId === assetRef.assetId)) return s;
          return { ...s, assetRefs: [...s.assetRefs, assetRef] };
        })
      );
    },
    []
  );

  const unlinkAssetFromShot = useCallback(
    (shotId: string, assetId: string) => {
      setShots((prev) =>
        prev.map((s) => {
          if (s.id !== shotId) return s;
          return {
            ...s,
            assetRefs: s.assetRefs.filter((r) => r.assetId !== assetId),
          };
        })
      );
    },
    []
  );

  // Derived values
  const totalDuration = useMemo(
    () => shots.reduce((sum, s) => sum + s.duration, 0),
    [shots]
  );

  const selectedShot = useMemo(
    () => shots.find((s) => s.id === selectedShotId) ?? null,
    [shots, selectedShotId]
  );

  const selectedAsset = useMemo(
    () => assets.find((a) => a.id === selectedAssetId) ?? null,
    [assets, selectedAssetId]
  );

  return {
    // State
    currentTab,
    shots,
    assets,
    selectedShotId,
    selectedAssetId,
    playheadTime,
    consistencyReport,

    // Derived
    totalDuration,
    selectedShot,
    selectedAsset,

    // Tab
    goToTab,

    // Shots
    addShot,
    updateShot,
    deleteShot,
    reorderShots,
    setSelectedShotId,

    // Assets
    addAsset,
    updateAsset,
    deleteAsset,
    setSelectedAssetId,

    // Linking
    linkAssetToShot,
    unlinkAssetFromShot,

    // Playhead
    setPlayheadTime,

    // Consistency
    setConsistencyReport,
  };
}
