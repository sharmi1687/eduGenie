import React, { useState, useEffect } from 'react';
import {
  FileText,
  Youtube,
  Github,
  ExternalLink,
  CheckSquare,
  Square,
  AlertCircle,
  Calendar,
  Layers,
  Sparkles,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { PROJECT_LIST } from '../data/fastApiTemplates';

const MILESTONES = [
  {
    phase: 'Phase 1: Project Initiation & Environment Setup',
    tasks: [
      'Install Python 3.10+ and verify PATH environment variable (python --version)',
      'Sign in to Google AI Studio and generate a new Gemini API Key',
      'Create and activate a Python virtual environment (python -m venv venv)',
      'Install FastAPI, Uvicorn, Jinja2, and google-genai SDK',
      'Clone the Google Cloud Generative AI Common Template repository from GitHub',
    ],
  },
  {
    phase: 'Phase 2: FastAPI Backend & Gemini Prompt Engineering',
    tasks: [
      'Set up main.py with FastAPI router and Uvicorn server configuration',
      'Initialize GoogleGenAI client securely reading GEMINI_API_KEY from .env',
      'Design tailored System Instruction and Temperature for your chosen project',
      'Implement structured error handling and JSON validation for model outputs',
      'Test the POST /api/generate endpoint locally using Swagger docs (/docs)',
    ],
  },
  {
    phase: 'Phase 3: Jinja2 Templates & Modern Responsive Frontend',
    tasks: [
      'Configure Jinja2Templates directory in FastAPI templates/index.html',
      'Mount static files directory for custom CSS in static/style.css',
      'Implement clean user input forms, loading indicators, and error banners',
      'Connect frontend JavaScript fetch() calls to the FastAPI backend route',
      'Add result formatting, copy buttons, and responsive mobile-ready layout',
    ],
  },
  {
    phase: 'Phase 4: Testing, Video Demo & Final GitHub Submission',
    tasks: [
      'Perform end-to-end testing with varied edge-case prompts and user inputs',
      'Verify requirements.txt is complete with freeze dependencies',
      'Write clear README.md with run instructions, screenshots, and architecture',
      'Record project submission demo video showcasing the live working application',
      'Commit all changes to GitHub and submit repository URL before Oct 3, 2026 deadline',
    ],
  },
];

interface ProjectSubmissionHubProps {
  onSelectProjectWorkbench: (projectId: string) => void;
}

export const ProjectSubmissionHub: React.FC<ProjectSubmissionHubProps> = ({
  onSelectProjectWorkbench,
}) => {
  const [completedTasks, setCompletedTasks] = useState<{ [key: string]: boolean }>(() => {
    try {
      const saved = localStorage.getItem('gc_genai_tasks');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('gc_genai_tasks', JSON.stringify(completedTasks));
    } catch (e) {
      console.error(e);
    }
  }, [completedTasks]);

  const toggleTask = (taskName: string) => {
    setCompletedTasks((prev) => ({
      ...prev,
      [taskName]: !prev[taskName],
    }));
  };

  const totalTasks = MILESTONES.reduce((acc, m) => acc + m.tasks.length, 0);
  const doneTasks = Object.values(completedTasks).filter(Boolean).length;
  const progressPercent = Math.round((doneTasks / totalTasks) * 100);

  return (
    <div className="space-y-6">
      {/* Deadline Alert Banner */}
      <div className="bg-gradient-to-r from-red-950 via-rose-900 to-slate-900 border border-red-800 text-white rounded-2xl p-6 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 bg-red-500/20 text-red-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <Calendar className="w-3.5 h-3.5" />
              <span>Official Submission Deadline</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white">
              REMINDER: FINAL DEADLINE IS SATURDAY, OCTOBER 3, 2026
            </h2>
            <p className="text-rose-200 text-xs md:text-sm max-w-2xl">
              All students must complete their phase-wise templates, test their working FastAPI application, upload the deliverables to GitHub, and submit their project link before the deadline.
            </p>
          </div>

          <div className="flex flex-col items-end gap-2 shrink-0">
            <div className="text-right">
              <span className="text-xs text-rose-300 font-medium">Milestone Progress</span>
              <p className="text-xl font-black text-white">{progressPercent}% Completed</p>
            </div>
            <div className="w-36 h-2 bg-red-950 rounded-full overflow-hidden border border-red-700/50">
              <div
                className="h-full bg-emerald-400 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Track Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <a
          href="https://www.youtube.com/playlist?list=PLaoUPVLOy8WM"
          target="_blank"
          rel="noreferrer"
          className="bg-white hover:bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-sm transition flex items-start gap-4 group"
        >
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
            <Youtube className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1 text-slate-900 font-bold text-sm">
              <span>4-Day Project Sessions Playlist</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-red-600 transition" />
            </div>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Step-by-step lecture sessions covering project architecture, FastAPI setup, and prompt tuning.
            </p>
            <span className="text-xs text-red-600 font-semibold mt-2 inline-block">
              Watch on YouTube →
            </span>
          </div>
        </a>

        <a
          href="https://youtu.be/wPPI9-mK2P0"
          target="_blank"
          rel="noreferrer"
          className="bg-white hover:bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-sm transition flex items-start gap-4 group"
        >
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
            <Github className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1 text-slate-900 font-bold text-sm">
              <span>GitHub Creation & Project Submission Demo</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition" />
            </div>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Official video tutorial guiding you through GitHub repository creation, deliverables upload, and final form submission.
            </p>
            <span className="text-xs text-indigo-600 font-semibold mt-2 inline-block">
              Watch Submission Demo →
            </span>
          </div>
        </a>
      </div>

      {/* 5 Projects Master Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              5 Google Cloud Generative AI Projects
            </h3>
            <p className="text-xs text-slate-500">
              Assigned student tracks with documentation, video guides, and live testing workbenches.
            </p>
          </div>
          <span className="text-xs bg-indigo-50 text-indigo-700 font-semibold px-2.5 py-1 rounded-full border border-indigo-100">
            Common Template Format
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-700 uppercase font-bold text-[11px]">
                <th className="py-3 px-4">Project Title</th>
                <th className="py-3 px-4">Project Document</th>
                <th className="py-3 px-4">Tamil Reference Video</th>
                <th className="py-3 px-4">Template / Format</th>
                <th className="py-3 px-4 text-right">Interactive Workbench</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {PROJECT_LIST.map((proj) => (
                <tr key={proj.id} className="hover:bg-slate-50 transition">
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-900 block text-sm">{proj.title}</span>
                    <span className="text-slate-500 text-[11px]">{proj.tagline}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <a
                      href={proj.docLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-semibold"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Open Document</span>
                    </a>
                  </td>
                  <td className="py-3.5 px-4">
                    <a
                      href={proj.tamilVideoLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-rose-600 hover:text-rose-800 font-semibold"
                    >
                      <Youtube className="w-3.5 h-3.5" />
                      <span>Reference Video</span>
                    </a>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 bg-slate-100 px-2 py-1 rounded text-slate-700 font-medium">
                      Common Template
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => onSelectProjectWorkbench(proj.id)}
                      className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3 py-1.5 rounded-lg transition"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Open Workbench</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Phase-wise Milestone Tracker */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Phase-Wise Milestone Checklist (Days 1–4)
            </h3>
            <p className="text-xs text-slate-500">
              Check off deliverables as you finish them. Progress is automatically saved to your browser.
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            {doneTasks} / {totalTasks} Completed
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {MILESTONES.map((mile, mIdx) => (
            <div key={mIdx} className="bg-slate-50/80 border border-slate-200 rounded-xl p-4 space-y-2.5">
              <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider text-indigo-900">
                {mile.phase}
              </h4>
              <div className="space-y-2">
                {mile.tasks.map((task, tIdx) => {
                  const isChecked = Boolean(completedTasks[task]);
                  return (
                    <div
                      key={tIdx}
                      onClick={() => toggleTask(task)}
                      className={`flex items-start gap-2.5 p-2 rounded-lg cursor-pointer text-xs transition select-none ${
                        isChecked
                          ? 'bg-emerald-50/80 text-emerald-950 font-medium'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {isChecked ? (
                        <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      )}
                      <span className={isChecked ? 'line-through opacity-75' : ''}>{task}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
