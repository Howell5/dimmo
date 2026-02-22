import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { FilmStrip, Microphone, MusicNote, Subtitles, MagnifyingGlassPlus, MagnifyingGlassMinus, CaretRight } from "@phosphor-icons/react";
import { MOCK_TIMELINE_TRACKS } from "../../data/mockData";

const TRACK_ICONS = {
  video: <FilmStrip size={14} />,
  voiceover: <Microphone size={14} />,
  music: <MusicNote size={14} />,
  subtitle: <Subtitles size={14} />,
};

const TOTAL_DURATION = 65;

export function TimelineEditor() {
  const [zoom, setZoom] = useState(1);
  const [playheadPos, setPlayheadPos] = useState(8);
  const pxPerSecond = 12 * zoom;
  const timelineWidth = TOTAL_DURATION * pxPerSecond;

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const handleTimelineClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const scrollLeft = e.currentTarget.scrollLeft;
    const x = e.clientX - rect.left + scrollLeft;
    setPlayheadPos(Math.max(0, Math.min(TOTAL_DURATION, x / pxPerSecond)));
  }, [pxPerSecond]);

  return (
    <div className="flex-1 overflow-hidden flex flex-col p-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col h-full max-w-full">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-heading font-semibold text-txt mb-1 flex items-center gap-2">
              <FilmStrip size={22} className="text-gold" weight="fill" />
              时间线编排
            </h2>
            <p className="text-sm text-txt-2">在多轨时间线上精确安排视频片段与音频。</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setZoom(Math.max(0.5, zoom - 0.25))} className="p-1.5 rounded-md bg-panel border border-edge text-txt-2 hover:text-txt transition-colors cursor-pointer">
              <MagnifyingGlassMinus size={14} />
            </button>
            <span className="text-[10px] font-mono text-txt-3 w-10 text-center">{Math.round(zoom * 100)}%</span>
            <button onClick={() => setZoom(Math.min(3, zoom + 0.25))} className="p-1.5 rounded-md bg-panel border border-edge text-txt-2 hover:text-txt transition-colors cursor-pointer">
              <MagnifyingGlassPlus size={14} />
            </button>
          </div>
        </div>

        <div className="flex-1 bg-panel rounded-xl border border-edge overflow-hidden flex flex-col min-h-0">
          <div className="flex border-b border-edge flex-shrink-0">
            <div className="w-28 flex-shrink-0 bg-inset" />
            <div className="overflow-x-auto flex-1 relative" style={{ minWidth: 0 }}>
              <div className="h-7 relative" style={{ width: timelineWidth }}>
                {Array.from({ length: Math.ceil(TOTAL_DURATION / 5) + 1 }, (_, i) => i * 5).map((t) => (
                  <div key={t} className="absolute top-0 h-full flex flex-col items-start" style={{ left: t * pxPerSecond }}>
                    <div className="w-px h-2.5 bg-edge-2" />
                    <span className="text-[9px] font-mono text-txt-3 ml-1">{formatTime(t)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            <div className="flex min-h-full">
              <div className="w-28 flex-shrink-0 bg-inset border-r border-edge">
                {MOCK_TIMELINE_TRACKS.map((track) => (
                  <div key={track.id} className="h-16 flex items-center gap-2 px-3 border-b border-edge">
                    <span className="text-txt-3">{TRACK_ICONS[track.type]}</span>
                    <span className="text-xs font-medium text-txt-2">{track.label}</span>
                  </div>
                ))}
              </div>

              <div className="flex-1 overflow-x-auto relative" onClick={handleTimelineClick}>
                <div style={{ width: timelineWidth, minHeight: "100%" }} className="relative">
                  {MOCK_TIMELINE_TRACKS.map((track, trackIdx) => (
                    <div key={track.id} className="h-16 relative border-b border-edge">
                      {track.clips.map((clip, clipIdx) => (
                        <motion.div
                          key={clip.id}
                          initial={{ opacity: 0, scaleX: 0.8 }}
                          animate={{ opacity: 1, scaleX: 1 }}
                          transition={{ delay: trackIdx * 0.1 + clipIdx * 0.05 }}
                          className="absolute top-2 h-12 rounded-lg border border-white/10 overflow-hidden cursor-pointer group hover:border-gold/30 transition-colors"
                          style={{ left: clip.startTime * pxPerSecond, width: clip.duration * pxPerSecond, backgroundColor: clip.color }}
                        >
                          <div className="h-full flex items-center px-2 gap-1">
                            <CaretRight size={10} className="text-white/40 flex-shrink-0" />
                            <span className="text-[10px] text-white/70 truncate font-mono">{clip.label}</span>
                          </div>
                          <div className="absolute left-0 top-0 w-1 h-full bg-white/0 group-hover:bg-white/20 cursor-ew-resize transition-colors" />
                          <div className="absolute right-0 top-0 w-1 h-full bg-white/0 group-hover:bg-white/20 cursor-ew-resize transition-colors" />
                        </motion.div>
                      ))}
                    </div>
                  ))}

                  <motion.div
                    className="absolute top-0 bottom-0 w-px z-10"
                    style={{ left: playheadPos * pxPerSecond }}
                  >
                    <div className="w-px h-full bg-gold" />
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-gold shadow-[0_0_8px_#e8b46899]" />
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <span className="text-[10px] font-mono text-txt-3">播放头：{formatTime(playheadPos)}</span>
          <span className="text-[10px] font-mono text-txt-3">总时长：{formatTime(TOTAL_DURATION)}</span>
        </div>
      </motion.div>
    </div>
  );
}
