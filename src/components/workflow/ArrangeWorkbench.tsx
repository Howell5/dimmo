import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  FilmStrip,
  Microphone,
  MusicNote,
  Subtitles,
  MagnifyingGlassPlus,
  MagnifyingGlassMinus,
  CaretRight,
  SpeakerHigh,
  Waveform,
  CheckCircle,
  Play,
  Pause,
  CaretDown,
  CaretUp,
} from "@phosphor-icons/react";
import { MOCK_TIMELINE_TRACKS, MOCK_VOICES, MOCK_MUSIC, MOCK_SFX } from "../../data/mockData";
import { GlowButton } from "../shared/GlowButton";

const TRACK_ICONS = {
  video: <FilmStrip size={14} />,
  voiceover: <Microphone size={14} />,
  music: <MusicNote size={14} />,
  subtitle: <Subtitles size={14} />,
};

const TOTAL_DURATION = 65;

export function ArrangeWorkbench() {
  const [zoom, setZoom] = useState(1);
  const [playheadPos, setPlayheadPos] = useState(8);
  const [audioPanelOpen, setAudioPanelOpen] = useState(true);
  const [selectedVoice, setSelectedVoice] = useState("v1");
  const [selectedMusic, setSelectedMusic] = useState<string | null>("mus1");
  const [playingMusic, setPlayingMusic] = useState<string | null>(null);
  const [subtitleFont, setSubtitleFont] = useState("sora");
  const [subtitlePosition, setSubtitlePosition] = useState("bottom");

  const pxPerSecond = 12 * zoom;
  const timelineWidth = TOTAL_DURATION * pxPerSecond;

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const handleTimelineClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const scrollLeft = e.currentTarget.scrollLeft;
      const x = e.clientX - rect.left + scrollLeft;
      setPlayheadPos(
        Math.max(0, Math.min(TOTAL_DURATION, x / pxPerSecond))
      );
    },
    [pxPerSecond]
  );

  return (
    <div className="flex-1 overflow-hidden flex flex-col p-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col h-full max-w-full"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-heading font-semibold text-txt mb-1 flex items-center gap-2">
              <FilmStrip size={22} className="text-gold" weight="fill" />
              编排工作台
            </h2>
            <p className="text-sm text-txt-2">
              在多轨时间线上精确安排视频片段，配置音频与字幕。
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}
              className="p-1.5 rounded-md bg-panel border border-edge text-txt-2 hover:text-txt transition-colors cursor-pointer"
            >
              <MagnifyingGlassMinus size={14} />
            </button>
            <span className="text-[10px] font-mono text-txt-3 w-10 text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom(Math.min(3, zoom + 0.25))}
              className="p-1.5 rounded-md bg-panel border border-edge text-txt-2 hover:text-txt transition-colors cursor-pointer"
            >
              <MagnifyingGlassPlus size={14} />
            </button>
          </div>
        </div>

        {/* Timeline */}
        <div className="flex-1 bg-panel rounded-xl border border-edge overflow-hidden flex flex-col min-h-0">
          {/* Time ruler */}
          <div className="flex border-b border-edge flex-shrink-0">
            <div className="w-28 flex-shrink-0 bg-inset" />
            <div
              className="overflow-x-auto flex-1 relative"
              style={{ minWidth: 0 }}
            >
              <div className="h-7 relative" style={{ width: timelineWidth }}>
                {Array.from(
                  { length: Math.ceil(TOTAL_DURATION / 5) + 1 },
                  (_, i) => i * 5
                ).map((t) => (
                  <div
                    key={t}
                    className="absolute top-0 h-full flex flex-col items-start"
                    style={{ left: t * pxPerSecond }}
                  >
                    <div className="w-px h-2.5 bg-edge-2" />
                    <span className="text-[9px] font-mono text-txt-3 ml-1">
                      {formatTime(t)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tracks */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            <div className="flex min-h-full">
              <div className="w-28 flex-shrink-0 bg-inset border-r border-edge">
                {MOCK_TIMELINE_TRACKS.map((track) => (
                  <div
                    key={track.id}
                    className="h-16 flex items-center gap-2 px-3 border-b border-edge"
                  >
                    <span className="text-txt-3">
                      {TRACK_ICONS[track.type]}
                    </span>
                    <span className="text-xs font-medium text-txt-2">
                      {track.label}
                    </span>
                  </div>
                ))}
              </div>

              <div
                className="flex-1 overflow-x-auto relative"
                onClick={handleTimelineClick}
              >
                <div
                  style={{ width: timelineWidth, minHeight: "100%" }}
                  className="relative"
                >
                  {MOCK_TIMELINE_TRACKS.map((track, trackIdx) => (
                    <div
                      key={track.id}
                      className="h-16 relative border-b border-edge"
                    >
                      {track.clips.map((clip, clipIdx) => (
                        <motion.div
                          key={clip.id}
                          initial={{ opacity: 0, scaleX: 0.8 }}
                          animate={{ opacity: 1, scaleX: 1 }}
                          transition={{
                            delay: trackIdx * 0.1 + clipIdx * 0.05,
                          }}
                          className="absolute top-2 h-12 rounded-lg border border-white/10 overflow-hidden cursor-pointer group hover:border-gold/30 transition-colors"
                          style={{
                            left: clip.startTime * pxPerSecond,
                            width: clip.duration * pxPerSecond,
                            backgroundColor: clip.color,
                          }}
                        >
                          <div className="h-full flex items-center px-2 gap-1">
                            <CaretRight
                              size={10}
                              className="text-white/40 flex-shrink-0"
                            />
                            <span className="text-[10px] text-white/70 truncate font-mono">
                              {clip.label}
                            </span>
                          </div>
                          <div className="absolute left-0 top-0 w-1 h-full bg-white/0 group-hover:bg-white/20 cursor-ew-resize transition-colors" />
                          <div className="absolute right-0 top-0 w-1 h-full bg-white/0 group-hover:bg-white/20 cursor-ew-resize transition-colors" />
                        </motion.div>
                      ))}
                    </div>
                  ))}

                  {/* Playhead */}
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
          <span className="text-[10px] font-mono text-txt-3">
            播放头：{formatTime(playheadPos)}
          </span>
          <span className="text-[10px] font-mono text-txt-3">
            总时长：{formatTime(TOTAL_DURATION)}
          </span>
        </div>

        {/* Audio config panel (collapsible) */}
        <div className="mt-4 rounded-xl bg-panel border border-edge overflow-hidden">
          <button
            onClick={() => setAudioPanelOpen(!audioPanelOpen)}
            className="w-full flex items-center justify-between p-3 hover:bg-raised transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <SpeakerHigh size={16} className="text-gold" />
              <span className="text-sm font-heading font-semibold text-txt">
                音频配置
              </span>
            </div>
            {audioPanelOpen ? (
              <CaretUp size={14} className="text-txt-3" />
            ) : (
              <CaretDown size={14} className="text-txt-3" />
            )}
          </button>

          {audioPanelOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              className="border-t border-edge"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
                {/* Voice */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <SpeakerHigh size={14} className="text-gold" />
                    <h3 className="text-xs font-heading font-semibold text-txt">
                      语音合成
                    </h3>
                  </div>
                  <div className="space-y-1.5">
                    {MOCK_VOICES.map((voice) => {
                      const isActive = voice.id === selectedVoice;
                      return (
                        <div
                          key={voice.id}
                          onClick={() => setSelectedVoice(voice.id)}
                          className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all border ${
                            isActive
                              ? "bg-gold/8 border-gold/30"
                              : "bg-inset border-edge hover:border-edge-2"
                          }`}
                        >
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-heading font-bold ${
                              isActive
                                ? "bg-gold/20 text-gold"
                                : "bg-raised text-txt-2"
                            }`}
                          >
                            {voice.name[0]}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-xs font-medium ${isActive ? "text-gold" : "text-txt"}`}
                            >
                              {voice.name}
                            </p>
                            <p className="text-[9px] text-txt-3">
                              {voice.style}
                            </p>
                          </div>
                          {isActive && (
                            <CheckCircle
                              size={14}
                              className="text-gold"
                              weight="fill"
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Music */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <MusicNote size={14} className="text-gold" />
                    <h3 className="text-xs font-heading font-semibold text-txt">
                      背景配乐
                    </h3>
                  </div>
                  <div className="space-y-1.5">
                    {MOCK_MUSIC.slice(0, 4).map((track) => {
                      const isSelected = track.id === selectedMusic;
                      const isPlayingThis = track.id === playingMusic;
                      return (
                        <div
                          key={track.id}
                          onClick={() => setSelectedMusic(track.id)}
                          className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all border ${
                            isSelected
                              ? "bg-gold/8 border-gold/30"
                              : "bg-inset border-edge hover:border-edge-2"
                          }`}
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setPlayingMusic(
                                isPlayingThis ? null : track.id
                              );
                            }}
                            className="text-txt-3 hover:text-txt transition-colors cursor-pointer"
                          >
                            {isPlayingThis ? (
                              <Pause size={10} weight="fill" />
                            ) : (
                              <Play size={10} weight="fill" />
                            )}
                          </button>
                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-xs font-medium ${isSelected ? "text-gold" : "text-txt"}`}
                            >
                              {track.name}
                            </p>
                            <p className="text-[9px] text-txt-3">
                              {track.genre} · {track.mood}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* SFX */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Waveform size={14} className="text-gold" />
                    <h3 className="text-xs font-heading font-semibold text-txt">
                      音效库
                    </h3>
                  </div>
                  <div className="space-y-1">
                    {MOCK_SFX.map((sfx) => (
                      <div
                        key={sfx.id}
                        className="flex items-center gap-2 p-1.5 rounded-lg bg-inset border border-edge hover:border-edge-2 transition-colors cursor-pointer group"
                      >
                        <button className="p-0.5 rounded bg-raised text-txt-3 group-hover:text-gold transition-colors cursor-pointer">
                          <Play size={8} weight="fill" />
                        </button>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] text-txt truncate">
                            {sfx.name}
                          </p>
                          <p className="text-[9px] text-txt-3">
                            {sfx.category} · {sfx.duration}秒
                          </p>
                        </div>
                        <GlowButton variant="ghost" size="sm">
                          添加
                        </GlowButton>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Subtitles */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Subtitles size={14} className="text-gold" />
                    <h3 className="text-xs font-heading font-semibold text-txt">
                      字幕样式
                    </h3>
                  </div>
                  <div className="h-20 rounded-lg bg-base border border-edge mb-3 flex items-end justify-center p-3 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-inset/50 to-base" />
                    <p
                      className={`relative text-xs text-center px-3 py-1 rounded-md ${subtitlePosition === "bottom" ? "self-end" : "self-start"}`}
                      style={{
                        fontFamily:
                          subtitleFont === "sora"
                            ? "var(--font-heading)"
                            : subtitleFont === "mono"
                              ? "var(--font-mono)"
                              : "var(--font-body)",
                        backgroundColor: "rgba(0,0,0,0.7)",
                      }}
                    >
                      <span className="text-white">
                        我们都是瘟疫幸存者的后裔。
                      </span>
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <label className="text-[9px] font-mono text-txt-3 uppercase tracking-wider block mb-1">
                        字体
                      </label>
                      <div className="flex gap-1">
                        {[
                          { id: "sora", label: "Sora" },
                          { id: "dm", label: "DM" },
                          { id: "mono", label: "等宽" },
                        ].map((font) => (
                          <button
                            key={font.id}
                            onClick={() => setSubtitleFont(font.id)}
                            className={`px-2 py-1 rounded text-[10px] font-medium transition-all border cursor-pointer ${
                              subtitleFont === font.id
                                ? "bg-gold/15 text-gold border-gold/30"
                                : "bg-inset text-txt-2 border-edge hover:border-edge-2"
                            }`}
                          >
                            {font.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-[9px] font-mono text-txt-3 uppercase tracking-wider block mb-1">
                        位置
                      </label>
                      <div className="flex gap-1">
                        {[
                          { id: "bottom", label: "底部" },
                          { id: "top", label: "顶部" },
                        ].map((pos) => (
                          <button
                            key={pos.id}
                            onClick={() => setSubtitlePosition(pos.id)}
                            className={`px-2 py-1 rounded text-[10px] font-medium transition-all border cursor-pointer ${
                              subtitlePosition === pos.id
                                ? "bg-gold/15 text-gold border-gold/30"
                                : "bg-inset text-txt-2 border-edge hover:border-edge-2"
                            }`}
                          >
                            {pos.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
