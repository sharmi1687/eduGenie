import React, { useState } from 'react';
import {
  CheckCircle2,
  Terminal,
  ExternalLink,
  Copy,
  Check,
  AlertTriangle,
  Download,
  Key,
  Layers,
  Server,
  Code,
  FileCode,
} from 'lucide-react';

export const PrerequisitesGuide: React.FC = () => {
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [activeOS, setActiveOS] = useState<'windows' | 'mac' | 'linux'>('windows');

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white rounded-2xl p-6 shadow-md border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-xs font-semibold mb-2">
              <Terminal className="w-3.5 h-3.5" />
              <span>Prerequisites & Setup Reference</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Local Development Environment Guide
            </h2>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Complete step-by-step instructions to prepare Python 3.10+, FastAPI, Uvicorn, Jinja2, and Google Gemini API keys on your local machine.
            </p>
          </div>

          {/* OS Switcher */}
          <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700">
            {(['windows', 'mac', 'linux'] as const).map((os) => (
              <button
                key={os}
                onClick={() => setActiveOS(os)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg capitalize transition ${
                  activeOS === os
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {os === 'mac' ? 'macOS' : os}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Step 1: Python 3.10+ */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-extrabold text-xs flex items-center justify-center">
              1
            </span>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              Core Runtime
            </span>
          </div>

          <h3 className="text-base font-bold text-slate-900">Python 3.10+ Installation</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Download the official Python installer. If on Windows, ensure you check the box that says{' '}
            <strong className="text-rose-600 underline">&quot;Add Python to PATH&quot;</strong> before completing setup.
          </p>

          <div className="bg-slate-900 text-slate-100 p-3 rounded-lg text-xs font-mono flex items-center justify-between">
            <code>python --version</code>
            <button
              onClick={() => copyToClipboard('python --version', 'pyver')}
              className="text-slate-400 hover:text-white"
            >
              {copiedCmd === 'pyver' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-2 text-xs">
            <a
              href="https://www.python.org/downloads/"
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 hover:underline inline-flex items-center gap-1"
            >
              <span>Official Python Downloads</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-slate-300">•</span>
            <a
              href="https://www.tomshardware.com/how-to/install-python-on-windows-10-and-11"
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 hover:underline inline-flex items-center gap-1"
            >
              <span>Tom&apos;s Hardware Guide</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Step 2: FastAPI & Uvicorn */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-extrabold text-xs flex items-center justify-center">
              2
            </span>
            <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
              Web Framework & Server
            </span>
          </div>

          <h3 className="text-base font-bold text-slate-900">FastAPI & Uvicorn Server</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            FastAPI provides high-performance asynchronous API endpoints, and Uvicorn acts as the lightning-fast ASGI application server.
          </p>

          <div className="bg-slate-900 text-slate-100 p-3 rounded-lg text-xs font-mono flex items-center justify-between">
            <code>pip install fastapi &quot;uvicorn[standard]&quot;</code>
            <button
              onClick={() => copyToClipboard('pip install fastapi "uvicorn[standard]"', 'fastapi')}
              className="text-slate-400 hover:text-white"
            >
              {copiedCmd === 'fastapi' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-2 text-xs">
            <a
              href="https://fastapi.tiangolo.com/"
              target="_blank"
              rel="noreferrer"
              className="text-indigo-600 hover:underline inline-flex items-center gap-1"
            >
              <span>FastAPI Documentation</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-slate-300">•</span>
            <a
              href="https://www.uvicorn.org/"
              target="_blank"
              rel="noreferrer"
              className="text-indigo-600 hover:underline inline-flex items-center gap-1"
            >
              <span>Uvicorn PyPI Guide</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Step 3: Jinja2 & Static Files */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-extrabold text-xs flex items-center justify-center">
              3
            </span>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              HTML Templating
            </span>
          </div>

          <h3 className="text-base font-bold text-slate-900">Jinja2 & Static CSS Setup</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            FastAPI uses Jinja2 for server-side HTML rendering. Place your HTML in the <code>/templates</code> folder and your CSS/JS inside the <code>/static</code> directory.
          </p>

          <div className="bg-slate-900 text-slate-100 p-3 rounded-lg text-xs font-mono flex items-center justify-between">
            <code>pip install jinja2</code>
            <button
              onClick={() => copyToClipboard('pip install jinja2', 'jinja')}
              className="text-slate-400 hover:text-white"
            >
              {copiedCmd === 'jinja' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-2 text-xs">
            <a
              href="https://jinja.palletsprojects.com/"
              target="_blank"
              rel="noreferrer"
              className="text-emerald-600 hover:underline inline-flex items-center gap-1"
            >
              <span>Jinja2 Official Docs</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Step 4: Google Gemini API Key */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 font-extrabold text-xs flex items-center justify-center">
              4
            </span>
            <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
              Generative AI Key
            </span>
          </div>

          <h3 className="text-base font-bold text-slate-900">Google Gemini API Key</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Sign in to Google AI Studio, create a new project, enable the Gemini API, and create your API key. Install the modern Python SDK:
          </p>

          <div className="bg-slate-900 text-slate-100 p-3 rounded-lg text-xs font-mono flex items-center justify-between">
            <code>pip install google-genai python-dotenv</code>
            <button
              onClick={() => copyToClipboard('pip install google-genai python-dotenv', 'genai')}
              className="text-slate-400 hover:text-white"
            >
              {copiedCmd === 'genai' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-2 text-xs">
            <a
              href="https://aistudio.google.com/"
              target="_blank"
              rel="noreferrer"
              className="text-amber-600 hover:underline inline-flex items-center gap-1"
            >
              <span>Google AI Studio</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-slate-300">•</span>
            <a
              href="https://ai.google.dev/"
              target="_blank"
              rel="noreferrer"
              className="text-amber-600 hover:underline inline-flex items-center gap-1"
            >
              <span>Google AI for Developers</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Complete One-Liner Install */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-white space-y-3">
        <h4 className="text-sm font-bold flex items-center gap-2 text-amber-400">
          <Terminal className="w-4 h-4" />
          One-Line Terminal Install Command for Local Terminal
        </h4>
        <div className="bg-black/50 p-3 rounded-lg font-mono text-xs text-slate-200 flex items-center justify-between overflow-x-auto">
          <code>
            pip install fastapi &quot;uvicorn[standard]&quot; jinja2 google-genai python-dotenv
          </code>
          <button
            onClick={() =>
              copyToClipboard(
                'pip install fastapi "uvicorn[standard]" jinja2 google-genai python-dotenv',
                'all'
              )
            }
            className="ml-3 px-3 py-1 bg-white/10 hover:bg-white/20 rounded text-xs font-sans font-medium inline-flex items-center gap-1"
          >
            {copiedCmd === 'all' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedCmd === 'all' ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
