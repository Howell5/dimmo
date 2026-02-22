import { useState } from "react";
import { motion } from "framer-motion";
import { SpeakerHigh, MusicNote, Waveform, Subtitles, CheckCircle, Play, Pause } from "@phosphor-icons/react";
import { MOCK_VOICES, MOCK_MUSIC, MOCK_SFX } from "../../data/mockData";
import { GlowButton } from "../shared/GlowButton";

export function MultimodalIntegration() {
  const [selectedVoice, setSelectedVoice] = useState("v1");
  const [selectedMusic, setSelectedMusic] = useState<string | null>("mus1");
  const [playingMusic, setPlayingMusic] = useState<string | null>(null);
  const [subtitleFont, setSubtitleFont] = useState("sora");
  const [subtitlePosition, setSubtitlePosition] = useState("bottom");

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto space-y-6">
        <div>
          <h2 className="text-xl font-heading font-semibold text-txt mb-1 flex items-center gap-2">
            <SpeakerHigh size={22} className="text-gold" weight="fill" />
            多模态集成
          </h2>
          <p className="text-sm text-txt-2">配置语音、配乐、音效与字幕。</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Voice */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="p-5 rounded-xl bg-panel border border-edge">
            <div className="flex items-center gap-2 mb-4">
              <SpeakerHigh size={16} className="text-gold" />
              <h3 className="text-sm font-heading font-semibold text-txt">语音合成</h3>
            </div>
            <div className="space-y-2">
              {MOCK_VOICES.map((voice) => {
                const isActive = voice.id === selectedVoice;
                return (
                  <motion.div key={voice.id} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                    onClick={() => setSelectedVoice(voice.id)}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all border ${
                      isActive ? "bg-gold/8 border-gold/30" : "bg-inset border-edge hover:border-edge-2"
                    }`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-heading font-bold ${isActive ? "bg-gold/20 text-gold" : "bg-raised text-txt-2"}`}>
                      {voice.name[0]}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${isActive ? "text-gold" : "text-txt"}`}>{voice.name}</p>
                      <p className="text-[10px] text-txt-3">{voice.style} · {voice.language}</p>
                    </div>
                    {isActive && <CheckCircle size={18} className="text-gold" weight="fill" />}
                    <button className="p-1.5 rounded-md hover:bg-base/50 text-txt-3 hover:text-txt transition-colors cursor-pointer">
                      <Play size={12} weight="fill" />
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Music */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="p-5 rounded-xl bg-panel border border-edge">
            <div className="flex items-center gap-2 mb-4">
              <MusicNote size={16} className="text-gold" />
              <h3 className="text-sm font-heading font-semibold text-txt">背景配乐</h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {MOCK_MUSIC.map((track) => {
                const isSelected = track.id === selectedMusic;
                const isPlayingThis = track.id === playingMusic;
                return (
                  <motion.div key={track.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedMusic(track.id)}
                    className={`p-3 rounded-lg cursor-pointer transition-all border ${
                      isSelected ? "bg-gold/8 border-gold/30" : "bg-inset border-edge hover:border-edge-2"
                    }`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs font-medium ${isSelected ? "text-gold" : "text-txt"}`}>{track.name}</span>
                      <button onClick={(e) => { e.stopPropagation(); setPlayingMusic(isPlayingThis ? null : track.id); }}
                        className="text-txt-3 hover:text-txt transition-colors cursor-pointer">
                        {isPlayingThis ? <Pause size={12} weight="fill" /> : <Play size={12} weight="fill" />}
                      </button>
                    </div>
                    <p className="text-[10px] text-txt-3">{track.genre} · {track.bpm} BPM</p>
                    <p className="text-[10px] text-txt-3 mt-0.5">{track.mood}</p>
                    <div className="flex items-end gap-px mt-2 h-4">
                      {Array.from({ length: 16 }, (_, i) => (
                        <motion.div key={i}
                          className={`flex-1 rounded-sm ${isPlayingThis ? "bg-gold" : isSelected ? "bg-gold/40" : "bg-txt-3/20"}`}
                          initial={{ height: 2 }}
                          animate={{ height: isPlayingThis ? Math.random() * 14 + 2 : Math.sin(i * 0.8) * 6 + 4 }}
                          transition={{ duration: isPlayingThis ? 0.3 : 0, repeat: isPlayingThis ? Infinity : 0, repeatType: "reverse" }}
                        />
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* SFX */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="p-5 rounded-xl bg-panel border border-edge">
            <div className="flex items-center gap-2 mb-4">
              <Waveform size={16} className="text-gold" />
              <h3 className="text-sm font-heading font-semibold text-txt">音效库</h3>
            </div>
            <div className="space-y-1.5">
              {MOCK_SFX.map((sfx, i) => (
                <motion.div key={sfx.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.04 }}
                  className="flex items-center gap-3 p-2.5 rounded-lg bg-inset border border-edge hover:border-edge-2 transition-colors cursor-pointer group">
                  <button className="p-1 rounded bg-raised text-txt-3 group-hover:text-gold transition-colors cursor-pointer">
                    <Play size={10} weight="fill" />
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-txt truncate">{sfx.name}</p>
                    <p className="text-[10px] text-txt-3">{sfx.category} · {sfx.duration}秒</p>
                  </div>
                  <GlowButton variant="ghost" size="sm">添加</GlowButton>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Subtitles */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="p-5 rounded-xl bg-panel border border-edge">
            <div className="flex items-center gap-2 mb-4">
              <Subtitles size={16} className="text-gold" />
              <h3 className="text-sm font-heading font-semibold text-txt">字幕样式</h3>
            </div>
            <div className="h-32 rounded-lg bg-base border border-edge mb-4 flex items-end justify-center p-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-inset/50 to-base" />
              <motion.p key={`${subtitleFont}-${subtitlePosition}`} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                className={`relative text-sm text-center px-4 py-1.5 rounded-md ${subtitlePosition === "bottom" ? "self-end" : "self-start"}`}
                style={{ fontFamily: subtitleFont === "sora" ? "var(--font-heading)" : subtitleFont === "mono" ? "var(--font-mono)" : "var(--font-body)", backgroundColor: "rgba(0,0,0,0.7)" }}>
                <span className="text-white">我们都是瘟疫幸存者的后裔。</span>
              </motion.p>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-mono text-txt-3 uppercase tracking-wider block mb-1.5">字体</label>
                <div className="flex gap-2">
                  {[{ id: "sora", label: "Sora" }, { id: "dm", label: "DM Sans" }, { id: "mono", label: "等宽" }].map((font) => (
                    <button key={font.id} onClick={() => setSubtitleFont(font.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border cursor-pointer ${
                        subtitleFont === font.id ? "bg-gold/15 text-gold border-gold/30" : "bg-inset text-txt-2 border-edge hover:border-edge-2"
                      }`}>{font.label}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[10px] font-mono text-txt-3 uppercase tracking-wider block mb-1.5">位置</label>
                <div className="flex gap-2">
                  {[{ id: "bottom", label: "底部" }, { id: "top", label: "顶部" }].map((pos) => (
                    <button key={pos.id} onClick={() => setSubtitlePosition(pos.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border cursor-pointer ${
                        subtitlePosition === pos.id ? "bg-gold/15 text-gold border-gold/30" : "bg-inset text-txt-2 border-edge hover:border-edge-2"
                      }`}>{pos.label}</button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
