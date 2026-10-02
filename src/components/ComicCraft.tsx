import React, { useState } from 'react';
import {
  Sparkles,
  Tv,
  Camera,
  MessageSquare,
  Volume2,
  Copy,
  Check,
  RefreshCw,
  Palette,
  Users,
  Eye,
  Film,
  Download,
} from 'lucide-react';

const GENRES = [
  'Superhero & Action',
  'Cyberpunk & Sci-Fi',
  'Manga & Shonen Battle',
  'Dark Noir Detective',
  'High Fantasy & Mythos',
  'Campus Life & Comedy',
  'Post-Apocalyptic Survival',
];

const ART_STYLES = [
  'Modern American Superhero (Jim Lee / Marvel Style)',
  'Classic Shonen Manga (High-contrast Pen & Ink)',
  'Dark Graphic Novel Noir (Frank Miller Sin City Style)',
  'Cyberpunk Neon Halftone (Vibrant Glitch & Grain)',
  'Retro 1960s Pop Art (Roy Lichtenstein Ben-Day Dots)',
  'European Bande Dessinée (Moebius Clear Line)',
];

export const ComicCraft: React.FC = () => {
  const [premise, setPremise] = useState(
    'A rogue student programmer discovers that their college AI server has achieved consciousness and is rewriting university campus reality overnight.'
  );
  const [genre, setGenre] = useState(GENRES[1]);
  const [artStyle, setArtStyle] = useState(ART_STYLES[3]);
  const [panelCount, setPanelCount] = useState<number>(4);
  const [targetAudience, setTargetAudience] = useState('Young Adult (16+)');

  const [loading, setLoading] = useState(false);
  const [comicData, setComicData] = useState<any | null>(null);
  const [copiedPromptIndex, setCopiedPromptIndex] = useState<number | null>(null);
  const [copiedScript, setCopiedScript] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPreset = (preset: 'cyber' | 'superhero' | 'comedy') => {
    if (preset === 'cyber') {
      setPremise('In Neo-Chennai 2088, an underground cyber-mechanic finds a deactivated delivery drone containing the memory core of a vanished quantum physicist.');
      setGenre('Cyberpunk & Sci-Fi');
      setArtStyle('Cyberpunk Neon Halftone (Vibrant Glitch & Grain)');
      setPanelCount(4);
    } else if (preset === 'superhero') {
      setPremise('An introverted library archivist touches an ancient meteorite fragment and gains the ability to manipulate gravity, just as an earthquake strikes the metropolitan museum.');
      setGenre('Superhero & Action');
      setArtStyle('Modern American Superhero (Jim Lee / Marvel Style)');
      setPanelCount(4);
    } else if (preset === 'comedy') {
      setPremise('Two roommates accidentally train their smart microwave to give philosophical life advice, and it starts charging fellow dorm residents 50 cents per profound insight.');
      setGenre('Campus Life & Comedy');
      setArtStyle('Classic Shonen Manga (High-contrast Pen & Ink)');
      setPanelCount(4);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/comiccraft/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          premise,
          genre,
          artStyle,
          panelCount,
          targetAudience,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      setComicData(data);
    } catch (err: any) {
      setError(err.message || 'Failed to generate comic story');
    } finally {
      setLoading(false);
    }
  };

  const copyImagePrompt = (prompt: string, idx: number) => {
    navigator.clipboard.writeText(prompt);
    setCopiedPromptIndex(idx);
    setTimeout(() => setCopiedPromptIndex(null), 2000);
  };

  const copyFullScript = () => {
    if (!comicData) return;
    const text = `# ${comicData.title}
*${comicData.tagline}*
Genre: ${comicData.genre}
Art Style: ${comicData.artStyleGuide}

## Characters:
${comicData.characters?.map((c: any) => `- **${c.name}** (${c.role}): ${c.visualAppearance}`).join('\n')}

## Panels:
${comicData.panels
  ?.map(
    (p: any) => `### Panel ${p.panelNumber} [${p.cameraShot}]
**Scene:** ${p.sceneDescription}
**Mood & Lighting:** ${p.moodAndLighting}
${p.narrationBox ? `**Narration:** "${p.narrationBox}"\n` : ''}
${p.dialogue?.map((d: any) => `**${d.speaker}** (${d.balloonType}): "${d.text}"`).join('\n')}
${p.soundEffects?.length ? `**SFX:** ${p.soundEffects.join(', ')}` : ''}
**AI Image Prompt:** \`${p.imageGenerationPrompt}\`
`
  )
  .join('\n---\n')}
`;
    navigator.clipboard.writeText(text);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-purple-800 via-pink-700 to-amber-600 text-white rounded-2xl p-6 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Project #3: ComicCraft</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              AI Comic Story & Visual Strip Creator
            </h2>
            <p className="text-purple-100 text-sm mt-1 max-w-2xl">
              Turn any narrative hook into an episodic multi-panel comic book script complete with camera choreography, stylized dialogue balloons, onomatopoeic sound effects, and ready-to-use GenAI image prompts.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => loadPreset('cyber')}
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-xs px-3 py-1.5 rounded-lg transition"
            >
              ⚡ Neo-Cyberpunk
            </button>
            <button
              onClick={() => loadPreset('superhero')}
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-xs px-3 py-1.5 rounded-lg transition"
            >
              🦸 Superhero Origin
            </button>
            <button
              onClick={() => loadPreset('comedy')}
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-xs px-3 py-1.5 rounded-lg transition"
            >
              😂 Smart Appliance
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Config (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Palette className="w-4 h-4 text-purple-600" />
              Comic Story Parameters
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Story Premise / Plot Hook
              </label>
              <textarea
                rows={4}
                value={premise}
                onChange={(e) => setPremise(e.target.value)}
                className="w-full p-2.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-slate-800"
                placeholder="Describe your scene, protagonist dilemma, or comic concept..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Genre
                </label>
                <select
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-2 text-slate-800 font-medium"
                >
                  {GENRES.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Panel Count
                </label>
                <div className="flex gap-2">
                  {[3, 4, 5, 6].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setPanelCount(num)}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition ${
                        panelCount === num
                          ? 'bg-purple-50 border-purple-600 text-purple-700'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Visual Art Style
              </label>
              <select
                value={artStyle}
                onChange={(e) => setArtStyle(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-2 text-slate-800 font-medium"
              >
                {ART_STYLES.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Target Audience
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['All Ages', 'Young Adult (16+)', 'Mature Sci-Fi'].map((aud) => (
                  <button
                    key={aud}
                    type="button"
                    onClick={() => setTargetAudience(aud)}
                    className={`py-1.5 px-2 text-[10px] font-semibold rounded-lg border transition ${
                      targetAudience === aud
                        ? 'bg-purple-50 border-purple-600 text-purple-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {aud}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 via-pink-600 to-amber-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-sm py-2.5 rounded-xl shadow-md transition disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Storyboarding with Gemini...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Comic Story & Panels</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Output: Comic Board (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-xs flex items-center gap-2">
              <span>{error}</span>
            </div>
          )}

          {!comicData && !loading && (
            <div className="bg-white rounded-xl border border-dashed border-slate-300 p-8 text-center flex flex-col items-center justify-center min-h-[500px]">
              <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-3">
                <Tv className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold text-slate-800">Comic Studio Ready</h4>
              <p className="text-xs text-slate-500 max-w-sm mt-1 mb-5">
                Set your premise and genre, then click generate to create a dynamic multi-panel strip with camera shots, dialogue balloons, and image prompts.
              </p>
              <button
                onClick={handleGenerate}
                className="inline-flex items-center gap-1.5 text-xs font-semibold bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Generate Comic Strip
              </button>
            </div>
          )}

          {loading && (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center flex flex-col items-center justify-center min-h-[500px]">
              <div className="relative mb-4">
                <div className="w-14 h-14 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                <Film className="w-5 h-5 text-purple-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <h4 className="text-base font-bold text-slate-800">ComicCraft is Drawing the Narrative...</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                Choreographing camera angles, placing dialogue bubbles, and drafting onomatopoeic SFX with Gemini 3.8.
              </p>
            </div>
          )}

          {comicData && !loading && (
            <div className="space-y-4">
              {/* Comic Header Banner */}
              <div className="bg-gradient-to-r from-slate-950 via-purple-950 to-slate-900 border-4 border-black p-5 rounded-2xl text-white shadow-xl relative overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-amber-400 text-black font-extrabold text-[10px] px-2 py-0.5 uppercase tracking-widest rounded-sm transform -rotate-1">
                        ISSUE #1
                      </span>
                      <span className="text-xs text-purple-300 font-semibold">{comicData.genre}</span>
                    </div>
                    <h3 className="text-2xl font-black tracking-tight text-white uppercase italic drop-shadow-md">
                      {comicData.title}
                    </h3>
                    <p className="text-xs text-slate-300 mt-0.5">{comicData.tagline}</p>
                  </div>

                  <button
                    onClick={copyFullScript}
                    className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-xs px-3 py-1.5 rounded-lg text-white transition font-medium"
                  >
                    {copiedScript ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedScript ? 'Script Copied' : 'Copy Full Script'}</span>
                  </button>
                </div>

                {/* Character roster */}
                <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap gap-2">
                  {comicData.characters?.map((char: any, i: number) => (
                    <div
                      key={i}
                      className="bg-black/40 border border-white/10 rounded-lg px-2.5 py-1 text-[11px] max-w-xs"
                    >
                      <strong className="text-amber-300">{char.name}</strong>{' '}
                      <span className="text-slate-400">({char.role}):</span>{' '}
                      <span className="text-slate-200">{char.visualAppearance}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Multi-Panel Grid */}
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
                {comicData.panels?.map((panel: any, idx: number) => (
                  <div
                    key={idx}
                    className="bg-white border-2 border-slate-900 rounded-xl shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] p-4 space-y-3 relative overflow-hidden"
                  >
                    {/* Top Panel bar */}
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="bg-slate-900 text-white font-extrabold text-xs px-2.5 py-0.5 rounded">
                          PANEL {panel.panelNumber}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                          <Camera className="w-3 h-3 text-purple-600" />
                          {panel.cameraShot}
                        </span>
                      </div>

                      {/* Sound Effects Badges */}
                      <div className="flex items-center gap-1.5">
                        {panel.soundEffects?.map((sfx: string, sIdx: number) => (
                          <span
                            key={sIdx}
                            className="bg-yellow-300 border border-black font-black text-[11px] text-black px-2 py-0.5 transform rotate-2 uppercase tracking-wider shadow-sm"
                          >
                            💥 {sfx}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Scene and lighting description */}
                    <div className="text-xs text-slate-700 space-y-1">
                      <p className="font-semibold text-slate-900">{panel.sceneDescription}</p>
                      <p className="text-[11px] text-slate-500 italic">
                        Lighting & Tone: {panel.moodAndLighting}
                      </p>
                    </div>

                    {/* Narration Box if present */}
                    {panel.narrationBox && (
                      <div className="bg-amber-50 border border-amber-300 text-amber-950 p-2 rounded text-xs font-serif italic">
                        {panel.narrationBox}
                      </div>
                    )}

                    {/* Dialogue Bubbles */}
                    <div className="space-y-2 pt-1">
                      {panel.dialogue?.map((dia: any, dIdx: number) => {
                        const isShout = dia.balloonType?.toLowerCase().includes('shout');
                        const isThought = dia.balloonType?.toLowerCase().includes('thought');
                        return (
                          <div
                            key={dIdx}
                            className={`p-2.5 rounded-xl border text-xs relative ${
                              isShout
                                ? 'bg-red-50 border-red-300 text-red-950 font-bold'
                                : isThought
                                ? 'bg-sky-50 border-dashed border-sky-300 text-sky-950 italic'
                                : 'bg-slate-50 border-slate-300 text-slate-900'
                            }`}
                          >
                            <span className="font-extrabold uppercase text-[10px] text-purple-700 block mb-0.5">
                              {dia.speaker} [{dia.balloonType}]:
                            </span>
                            <span className="text-xs">{dia.text}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* AI Image Generation Prompt Box */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 bg-slate-50 p-2.5 rounded-lg">
                      <div className="flex-1 truncate">
                        <span className="text-[10px] font-bold text-slate-500 uppercase block">
                          AI Image Prompt:
                        </span>
                        <code className="text-[11px] text-slate-800 font-mono truncate block">
                          {panel.imageGenerationPrompt}
                        </code>
                      </div>
                      <button
                        onClick={() => copyImagePrompt(panel.imageGenerationPrompt, idx)}
                        className="p-1.5 text-slate-600 hover:text-purple-600 bg-white border border-slate-300 rounded text-xs font-medium inline-flex items-center gap-1 shrink-0"
                      >
                        {copiedPromptIndex === idx ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        <span>{copiedPromptIndex === idx ? 'Copied' : 'Copy Prompt'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
