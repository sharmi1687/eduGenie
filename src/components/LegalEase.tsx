import React, { useState } from 'react';
import {
  FileText,
  Shield,
  Download,
  Copy,
  Check,
  Sparkles,
  AlertTriangle,
  RefreshCw,
  Printer,
  Calendar,
  Layers,
  CheckCircle,
} from 'lucide-react';

const DOC_TYPES = [
  'Mutual Non-Disclosure Agreement (NDA)',
  'Freelance Software Development Contract',
  'Residential Lease / Rental Agreement',
  'Website Terms of Service & Privacy Policy',
  'Independent Consulting Agreement',
  'Employment Offer & IP Assignment Agreement',
];

export const LegalEase: React.FC = () => {
  const [docType, setDocType] = useState(DOC_TYPES[0]);
  const [partyA, setPartyA] = useState('Nexus Innovations Inc. (Disclosing Party)');
  const [partyB, setPartyB] = useState('John Doe / Quantum Freelance LLC (Receiving Party)');
  const [jurisdiction, setJurisdiction] = useState('State of California, USA');
  const [effectiveDate, setEffectiveDate] = useState('2026-10-05');
  const [keyTerms, setKeyTerms] = useState(
    'Protection of proprietary AI source code, customer databases, trade secrets, and backend architecture for a period of 3 years.'
  );
  const [specialClauses, setSpecialClauses] = useState(
    'Include standard non-solicitation of employees (1 year), injunctive relief clause, and mutual attorney fee recovery for breach.'
  );
  const [strictness, setStrictness] = useState('Balanced / Mutual');

  const [loading, setLoading] = useState(false);
  const [documentResult, setDocumentResult] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<'contract' | 'risks' | 'summary'>('contract');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPreset = (type: string) => {
    if (type === 'nda') {
      setDocType('Mutual Non-Disclosure Agreement (NDA)');
      setPartyA('Vertex AI Studios Inc.');
      setPartyB('Alpha Tech Solutions Ltd.');
      setJurisdiction('State of Delaware, USA');
      setKeyTerms('Mutual exchange of proprietary machine learning algorithms, model weights, and investor slide decks.');
      setSpecialClauses('Strict exclusion of public knowledge, 24-month term, mandatory return/destruction of data upon written notice.');
      setStrictness('Balanced / Mutual');
    } else if (type === 'freelance') {
      setDocType('Freelance Software Development Contract');
      setPartyA('Acme SaaS Corp (Client)');
      setPartyB('Sarah Jenkins (Lead Fullstack Developer)');
      setJurisdiction('State of New York, USA');
      setKeyTerms('Development of React + FastAPI Web Application. Fixed fee of $4,500 payable in 3 milestones (30% upfront, 40% alpha, 30% deployment).');
      setSpecialClauses('Full IP assignment upon final payment, 30-day bug warranty, client provides all API keys and asset licenses.');
      setStrictness('Contractor-Friendly');
    } else if (type === 'lease') {
      setDocType('Residential Lease / Rental Agreement');
      setPartyA('Oakwood Properties LLC (Landlord)');
      setPartyB('Alex Chen & Emily Wong (Tenants)');
      setJurisdiction('City of Austin, Texas, USA');
      setKeyTerms('12-month lease for Unit 4B at 742 Evergreen Terrace. Monthly rent $1,850 due on the 1st. Security deposit $1,850.');
      setSpecialClauses('No subletting without prior written consent, pet deposit of $300, tenant responsible for minor maintenance under $75.');
      setStrictness('Balanced / Mutual');
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/legalease/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentType: docType,
          partyA,
          partyB,
          jurisdiction,
          effectiveDate,
          keyTerms,
          specialClauses,
          strictness,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      setDocumentResult(data);
      setActiveTab('contract');
    } catch (err: any) {
      setError(err.message || 'Failed to generate legal document');
    } finally {
      setLoading(false);
    }
  };

  const copyText = (content: string) => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadDocument = () => {
    if (!documentResult) return;
    const blob = new Blob([documentResult.contractMarkdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${docType.replace(/[^a-zA-Z0-9]/g, '_')}_LegalEase.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const printDocument = () => {
    if (!documentResult) return;
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${documentResult.title}</title>
            <style>
              body { font-family: 'Times New Roman', serif; line-height: 1.6; padding: 40px; color: #111; }
              h1, h2, h3 { font-family: sans-serif; }
              pre { white-space: pre-wrap; font-family: 'Times New Roman', serif; }
            </style>
          </head>
          <body>
            <h1>${documentResult.title}</h1>
            <pre>${documentResult.contractMarkdown}</pre>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 text-white rounded-2xl p-6 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold mb-2">
              <FileText className="w-3.5 h-3.5" />
              <span>Project #2: LegalEase</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              AI-Powered Legal Document Generator
            </h2>
            <p className="text-blue-100 text-sm mt-1 max-w-2xl">
              Draft professionally formatted NDAs, freelance contracts, and lease agreements with instant clause risk auditing, jurisdiction adaptation, and plain-English translations using Google Gemini.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => loadPreset('nda')}
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-xs px-3 py-1.5 rounded-lg transition"
            >
              🔒 NDA Preset
            </button>
            <button
              onClick={() => loadPreset('freelance')}
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-xs px-3 py-1.5 rounded-lg transition"
            >
              💻 Freelance Contract
            </button>
            <button
              onClick={() => loadPreset('lease')}
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-xs px-3 py-1.5 rounded-lg transition"
            >
              🏠 Lease Agreement
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Contract Parameters (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Shield className="w-4 h-4 text-indigo-600" />
              Contract Parameters
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Document Type
              </label>
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 font-medium"
              >
                {DOC_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Party A (Disclosing Party / Client / Landlord)
                </label>
                <input
                  type="text"
                  value={partyA}
                  onChange={(e) => setPartyA(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g. Acme Corp"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Party B (Receiving Party / Contractor / Tenant)
                </label>
                <input
                  type="text"
                  value={partyB}
                  onChange={(e) => setPartyB(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g. John Doe Consulting"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Governing Law / Jurisdiction
                </label>
                <input
                  type="text"
                  value={jurisdiction}
                  onChange={(e) => setJurisdiction(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g. California, USA or India"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Effective Date
                </label>
                <input
                  type="date"
                  value={effectiveDate}
                  onChange={(e) => setEffectiveDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Core Terms & Consideration / Scope
              </label>
              <textarea
                rows={3}
                value={keyTerms}
                onChange={(e) => setKeyTerms(e.target.value)}
                className="w-full p-2.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="Specify duties, payment schedule, duration, confidential materials..."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Special Inclusions & Protective Clauses
              </label>
              <textarea
                rows={2}
                value={specialClauses}
                onChange={(e) => setSpecialClauses(e.target.value)}
                className="w-full p-2.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="Non-compete, IP ownership, liability caps, warranties..."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tone / Protective Bias
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['Balanced / Mutual', 'Party A Favorable', 'Party B Favorable'].map((bias) => (
                  <button
                    key={bias}
                    type="button"
                    onClick={() => setStrictness(bias)}
                    className={`py-1.5 px-2 text-[11px] font-semibold rounded-lg border transition ${
                      strictness === bias
                        ? 'bg-indigo-50 border-indigo-600 text-indigo-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {bias}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm py-2.5 rounded-xl shadow-md transition disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Drafting Legal Document with Gemini...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Full Legal Document</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Output: Document Viewer & Risk Auditing (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {!documentResult && !loading && (
            <div className="bg-white rounded-xl border border-dashed border-slate-300 p-8 text-center flex flex-col items-center justify-center min-h-[500px]">
              <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-3">
                <FileText className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold text-slate-800">Legal Document Ready to Draft</h4>
              <p className="text-xs text-slate-500 max-w-sm mt-1 mb-5">
                Configure your parties, jurisdiction, and terms, then click generate to produce an enforceable draft with risk auditing.
              </p>
              <button
                onClick={handleGenerate}
                className="inline-flex items-center gap-1.5 text-xs font-semibold bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Draft Document Now
              </button>
            </div>
          )}

          {loading && (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center flex flex-col items-center justify-center min-h-[500px]">
              <div className="relative mb-4">
                <div className="w-14 h-14 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                <FileText className="w-5 h-5 text-indigo-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <h4 className="text-base font-bold text-slate-800">Drafting Enforceable Agreement...</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                Formatting legal clauses, checking {jurisdiction} statutory requirements, and assessing indemnity risks.
              </p>
            </div>
          )}

          {documentResult && !loading && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              {/* Output Top Bar */}
              <div className="bg-slate-50 border-b border-slate-200 p-3.5 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setActiveTab('contract')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                      activeTab === 'contract'
                        ? 'bg-white text-indigo-700 shadow-sm border border-slate-200'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    📄 Contract Text
                  </button>
                  <button
                    onClick={() => setActiveTab('risks')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition flex items-center gap-1 ${
                      activeTab === 'risks'
                        ? 'bg-white text-amber-700 shadow-sm border border-slate-200'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                    <span>Risk Audit ({documentResult.riskAnalysis?.length || 0})</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('summary')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                      activeTab === 'summary'
                        ? 'bg-white text-indigo-700 shadow-sm border border-slate-200'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    💡 Plain English
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => copyText(documentResult.contractMarkdown)}
                    className="p-1.5 text-slate-600 hover:text-indigo-600 bg-white border border-slate-200 rounded-lg text-xs inline-flex items-center gap-1"
                    title="Copy full markdown"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                  <button
                    onClick={downloadDocument}
                    className="p-1.5 text-slate-600 hover:text-indigo-600 bg-white border border-slate-200 rounded-lg text-xs inline-flex items-center gap-1"
                    title="Download .md"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Download</span>
                  </button>
                  <button
                    onClick={printDocument}
                    className="p-1.5 text-slate-600 hover:text-indigo-600 bg-white border border-slate-200 rounded-lg text-xs inline-flex items-center gap-1"
                    title="Print Document"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Print</span>
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-5 flex-1">
                {activeTab === 'contract' && (
                  <div className="space-y-4">
                    <div className="border-b border-slate-100 pb-3">
                      <h4 className="text-base font-extrabold text-slate-900">{documentResult.title}</h4>
                      <p className="text-xs text-slate-500">
                        Governing Jurisdiction: {jurisdiction} | Effective Date: {effectiveDate}
                      </p>
                    </div>

                    <div className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs leading-relaxed max-h-[460px] overflow-y-auto whitespace-pre-wrap select-text">
                      {documentResult.contractMarkdown}
                    </div>

                    <p className="text-[11px] text-slate-400 italic">
                      Disclaimer: {documentResult.disclaimer}
                    </p>
                  </div>
                )}

                {activeTab === 'risks' && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-4 h-4 text-amber-600" />
                      <h4 className="text-sm font-bold text-slate-900">Clause-by-Clause Risk Assessment</h4>
                    </div>

                    <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
                      {documentResult.riskAnalysis?.map((risk: any, i: number) => {
                        const isHigh = risk.riskLevel?.toLowerCase() === 'high';
                        const isMed = risk.riskLevel?.toLowerCase() === 'medium';
                        return (
                          <div
                            key={i}
                            className={`p-3 rounded-lg border text-xs ${
                              isHigh
                                ? 'bg-red-50/70 border-red-200 text-red-900'
                                : isMed
                                ? 'bg-amber-50/70 border-amber-200 text-amber-900'
                                : 'bg-slate-50 border-slate-200 text-slate-800'
                            }`}
                          >
                            <div className="flex items-center justify-between font-bold mb-1">
                              <span>{risk.clauseName}</span>
                              <span
                                className={`text-[10px] px-2 py-0.5 rounded font-extrabold uppercase ${
                                  isHigh
                                    ? 'bg-red-200 text-red-800'
                                    : isMed
                                    ? 'bg-amber-200 text-amber-800'
                                    : 'bg-slate-200 text-slate-700'
                                }`}
                              >
                                {risk.riskLevel} Risk
                              </span>
                            </div>
                            <p className="text-[11px] leading-relaxed opacity-90">{risk.explanation}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {activeTab === 'summary' && (
                  <div className="space-y-4">
                    <div className="border-b border-slate-100 pb-2">
                      <h4 className="text-sm font-bold text-slate-900">Plain English Breakdown for Non-Lawyers</h4>
                      <p className="text-xs text-slate-500">What each party is actually agreeing to do:</p>
                    </div>

                    <div className="space-y-2">
                      {documentResult.plainEnglishSummary?.map((point: string, idx: number) => (
                        <div key={idx} className="flex items-start gap-2.5 p-2.5 bg-indigo-50/50 rounded-lg text-xs text-slate-800">
                          <CheckCircle className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                          <span>{point}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                        Critical Dates & Deadlines
                      </h5>
                      <ul className="space-y-1.5 text-xs text-slate-700">
                        {documentResult.criticalDatesAndObligations?.map((item: string, i: number) => (
                          <li key={i} className="flex items-center gap-2 bg-slate-50 p-2 rounded">
                            <Calendar className="w-3.5 h-3.5 text-slate-500" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
