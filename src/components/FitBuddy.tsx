import React, { useState, useEffect } from 'react';
import {
  Dumbbell,
  Sparkles,
  Flame,
  Timer,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  Apple,
  RefreshCw,
  HeartPulse,
  Award,
} from 'lucide-react';

const GOALS = [
  'Lean Muscle Hypertrophy',
  'Fat Loss & Conditioning',
  'Calisthenics & Bodyweight Strength',
  'Athletic Endurance (5K/10K)',
  'Functional Mobility & Posture',
];

const EQUIPMENT_OPTIONS = [
  'Full Commercial Gym Access',
  'Home Dumbbells & Adjustable Bench',
  'Bodyweight & Pull-up Bar Only',
  'Resistance Bands & Kettlebell',
];

const DIET_PREFERENCES = [
  'High-Protein Balanced Omnivore',
  'Vegetarian (High Protein Dairy/Eggs)',
  'Plant-Based Vegan',
  'Keto / Low Carb',
  'Mediterranean Diet',
];

export const FitBuddy: React.FC = () => {
  const [goal, setGoal] = useState(GOALS[0]);
  const [level, setLevel] = useState('Intermediate');
  const [frequency, setFrequency] = useState<number>(4);
  const [equipment, setEquipment] = useState(EQUIPMENT_OPTIONS[0]);
  const [diet, setDiet] = useState(DIET_PREFERENCES[0]);
  const [limitations, setLimitations] = useState('Mild lower back tightness; avoid heavy spinal loading');

  const [loading, setLoading] = useState(false);
  const [planData, setPlanData] = useState<any | null>(null);
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Built-in Rest Timer state
  const [timerSeconds, setTimerSeconds] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [initialTimerSetting, setInitialTimerSetting] = useState(60);

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const startRestTimer = (seconds: number) => {
    setInitialTimerSetting(seconds);
    setTimerSeconds(seconds);
    setIsTimerRunning(true);
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/fitbuddy/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          primaryGoal: goal,
          fitnessLevel: level,
          daysPerWeek: frequency,
          equipment,
          dietaryPreference: diet,
          limitations,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      setPlanData(data);
      setActiveDayIndex(0);
    } catch (err: any) {
      setError(err.message || 'FitBuddy failed to generate routine');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-orange-600 via-rose-600 to-amber-700 text-white rounded-2xl p-6 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold mb-2">
              <Dumbbell className="w-3.5 h-3.5" />
              <span>Project #5: FitBuddy</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              AI Fitness Plan Generator using Gemini Models
            </h2>
            <p className="text-orange-100 text-sm mt-1 max-w-2xl">
              Creates personalized weekly training routines, exercise form coaching cues, daily macro-nutrient targets, and meal plans tailored to your specific gear and goals.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setGoal('Lean Muscle Hypertrophy');
                setEquipment(EQUIPMENT_OPTIONS[0]);
                setFrequency(4);
              }}
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-xs px-3 py-1.5 rounded-lg transition"
            >
              🏋️ 4-Day Muscle Split
            </button>
            <button
              onClick={() => {
                setGoal('Fat Loss & Conditioning');
                setEquipment(EQUIPMENT_OPTIONS[1]);
                setFrequency(3);
              }}
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-xs px-3 py-1.5 rounded-lg transition"
            >
              🔥 Home Dumbbells
            </button>
            <button
              onClick={() => {
                setGoal('Calisthenics & Bodyweight Strength');
                setEquipment(EQUIPMENT_OPTIONS[2]);
                setFrequency(4);
              }}
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-xs px-3 py-1.5 rounded-lg transition"
            >
              🤸 Calisthenics
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Profile & Setup (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-rose-600" />
              Fitness Profile Setup
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Primary Goal
              </label>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-2 text-slate-800 font-medium"
              >
                {GOALS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Experience Level
                </label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-2 text-slate-800 font-medium"
                >
                  {['Beginner (< 1 yr)', 'Intermediate (1-3 yrs)', 'Advanced (3+ yrs)'].map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Days Per Week
                </label>
                <div className="flex gap-1.5">
                  {[3, 4, 5, 6].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setFrequency(num)}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition ${
                        frequency === num
                          ? 'bg-rose-50 border-rose-600 text-rose-700'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {num}d
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Available Equipment
              </label>
              <select
                value={equipment}
                onChange={(e) => setEquipment(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-2 text-slate-800 font-medium"
              >
                {EQUIPMENT_OPTIONS.map((eq) => (
                  <option key={eq} value={eq}>
                    {eq}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Dietary Preference / Nutrition
              </label>
              <select
                value={diet}
                onChange={(e) => setDiet(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-2 text-slate-800 font-medium"
              >
                {DIET_PREFERENCES.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Injuries / Physical Limitations
              </label>
              <input
                type="text"
                value={limitations}
                onChange={(e) => setLimitations(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                placeholder="e.g. Bad right knee, shoulder impingement, none"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 via-rose-600 to-amber-600 hover:from-orange-700 hover:to-rose-700 text-white font-bold text-sm py-2.5 rounded-xl shadow-md transition disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Programming Workout with Gemini...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Customized Fitness Plan</span>
                </>
              )}
            </button>
          </div>

          {/* Interactive Rest Timer Card */}
          <div className="bg-slate-900 text-white rounded-xl p-4 border border-slate-800 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center">
                <Timer className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Rest Interval Timer
                </span>
                <span className="text-xl font-mono font-black text-rose-400">
                  {Math.floor(timerSeconds / 60)}:
                  {(timerSeconds % 60).toString().padStart(2, '0')}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="p-2 bg-rose-600 hover:bg-rose-700 rounded-lg text-white transition"
                title={isTimerRunning ? 'Pause' : 'Start'}
              >
                {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <button
                onClick={() => {
                  setIsTimerRunning(false);
                  setTimerSeconds(initialTimerSetting);
                }}
                className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition"
                title="Reset"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => startRestTimer(45)}
                  className="text-[10px] bg-slate-800 hover:bg-slate-700 px-1.5 py-0.5 rounded text-slate-300"
                >
                  45s
                </button>
                <button
                  onClick={() => startRestTimer(90)}
                  className="text-[10px] bg-slate-800 hover:bg-slate-700 px-1.5 py-0.5 rounded text-slate-300"
                >
                  90s
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Output: Weekly Routine & Nutrition (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-xs flex items-center gap-2">
              <span>{error}</span>
            </div>
          )}

          {!planData && !loading && (
            <div className="bg-white rounded-xl border border-dashed border-slate-300 p-8 text-center flex flex-col items-center justify-center min-h-[500px]">
              <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mb-3">
                <Dumbbell className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold text-slate-800">Your AI Fitness Coach is Ready</h4>
              <p className="text-xs text-slate-500 max-w-sm mt-1 mb-5">
                Select your goals, equipment, and training frequency to generate an evidence-based training split, exercise form cues, and macro recommendations.
              </p>
              <button
                onClick={handleGenerate}
                className="inline-flex items-center gap-1.5 text-xs font-semibold bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-700 transition"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Build Plan with FitBuddy
              </button>
            </div>
          )}

          {loading && (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center flex flex-col items-center justify-center min-h-[500px]">
              <div className="relative mb-4">
                <div className="w-14 h-14 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin"></div>
                <Flame className="w-5 h-5 text-rose-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <h4 className="text-base font-bold text-slate-800">FitBuddy is Programming Your Routine...</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                Balancing push/pull volume, scheduling progressive overload, and calculating daily macro-nutrients.
              </p>
            </div>
          )}

          {planData && !loading && (
            <div className="space-y-4">
              {/* Plan Header & Daily Macro Target Ribbon */}
              <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-5 rounded-xl shadow-sm space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-rose-400 tracking-wider">
                      Personalized Program
                    </span>
                    <h3 className="text-lg font-extrabold text-white">{planData.programName}</h3>
                  </div>
                  <span className="text-xs bg-white/10 border border-white/10 px-2.5 py-1 rounded-full text-slate-300">
                    {frequency} Days / Week
                  </span>
                </div>

                {/* Macro Target Gauge */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
                  <div className="bg-black/30 p-2 rounded-lg border border-white/5">
                    <span className="text-[10px] text-slate-400 block">Calories</span>
                    <span className="font-bold text-amber-300 text-sm">
                      {planData.targetMetrics?.dailyCalories} kcal
                    </span>
                  </div>
                  <div className="bg-black/30 p-2 rounded-lg border border-white/5">
                    <span className="text-[10px] text-slate-400 block">Protein</span>
                    <span className="font-bold text-rose-400 text-sm">
                      {planData.targetMetrics?.proteinGrams}g
                    </span>
                  </div>
                  <div className="bg-black/30 p-2 rounded-lg border border-white/5">
                    <span className="text-[10px] text-slate-400 block">Carbs</span>
                    <span className="font-bold text-sky-400 text-sm">
                      {planData.targetMetrics?.carbsGrams}g
                    </span>
                  </div>
                  <div className="bg-black/30 p-2 rounded-lg border border-white/5">
                    <span className="text-[10px] text-slate-400 block">Healthy Fat</span>
                    <span className="font-bold text-emerald-400 text-sm">
                      {planData.targetMetrics?.fatGrams}g
                    </span>
                  </div>
                  <div className="bg-black/30 p-2 rounded-lg border border-white/5 col-span-2 sm:col-span-1">
                    <span className="text-[10px] text-slate-400 block">Hydration</span>
                    <span className="font-bold text-cyan-300 text-sm">
                      {planData.targetMetrics?.hydrationLiters} L/day
                    </span>
                  </div>
                </div>
              </div>

              {/* Weekly Day Tabs */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="flex border-b border-slate-200 bg-slate-50 overflow-x-auto p-1.5 gap-1">
                  {planData.weeklyRoutine?.map((day: any, dIdx: number) => (
                    <button
                      key={dIdx}
                      onClick={() => setActiveDayIndex(dIdx)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg whitespace-nowrap transition ${
                        activeDayIndex === dIdx
                          ? 'bg-white text-rose-600 shadow-sm border border-slate-200'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {day.dayLabel}
                    </button>
                  ))}
                </div>

                {/* Day Details */}
                {planData.weeklyRoutine && planData.weeklyRoutine[activeDayIndex] && (
                  <div className="p-5 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">
                          {planData.weeklyRoutine[activeDayIndex].dayLabel}
                        </h4>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {planData.weeklyRoutine[activeDayIndex].focusMuscles?.map(
                            (m: string, i: number) => (
                              <span
                                key={i}
                                className="bg-slate-100 text-slate-700 text-[10px] px-2 py-0.5 rounded font-medium"
                              >
                                {m}
                              </span>
                            )
                          )}
                        </div>
                      </div>

                      <div className="text-xs text-slate-500">
                        Warmup: <span className="font-semibold text-slate-800">{planData.weeklyRoutine[activeDayIndex].warmup}</span>
                      </div>
                    </div>

                    {/* Exercises Table */}
                    <div className="space-y-2">
                      {planData.weeklyRoutine[activeDayIndex].exercises?.map(
                        (ex: any, exIdx: number) => (
                          <div
                            key={exIdx}
                            className="p-3 bg-slate-50 border border-slate-200 rounded-lg hover:border-slate-300 transition text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                          >
                            <div className="space-y-0.5">
                              <span className="font-bold text-slate-900 text-sm block">
                                {exIdx + 1}. {ex.name}
                              </span>
                              <p className="text-slate-500 text-[11px]">
                                🎯 Form Cue: <span className="text-slate-700 font-medium">{ex.formCue}</span>
                              </p>
                            </div>

                            <div className="flex items-center gap-3 shrink-0">
                              <span className="bg-white border border-slate-200 px-2.5 py-1 rounded text-slate-800 font-bold">
                                {ex.sets} sets × {ex.reps}
                              </span>
                              <button
                                onClick={() => startRestTimer(ex.restSeconds || 60)}
                                className="inline-flex items-center gap-1 text-[11px] bg-rose-50 text-rose-700 font-semibold px-2 py-1 rounded hover:bg-rose-100 transition"
                                title="Click to start rest timer"
                              >
                                <Timer className="w-3 h-3" />
                                <span>{ex.restSeconds}s rest</span>
                              </button>
                            </div>
                          </div>
                        )
                      )}
                    </div>

                    <div className="bg-emerald-50 border border-emerald-100 text-emerald-900 p-2.5 rounded-lg text-xs flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>
                        <strong>Cooldown:</strong> {planData.weeklyRoutine[activeDayIndex].cooldown}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Nutrition Meal Ideas */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Apple className="w-4 h-4 text-emerald-600" />
                  Target Fuel & Meal Plan
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {planData.nutritionMealIdeas?.map((meal: any, idx: number) => (
                    <div key={idx} className="bg-slate-50 border border-slate-200 p-3 rounded-lg text-xs space-y-1">
                      <div className="flex items-center justify-between font-bold text-slate-900">
                        <span>{meal.meal}</span>
                        <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded">
                          {meal.macrosSummary}
                        </span>
                      </div>
                      <p className="text-slate-600 text-[11px]">{meal.idea}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
