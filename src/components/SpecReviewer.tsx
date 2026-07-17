import React, { useState } from 'react';
import { Search, ShieldCheck, AlertCircle, Bookmark, Loader2, FileText } from 'lucide-react';
import { cn } from '../lib/utils';

interface ReviewResult {
  relevantStandards: Array<{ id: string; title: string; reason: string }>;
  recommendations: string[];
  risks: string[];
}

export default function SpecReviewer() {
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ReviewResult | null>(null);

  const handleReview = async () => {
    if (!draft.trim()) return;
    setLoading(true);
    try {
      const response = await fetch('/api/review-spec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ draft }),
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error reviewing spec:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex items-center gap-3 mb-8 border-b border-hanwha-border pb-6">
        <div className="p-2.5 bg-orange-100 text-hanwha-orange rounded shadow-sm">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-hanwha-dark uppercase tracking-tight">MIL-SPEC Compliance Analysis</h2>
          <p className="text-gray-400 text-[10px] font-mono uppercase tracking-widest mt-1">Cross-referencing technical requirements against global defense standards</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Input Area */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-hanwha-orange" />
              Technical Draft Input
            </label>
            <span className="text-[10px] font-mono text-gray-400">{draft.length} BYTES</span>
          </div>
          <textarea
            className="w-full h-[400px] p-5 bg-white border border-hanwha-border rounded shadow-sm focus:ring-1 focus:ring-hanwha-orange focus:border-hanwha-orange transition-all resize-none font-mono text-xs leading-relaxed"
            placeholder="Paste technical specification, design proposal, or test requirements..."
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
          <button
            onClick={handleReview}
            disabled={loading || !draft.trim()}
            className="w-full py-4 bg-hanwha-dark text-white font-bold text-xs uppercase tracking-widest rounded shadow-lg hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all border border-gray-800"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-hanwha-orange" />
                Processing MIL-DB...
              </>
            ) : (
              <>
                <Search className="w-4 h-4 text-hanwha-orange" />
                Execute Compliance Review
              </>
            )}
          </button>
        </div>

        {/* Results Area */}
        <div className="space-y-6">
          {!result && !loading && (
            <div className="h-[400px] flex flex-col items-center justify-center text-gray-400 border border-dashed border-hanwha-border rounded bg-hanwha-grey/30">
              <ShieldCheck className="w-10 h-10 mb-4 opacity-10" />
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">Ready for data ingestion</p>
            </div>
          )}

          {loading && (
            <div className="h-[400px] flex flex-col items-center justify-center text-hanwha-dark">
              <div className="relative mb-6">
                <Loader2 className="w-12 h-12 animate-spin text-hanwha-orange opacity-20" />
                <ShieldCheck className="w-6 h-6 text-hanwha-orange absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] animate-pulse">Scanning MIL-STD-810H & 1472H Reference Sets</p>
            </div>
          )}

          {result && (
            <div className="space-y-6 animate-in fade-in duration-500">
              {/* Standards */}
              <section>
                <h4 className="text-[10px] font-bold text-gray-400 mb-3 uppercase tracking-widest border-b border-hanwha-border pb-1">Identified Standards</h4>
                <div className="space-y-3">
                  {result.relevantStandards.map((std, idx) => (
                    <div key={idx} className="bg-white p-4 border border-hanwha-border border-l-4 border-l-hanwha-orange rounded shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-xs text-hanwha-dark tracking-tighter uppercase">{std.id}</span>
                        <div className="px-1.5 py-0.5 bg-hanwha-grey text-[9px] font-bold text-gray-500 rounded border border-hanwha-border">REFERENCE</div>
                      </div>
                      <p className="text-xs font-bold text-gray-800 mb-2 leading-tight">{std.title}</p>
                      <div className="bg-hanwha-grey/50 p-2 rounded text-[10px] text-gray-500 italic border border-hanwha-border">
                        {std.reason}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Recommendations */}
              <section>
                <h4 className="text-[10px] font-bold text-gray-400 mb-3 uppercase tracking-widest border-b border-hanwha-border pb-1">Technical Mitigation</h4>
                <div className="space-y-2">
                  {result.recommendations.map((rec, idx) => (
                    <div key={idx} className="flex gap-3 text-xs text-gray-700 bg-white p-3 rounded border border-hanwha-border shadow-sm">
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      {rec}
                    </div>
                  ))}
                </div>
              </section>

              {/* Risks */}
              <section>
                <h4 className="text-[10px] font-bold text-gray-400 mb-3 uppercase tracking-widest border-b border-hanwha-border pb-1">Compliance Discrepancies</h4>
                <div className="space-y-2">
                  {result.risks.map((risk, idx) => (
                    <div key={idx} className="flex gap-3 text-xs text-gray-700 bg-red-50 p-3 rounded border border-red-100 shadow-sm">
                      <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                      <span className="font-medium">{risk}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
