import React, { useState } from 'react';
import {
  Wallet,
  FileText,
  Sparkles,
  GraduationCap,
  Dumbbell,
  Terminal,
  Code2,
  CheckCircle,
  ExternalLink,
  BookOpen,
  Calendar,
  Layers,
  ChevronDown,
} from 'lucide-react';
import { DeadlineBanner } from './components/DeadlineBanner';
import { PocketSmartAI } from './components/PocketSmartAI';
import { LegalEase } from './components/LegalEase';
import { ComicCraft } from './components/ComicCraft';
import { EduGenie } from './components/EduGenie';
import { FitBuddy } from './components/FitBuddy';
import { FastApiExporter } from './components/FastApiExporter';
import { PrerequisitesGuide } from './components/PrerequisitesGuide';
import { ProjectSubmissionHub } from './components/ProjectSubmissionHub';
import { PROJECT_LIST } from './data/fastApiTemplates';

export default function App() {
  const [activeTab, setActiveTab] = useState<
    'pocketsmart' | 'legalease' | 'comiccraft' | 'edugenie' | 'fitbuddy' | 'exporter' | 'prereqs' | 'guide'
  >('guide');

  const getProjectIcon = (id: string) => {
    switch (id) {
      case 'pocketsmart':
        return <Wallet className="w-4 h-4 text-emerald-500" />;
      case 'legalease':
        return <FileText className="w-4 h-4 text-indigo-500" />;
      case 'comiccraft':
        return <Sparkles className="w-4 h-4 text-purple-500" />;
      case 'edugenie':
        return <GraduationCap className="w-4 h-4 text-teal-500" />;
      case 'fitbuddy':
        return <Dumbbell className="w-4 h-4 text-rose-500" />;
      default:
        return <Sparkles className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans antialiased">
      {/* Real-time Deadline Countdown Banner */}
      <DeadlineBanner />

      {/* Main Header */}
      <header className="bg-white border-b border-slate-200/90 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                  Google Cloud Generative AI
                </span>
                <span className="text-xs text-slate-400">• Student Studio</span>
              </div>
              <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900">
                5 Projects Workbench & FastAPI Generator
              </h1>
            </div>
          </div>

          {/* Quick Hub Navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('guide')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'guide'
                  ? 'bg-slate-900 text-white shadow'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>Submission Hub</span>
            </button>

            <button
              onClick={() => setActiveTab('prereqs')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'prereqs'
                  ? 'bg-blue-600 text-white shadow'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Prerequisites & Setup</span>
            </button>

            <button
              onClick={() => setActiveTab('exporter')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'exporter'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>FastAPI Exporter</span>
            </button>
          </div>
        </div>

        {/* 5 Project Workbenches Tab Bar */}
        <div className="bg-slate-50 border-t border-slate-200/80 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto flex items-center gap-1 overflow-x-auto py-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-2 shrink-0">
              Interactive Engines:
            </span>

            {PROJECT_LIST.map((proj) => {
              const isActive = activeTab === proj.id;
              return (
                <button
                  key={proj.id}
                  onClick={() => setActiveTab(proj.id as any)}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-sm border border-slate-200 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  {getProjectIcon(proj.id)}
                  <span>{proj.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {activeTab === 'guide' && (
          <ProjectSubmissionHub
            onSelectProjectWorkbench={(id) => setActiveTab(id as any)}
          />
        )}

        {activeTab === 'prereqs' && <PrerequisitesGuide />}

        {activeTab === 'exporter' && <FastApiExporter />}

        {activeTab === 'pocketsmart' && <PocketSmartAI />}

        {activeTab === 'legalease' && <LegalEase />}

        {activeTab === 'comiccraft' && <ComicCraft />}

        {activeTab === 'edugenie' && <EduGenie />}

        {activeTab === 'fitbuddy' && <FitBuddy />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 px-4 text-center text-xs text-slate-500 space-y-2 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-left">
            <span className="font-bold text-slate-800">
              Google Cloud Generative AI – Project Guide & Student Workbench
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-600">
            <a
              href="https://www.youtube.com/playlist?list=PLaoUPVLOy8WM"
              target="_blank"
              rel="noreferrer"
              className="hover:text-blue-600 transition"
            >
              4-Day Project Sessions Playlist
            </a>
            <span>•</span>
            <a
              href="https://youtu.be/wPPI9-mK2P0"
              target="_blank"
              rel="noreferrer"
              className="hover:text-blue-600 transition"
            >
              GitHub Submission Demo Video
            </a>
            <span>•</span>
            <a
              href="https://ai.google.dev"
              target="_blank"
              rel="noreferrer"
              className="hover:text-blue-600 transition"
            >
              Google AI for Developers
            </a>
          </div>

          <div className="text-right">
            <span className="text-rose-600 font-bold">Deadline: Saturday, October 3, 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
