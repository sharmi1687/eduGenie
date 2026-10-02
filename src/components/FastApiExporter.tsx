import React, { useState } from 'react';
import JSZip from 'jszip';
import {
  Folder,
  FileCode,
  Download,
  Copy,
  Check,
  Terminal,
  ExternalLink,
  Play,
  Sparkles,
  Layers,
  FileText,
  Code2,
} from 'lucide-react';
import { PROJECT_LIST, getFastApiProjectFiles } from '../data/fastApiTemplates';

export const FastApiExporter: React.FC = () => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>('pocketsmart');
  const [selectedFile, setSelectedFile] = useState<string>('main.py');
  const [copiedFile, setCopiedFile] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  // Live simulation tester
  const [testPrompt, setTestPrompt] = useState('Suggest 3 quick ways to save $150 on weekly food expenses.');
  const [testResponse, setTestResponse] = useState<string | null>(null);
  const [testLoading, setTestLoading] = useState(false);

  const { project, files } = getFastApiProjectFiles(selectedProjectId);
  const currentContent = files[selectedFile as keyof typeof files] || '';

  const handleCopy = () => {
    navigator.clipboard.writeText(currentContent);
    setCopiedFile(true);
    setTimeout(() => setCopiedFile(false), 2000);
  };

  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
      const zip = new JSZip();
      const folderName = `${project.id}_fastapi_project`;
      const root = zip.folder(folderName) || zip;

      // Add files
      root.file('main.py', files['main.py']);
      root.file('requirements.txt', files['requirements.txt']);
      root.file('.env.example', files['.env.example']);
      root.file('README.md', files['README.md']);

      const templatesFolder = root.folder('templates');
      if (templatesFolder) {
        templatesFolder.file('index.html', files['templates/index.html']);
      }

      const staticFolder = root.folder('static');
      if (staticFolder) {
        staticFolder.file('style.css', files['static/style.css']);
      }

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${folderName}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to create ZIP', err);
    } finally {
      setIsZipping(false);
    }
  };

  const handleRunSimulation = async () => {
    setTestLoading(true);
    setTestResponse(null);
    try {
      // Route simulation based on project
      let endpoint = '/api/pocketsmart/analyze';
      let payload: any = {
        monthlyIncome: 2500,
        expenses: [{ category: 'Food', amount: 350, description: testPrompt }],
        goals: testPrompt,
      };

      if (project.id === 'legalease') {
        endpoint = '/api/legalease/generate';
        payload = {
          documentType: 'Mutual Non-Disclosure Agreement (NDA)',
          partyA: 'Acme AI Corp',
          partyB: 'Quantum Dev Studio',
          jurisdiction: 'California',
          keyTerms: testPrompt,
        };
      } else if (project.id === 'comiccraft') {
        endpoint = '/api/comiccraft/generate';
        payload = { premise: testPrompt, panelCount: 3 };
      } else if (project.id === 'edugenie') {
        endpoint = '/api/edugenie/explain';
        payload = { topic: testPrompt, gradeLevel: 'Undergraduate' };
      } else if (project.id === 'fitbuddy') {
        endpoint = '/api/fitbuddy/generate';
        payload = { primaryGoal: 'Lean Muscle Hypertrophy', daysPerWeek: 4 };
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setTestResponse(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setTestResponse('Simulation Error: ' + err.message);
    } finally {
      setTestLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Exporter Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full text-xs font-semibold mb-2">
              <Code2 className="w-3.5 h-3.5" />
              <span>Turnkey Python & FastAPI Generator</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              FastAPI + Jinja2 + Google Gemini Project Exporter
            </h2>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Inspect, customize, and export fully functional standalone Python repositories matching the course requirements for any of the 5 projects.
            </p>
          </div>

          <button
            onClick={handleDownloadZip}
            disabled={isZipping}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm px-5 py-3 rounded-xl shadow-lg transition disabled:opacity-50 shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>{isZipping ? 'Packaging ZIP...' : `Download ${project.title} ZIP`}</span>
          </button>
        </div>

        {/* Project Selector Pills */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex flex-wrap gap-2">
          {PROJECT_LIST.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                setSelectedProjectId(p.id);
                setSelectedFile('main.py');
              }}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg border transition ${
                selectedProjectId === p.id
                  ? 'bg-indigo-600 border-indigo-400 text-white shadow-sm'
                  : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {p.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Code Studio & Tree */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* File Tree (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Folder className="w-4 h-4 text-indigo-600" />
              Project Files
            </h3>

            <div className="space-y-1 text-xs font-mono">
              <button
                onClick={() => setSelectedFile('main.py')}
                className={`w-full text-left px-2.5 py-2 rounded-lg flex items-center gap-2 transition ${
                  selectedFile === 'main.py'
                    ? 'bg-indigo-50 text-indigo-900 font-bold border border-indigo-200'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <FileCode className="w-4 h-4 text-indigo-600" />
                <span>main.py</span>
              </button>

              <div className="pl-3 py-1 space-y-1">
                <span className="text-[11px] text-slate-400 font-sans block">📁 templates/</span>
                <button
                  onClick={() => setSelectedFile('templates/index.html')}
                  className={`w-full text-left pl-3 pr-2 py-1.5 rounded-lg flex items-center gap-2 transition ${
                    selectedFile === 'templates/index.html'
                      ? 'bg-indigo-50 text-indigo-900 font-bold border border-indigo-200'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5 text-orange-500" />
                  <span>index.html</span>
                </button>
              </div>

              <div className="pl-3 py-1 space-y-1">
                <span className="text-[11px] text-slate-400 font-sans block">📁 static/</span>
                <button
                  onClick={() => setSelectedFile('static/style.css')}
                  className={`w-full text-left pl-3 pr-2 py-1.5 rounded-lg flex items-center gap-2 transition ${
                    selectedFile === 'static/style.css'
                      ? 'bg-indigo-50 text-indigo-900 font-bold border border-indigo-200'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5 text-sky-500" />
                  <span>style.css</span>
                </button>
              </div>

              <button
                onClick={() => setSelectedFile('requirements.txt')}
                className={`w-full text-left px-2.5 py-2 rounded-lg flex items-center gap-2 transition ${
                  selectedFile === 'requirements.txt'
                    ? 'bg-indigo-50 text-indigo-900 font-bold border border-indigo-200'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <FileText className="w-4 h-4 text-slate-500" />
                <span>requirements.txt</span>
              </button>

              <button
                onClick={() => setSelectedFile('.env.example')}
                className={`w-full text-left px-2.5 py-2 rounded-lg flex items-center gap-2 transition ${
                  selectedFile === '.env.example'
                    ? 'bg-indigo-50 text-indigo-900 font-bold border border-indigo-200'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>.env.example</span>
              </button>

              <button
                onClick={() => setSelectedFile('README.md')}
                className={`w-full text-left px-2.5 py-2 rounded-lg flex items-center gap-2 transition ${
                  selectedFile === 'README.md'
                    ? 'bg-indigo-50 text-indigo-900 font-bold border border-indigo-200'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <FileText className="w-4 h-4 text-blue-600" />
                <span>README.md</span>
              </button>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
              <p>
                <strong>Port:</strong> {project.defaultPort}
              </p>
              <p>
                <strong>Engine:</strong> Uvicorn + FastAPI
              </p>
            </div>
          </div>
        </div>

        {/* Code Previewer (9 cols) */}
        <div className="lg:col-span-9 space-y-4">
          <div className="bg-slate-950 text-slate-100 rounded-xl border border-slate-800 shadow-xl overflow-hidden flex flex-col">
            {/* Window bar */}
            <div className="bg-slate-900 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block"></span>
                <span className="ml-2 text-xs font-mono text-slate-400 font-medium">
                  {project.id}/{selectedFile}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-2.5 py-1 rounded transition"
                >
                  {copiedFile ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedFile ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Code Body */}
            <div className="p-4 overflow-x-auto max-h-[520px] overflow-y-auto">
              <pre className="font-mono text-xs leading-relaxed text-slate-200 selection:bg-indigo-600 selection:text-white">
                <code>{currentContent}</code>
              </pre>
            </div>
          </div>

          {/* Quick Terminal Run Card */}
          <div className="bg-slate-900 text-white rounded-xl p-4 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 font-mono">
              <Terminal className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-slate-400">$</span>
              <span className="text-emerald-300">
                uvicorn main:app --reload --port {project.defaultPort}
              </span>
            </div>
            <span className="text-slate-400 text-[11px]">
              Runs at: <strong className="text-white">http://127.0.0.1:{project.defaultPort}</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
