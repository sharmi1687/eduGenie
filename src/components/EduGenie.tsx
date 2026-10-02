import React, { useState } from 'react';
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  Brain,
  HelpCircle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  RefreshCw,
  Award,
  ArrowRight,
  Lightbulb,
} from 'lucide-react';
import confetti from 'canvas-confetti';

const SAMPLE_TOPICS = [
  'Attention Mechanism & Transformers in AI',
  'Quantum Superposition & Qubits',
  'CRISPR-Cas9 Gene Editing',
  'TCP/IP Three-Way Handshake',
  'Gradient Descent & Loss Landscapes',
];

const GRADE_LEVELS = [
  'Beginner / ELI5 (Explain Like I am 5)',
  'High School (AP / A-Level)',
  'Undergraduate / College',
  'Senior Professional & Engineer',
];

export const EduGenie: React.FC = () => {
  const [topic, setTopic] = useState('Attention Mechanism & Transformers in AI');
  const [gradeLevel, setGradeLevel] = useState(GRADE_LEVELS[2]);
  const [technique, setTechnique] = useState('Feynman Technique');

  const [loading, setLoading] = useState(false);
  const [eduData, setEduData] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<'explain' | 'flashcards' | 'quiz'>('explain');
  const [error, setError] = useState<string | null>(null);

  // Flashcards state
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState<{ [qIdx: number]: number }>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const handleGenerate = async (customTopic?: string) => {
    const selectedTopic = customTopic || topic;
    setLoading(true);
    setError(null);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setCurrentCardIndex(0);
    setIsFlipped(false);

    try {
      const res = await fetch('/api/edugenie/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: selectedTopic,
          gradeLevel,
          technique,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      setEduData(data);
      setActiveTab('explain');
    } catch (err: any) {
      setError(err.message || 'EduGenie failed to generate lesson');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectQuizAnswer = (qIdx: number, optIdx: number) => {
    if (quizSubmitted) return;
    setQuizAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleSubmitQuiz = () => {
    setQuizSubmitted(true);
    if (!eduData?.quiz) return;

    let correctCount = 0;
    eduData.quiz.forEach((q: any, i: number) => {
      if (quizAnswers[i] === q.correctIndex) {
        correctCount++;
      }
    });

    if (correctCount >= eduData.quiz.length * 0.75) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const calculateScore = () => {
    if (!eduData?.quiz) return { correct: 0, total: 0 };
    let correct = 0;
    eduData.quiz.forEach((q: any, i: number) => {
      if (quizAnswers[i] === q.correctIndex) correct++;
    });
    return { correct, total: eduData.quiz.length };
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-teal-700 via-emerald-700 to-sky-700 text-white rounded-2xl p-6 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold mb-2">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Project #4: EduGenie</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Google Gemini Powered Learning Assistant
            </h2>
            <p className="text-teal-100 text-sm mt-1 max-w-2xl">
              Deconstructs complex concepts using the Feynman Technique, generates active-recall flashcard decks, and builds interactive practice quizzes with instant feedback.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {SAMPLE_TOPICS.slice(0, 3).map((sTopic) => (
              <button
                key={sTopic}
                onClick={() => {
                  setTopic(sTopic);
                  handleGenerate(sTopic);
                }}
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-xs px-3 py-1.5 rounded-lg transition"
              >
                ✨ {sTopic.split(' ')[0]}...
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Brain className="w-4 h-4 text-teal-600" />
              Study Setup
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Concept or Topic to Master
              </label>
              <textarea
                rows={3}
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full p-2.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 text-slate-800"
                placeholder="e.g. Gradient Descent, Photosynthesis, Recursion..."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Target Understanding Level
              </label>
              <select
                value={gradeLevel}
                onChange={(e) => setGradeLevel(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-2 text-slate-800 font-medium"
              >
                {GRADE_LEVELS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Instructional Method
              </label>
              <div className="space-y-1.5">
                {[
                  { id: 'Feynman Technique', desc: 'Everyday analogies & zero jargon' },
                  { id: 'First Principles', desc: 'Axiomatic mathematical breakdown' },
                  { id: 'Real-World Case Study', desc: 'Practical engineering applications' },
                ].map((item) => (
                  <label
                    key={item.id}
                    onClick={() => setTechnique(item.id)}
                    className={`flex items-start gap-2.5 p-2 rounded-lg border text-xs cursor-pointer transition ${
                      technique === item.id
                        ? 'bg-teal-50 border-teal-600 text-teal-900'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="tech"
                      checked={technique === item.id}
                      onChange={() => {}}
                      className="mt-0.5 text-teal-600 focus:ring-teal-500"
                    />
                    <div>
                      <strong className="block text-xs">{item.id}</strong>
                      <span className="text-[11px] text-slate-500">{item.desc}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={() => handleGenerate()}
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-sm py-2.5 rounded-xl shadow-md transition disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Synthesizing with Gemini...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Complete Learning Plan</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Output (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-xs flex items-center gap-2">
              <span>{error}</span>
            </div>
          )}

          {!eduData && !loading && (
            <div className="bg-white rounded-xl border border-dashed border-slate-300 p-8 text-center flex flex-col items-center justify-center min-h-[480px]">
              <div className="w-14 h-14 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center mb-3">
                <BookOpen className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold text-slate-800">Your AI Study Room Awaits</h4>
              <p className="text-xs text-slate-500 max-w-sm mt-1 mb-5">
                Enter any STEM or humanities topic to generate Feynman analogies, a comprehensive breakdown, study flashcards, and an active recall quiz.
              </p>
              <button
                onClick={() => handleGenerate()}
                className="inline-flex items-center gap-1.5 text-xs font-semibold bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Generate Sample Topic
              </button>
            </div>
          )}

          {loading && (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center flex flex-col items-center justify-center min-h-[480px]">
              <div className="relative mb-4">
                <div className="w-14 h-14 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div>
                <Brain className="w-5 h-5 text-teal-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <h4 className="text-base font-bold text-slate-800">EduGenie is Breaking Down the Concept...</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                Translating academic jargon into intuitive analogies and crafting practice flashcards.
              </p>
            </div>
          )}

          {eduData && !loading && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              {/* Output Tabs Header */}
              <div className="bg-slate-50 border-b border-slate-200 p-3 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setActiveTab('explain')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                      activeTab === 'explain'
                        ? 'bg-white text-teal-700 shadow-sm border border-slate-200'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    💡 Feynman Breakdown
                  </button>
                  <button
                    onClick={() => setActiveTab('flashcards')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition flex items-center gap-1 ${
                      activeTab === 'flashcards'
                        ? 'bg-white text-teal-700 shadow-sm border border-slate-200'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>🗂️ Flashcards</span>
                    <span className="text-[10px] bg-teal-100 text-teal-800 px-1.5 py-0.2 rounded-full">
                      {eduData.flashcards?.length || 0}
                    </span>
                  </button>
                  <button
                    onClick={() => setActiveTab('quiz')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition flex items-center gap-1 ${
                      activeTab === 'quiz'
                        ? 'bg-white text-teal-700 shadow-sm border border-slate-200'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>🎯 Practice Quiz</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full">
                      {eduData.quiz?.length || 0}
                    </span>
                  </button>
                </div>

                <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                  {eduData.topic}
                </span>
              </div>

              {/* Tab 1: Feynman Breakdown */}
              {activeTab === 'explain' && (
                <div className="p-5 space-y-4 max-h-[550px] overflow-y-auto">
                  {/* Analogy Callout Box */}
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 p-4 rounded-xl shadow-xs">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Lightbulb className="w-5 h-5 text-amber-600" />
                      <h4 className="text-xs font-extrabold text-amber-900 uppercase tracking-wider">
                        The Feynman Analogy (Intuition First)
                      </h4>
                    </div>
                    <p className="text-xs md:text-sm text-amber-950 leading-relaxed font-medium">
                      &quot;{eduData.simpleAnalogy}&quot;
                    </p>
                  </div>

                  {/* Deep dive text */}
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 mb-2">Comprehensive Deep-Dive</h4>
                    <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap bg-slate-50 p-4 rounded-xl border border-slate-200">
                      {eduData.deepDiveExplanation}
                    </div>
                  </div>

                  {/* Common misconceptions */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                      ⚠️ Frequent Student Misconceptions & Pitfalls
                    </h4>
                    <div className="space-y-1.5">
                      {eduData.commonPitfalls?.map((pitfall: string, i: number) => (
                        <div key={i} className="flex items-start gap-2 bg-red-50/70 border border-red-100 p-2.5 rounded-lg text-xs text-red-900">
                          <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                          <span>{pitfall}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Interactive 3D Flip Flashcards */}
              {activeTab === 'flashcards' && (
                <div className="p-5 flex flex-col items-center justify-center min-h-[460px] space-y-4">
                  <div className="flex items-center justify-between w-full max-w-lg text-xs text-slate-500">
                    <span>Card {currentCardIndex + 1} of {eduData.flashcards?.length}</span>
                    <span className="text-[11px] bg-slate-100 px-2 py-0.5 rounded">
                      Click card to flip
                    </span>
                  </div>

                  {/* Flashcard container */}
                  {eduData.flashcards && eduData.flashcards.length > 0 && (
                    <div
                      onClick={() => setIsFlipped(!isFlipped)}
                      className="w-full max-w-lg min-h-[220px] bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-6 shadow-xl cursor-pointer border border-slate-700 flex flex-col justify-between transition-all hover:scale-[1.01]"
                    >
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span className="uppercase font-bold tracking-wider text-teal-400">
                          {isFlipped ? 'Answer & Core Insight' : 'Question / Concept'}
                        </span>
                        <span>{isFlipped ? 'Tap to see question' : 'Tap to reveal answer'}</span>
                      </div>

                      <div className="my-auto py-4 text-center">
                        <p className="text-base md:text-lg font-semibold text-slate-100">
                          {isFlipped
                            ? eduData.flashcards[currentCardIndex]?.answer
                            : eduData.flashcards[currentCardIndex]?.question}
                        </p>
                        {isFlipped && eduData.flashcards[currentCardIndex]?.hint && (
                          <p className="text-xs text-teal-300 mt-2 italic">
                            💡 Hint: {eduData.flashcards[currentCardIndex].hint}
                          </p>
                        )}
                      </div>

                      <div className="text-center text-[10px] text-slate-500">
                        EduGenie Active Recall Engine
                      </div>
                    </div>
                  )}

                  {/* Flashcard Navigation */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        setIsFlipped(false);
                        setCurrentCardIndex((prev) => Math.max(0, prev - 1));
                      }}
                      disabled={currentCardIndex === 0}
                      className="px-4 py-1.5 text-xs font-semibold bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 disabled:opacity-30"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setIsFlipped(!isFlipped)}
                      className="px-4 py-1.5 text-xs font-semibold bg-teal-50 text-teal-700 rounded-lg hover:bg-teal-100 border border-teal-200"
                    >
                      Flip Card
                    </button>
                    <button
                      onClick={() => {
                        setIsFlipped(false);
                        setCurrentCardIndex((prev) =>
                          Math.min(eduData.flashcards.length - 1, prev + 1)
                        );
                      }}
                      disabled={currentCardIndex === eduData.flashcards?.length - 1}
                      className="px-4 py-1.5 text-xs font-semibold bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 disabled:opacity-30"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}

              {/* Tab 3: Interactive Practice Quiz */}
              {activeTab === 'quiz' && (
                <div className="p-5 space-y-5 max-h-[550px] overflow-y-auto">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Adaptive Concept Quiz</h4>
                      <p className="text-xs text-slate-500">Test your mastery with immediate explanations.</p>
                    </div>

                    {quizSubmitted && (
                      <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1.5 rounded-lg text-xs font-bold">
                        <Award className="w-4 h-4 text-emerald-600" />
                        <span>
                          Score: {calculateScore().correct} / {calculateScore().total}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    {eduData.quiz?.map((q: any, qIdx: number) => {
                      const selectedOpt = quizAnswers[qIdx];
                      const isCorrect = selectedOpt === q.correctIndex;

                      return (
                        <div key={qIdx} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                          <p className="text-xs md:text-sm font-bold text-slate-900">
                            {qIdx + 1}. {q.question}
                          </p>

                          <div className="space-y-2">
                            {q.options?.map((opt: string, optIdx: number) => {
                              const isSelected = selectedOpt === optIdx;
                              let btnClass = 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100';

                              if (isSelected) {
                                btnClass = 'bg-teal-50 border-teal-500 text-teal-900 font-semibold ring-1 ring-teal-500';
                              }

                              if (quizSubmitted) {
                                if (optIdx === q.correctIndex) {
                                  btnClass = 'bg-emerald-100 border-emerald-500 text-emerald-950 font-bold';
                                } else if (isSelected && !isCorrect) {
                                  btnClass = 'bg-red-100 border-red-500 text-red-950';
                                }
                              }

                              return (
                                <button
                                  key={optIdx}
                                  type="button"
                                  onClick={() => handleSelectQuizAnswer(qIdx, optIdx)}
                                  className={`w-full text-left p-2.5 rounded-lg border text-xs flex items-center justify-between transition ${btnClass}`}
                                >
                                  <span>{opt}</span>
                                  {quizSubmitted && optIdx === q.correctIndex && (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                  )}
                                  {quizSubmitted && isSelected && !isCorrect && (
                                    <XCircle className="w-4 h-4 text-red-600 shrink-0" />
                                  )}
                                </button>
                              );
                            })}
                          </div>

                          {quizSubmitted && (
                            <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-xs text-slate-600 mt-2">
                              <strong className="text-slate-800">Explanation: </strong>
                              {q.explanation}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    {!quizSubmitted ? (
                      <button
                        onClick={handleSubmitQuiz}
                        disabled={Object.keys(quizAnswers).length < (eduData.quiz?.length || 0)}
                        className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow transition disabled:opacity-40"
                      >
                        Submit Answers & View Score
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setQuizAnswers({});
                          setQuizSubmitted(false);
                        }}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 px-4 py-2 rounded-lg transition"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Retake Quiz
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
