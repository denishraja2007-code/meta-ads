import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  Home,
  Sparkles,
  Send,
  RotateCcw,
  Copy,
  Check,
  Download,
  Bot,
  User,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Clock,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { CompanyDetails, IntelligenceResult, ComparisonReport, TimePeriod } from '../types';
import {
  CopilotMessage,
  CopilotPersona,
  generateLocalCopilotResponse,
} from '../utils/copilotEngine';

interface AICopilotViewProps {
  firstCompany?: CompanyDetails | null;
  secondCompany?: CompanyDetails | null;
  track?: string;
  location?: string;
  timePeriod?: TimePeriod;
  singleResult?: IntelligenceResult | null;
  comparisonReport?: ComparisonReport | null;
  initialQuery?: string;
  onBack: () => void;
  onHome: () => void;
  onNavigateToCompetitors: () => void;
}

export const AICopilotView: React.FC<AICopilotViewProps> = ({
  firstCompany,
  secondCompany,
  track = 'Shoes',
  location = 'Country · United States',
  timePeriod = 'Monthly',
  singleResult,
  comparisonReport,
  initialQuery,
  onBack,
  onHome,
  onNavigateToCompetitors,
}) => {
  const c1Name = firstCompany?.companyName || 'OptivaOne';
  const c2Name = secondCompany?.companyName || 'StrategyPulse AI';
  const activeTrack = firstCompany?.track || track || 'Shoes';

  // 4 Core Prompt Suggestions matching user's reference image
  const defaultPrompts = [
    {
      id: 'p1',
      text: 'Why is @novaathletics growing faster than @solsticeskincare?',
    },
    {
      id: 'p2',
      text: "Suggest next week's content calendar to outpace Orbit Coffee.",
    },
    {
      id: 'p3',
      text: "Predict @novaathletics' next campaign and posting time.",
    },
    {
      id: 'p4',
      text: 'Which content format performs best across all rivals?',
    },
  ];

  // Dynamically personalized prompts for tracked rivals
  const trackedPrompts = [
    {
      id: 'tp1',
      text: `Why is @${c2Name.toLowerCase().replace(/\s+/g, '')} growing faster than @${c1Name.toLowerCase().replace(/\s+/g, '')}?`,
    },
    {
      id: 'tp2',
      text: `Suggest next week's content calendar to outpace ${c2Name}.`,
    },
    {
      id: 'tp3',
      text: `Predict @${c2Name.toLowerCase().replace(/\s+/g, '')}'s next campaign and posting time.`,
    },
    {
      id: 'tp4',
      text: `Which content format performs best between ${c1Name} and ${c2Name}?`,
    },
  ];

  const [useTrackedPrompts, setUseTrackedPrompts] = useState(false);
  const [inputQuery, setInputQuery] = useState(initialQuery || '');
  const [messages, setMessages] = useState<CopilotMessage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const handledInitialQueryRef = useRef<string | null>(null);

  // Auto-scroll when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating]);

  // Handle external initialQuery prop (e.g. from Recommendations "Ask Copilot")
  useEffect(() => {
    if (initialQuery && initialQuery.trim() && handledInitialQueryRef.current !== initialQuery) {
      handledInitialQueryRef.current = initialQuery;
      handleSendMessage(initialQuery);
    }
  }, [initialQuery]);

  // Send message handler with bulletproof fallback
  const handleSendMessage = async (queryToSend?: string) => {
    const query = (queryToSend || inputQuery).trim();
    if (!query || isGenerating) return;

    const userMessage: CopilotMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuery('');
    setIsGenerating(true);

    let answered = false;

    try {
      // Fast fetch with 2500ms timeout so user never waits or hangs
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 2500);

      const response = await fetch('/api/copilot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          message: query,
          history: messages.slice(-4),
          context: {
            firstCompany,
            secondCompany,
            track: activeTrack,
            location,
            timePeriod,
            activePersona: 'strategic',
          },
        }),
      });

      clearTimeout(timer);

      if (response.ok) {
        const data = await response.json();
        if (data.reply && typeof data.reply === 'string' && data.reply.trim().length > 10) {
          const assistantMessage: CopilotMessage = {
            id: `assistant-${Date.now()}`,
            role: 'assistant',
            content: data.reply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            suggestedFollowUps: data.suggestedFollowUps || [
              `Draft 3 high-converting ad hooks targeting this rival`,
              `What are the peak posting hours for our category?`,
              `Provide an executive battlecard breakdown`,
            ],
          };
          setMessages((prev) => [...prev, assistantMessage]);
          setIsGenerating(false);
          answered = true;
          return;
        }
      }
    } catch {
      // Abort or network failure - seamlessly fallback to local engine
    }

    if (!answered) {
      // High-fidelity local intelligence engine provides instant authoritative response
      const localResult = generateLocalCopilotResponse(query, {
        firstCompany,
        secondCompany,
        track: activeTrack,
        location,
        timePeriod,
        singleResult,
        comparisonReport,
        activePersona: 'strategic',
      });

      const assistantMessage: CopilotMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: localResult.content,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedFollowUps: localResult.suggestedFollowUps,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsGenerating(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportConversation = () => {
    const text = messages
      .map(
        (m) =>
          `[${m.role.toUpperCase()} - ${m.timestamp}]\n${m.content}\n-----------------------------------\n`
      )
      .join('\n');
    const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `optivaone-copilot-insights-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleStartNewQuestion = () => {
    setMessages([]);
    setInputQuery('');
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  // Render markdown line-by-line
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');

    return (
      <div className="space-y-2 text-sm leading-relaxed text-slate-200">
        {lines.map((line, idx) => {
          const trimmed = line.trim();

          if (!trimmed) {
            return <div key={idx} className="h-1.5" />;
          }

          if (trimmed.startsWith('### ')) {
            return (
              <h3 key={idx} className="text-base font-bold text-white tracking-tight pt-2 pb-1 border-b border-white/5">
                {trimmed.replace('### ', '')}
              </h3>
            );
          }
          if (trimmed.startsWith('#### ')) {
            return (
              <h4 key={idx} className="text-sm font-semibold text-purple-300 pt-1.5">
                {trimmed.replace('#### ', '')}
              </h4>
            );
          }

          if (trimmed.startsWith('> ')) {
            return (
              <div
                key={idx}
                className="pl-3.5 border-l-2 border-purple-500 bg-purple-950/20 py-1.5 my-1.5 text-xs text-purple-200 rounded-r-md italic"
              >
                {trimmed.replace('> ', '').replace(/\*/g, '')}
              </div>
            );
          }

          if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            const itemText = trimmed.substring(2);
            const boldParts = itemText.split(/\*\*(.*?)\*\*/g);

            return (
              <div key={idx} className="flex items-start gap-2 text-xs md:text-sm pl-1">
                <span className="text-purple-400 mt-1 select-none font-bold text-xs">◆</span>
                <span className="text-slate-300">
                  {boldParts.map((part, pIdx) =>
                    pIdx % 2 === 1 ? (
                      <strong key={pIdx} className="text-white font-semibold">
                        {part}
                      </strong>
                    ) : (
                      part
                    )
                  )}
                </span>
              </div>
            );
          }

          if (/^\d+\.\s/.test(trimmed)) {
            const num = trimmed.match(/^(\d+\.)/)?.[0] || '';
            const itemText = trimmed.replace(/^\d+\.\s/, '');
            const boldParts = itemText.split(/\*\*(.*?)\*\*/g);

            return (
              <div key={idx} className="flex items-start gap-2.5 text-xs md:text-sm pl-1">
                <span className="text-purple-400 font-mono text-xs font-semibold shrink-0 mt-0.5">
                  {num}
                </span>
                <span className="text-slate-300">
                  {boldParts.map((part, pIdx) =>
                    pIdx % 2 === 1 ? (
                      <strong key={pIdx} className="text-white font-semibold">
                        {part}
                      </strong>
                    ) : (
                      part
                    )
                  )}
                </span>
              </div>
            );
          }

          // Table row
          if (trimmed.startsWith('|')) {
            const cells = trimmed
              .split('|')
              .filter((c) => c.trim() !== '')
              .map((c) => c.trim());

            if (trimmed.includes('---')) {
              return null;
            }

            const isHeader = lines[idx + 1]?.includes('---');

            return (
              <div
                key={idx}
                className={`grid grid-cols-4 gap-2 text-xs py-1.5 px-2 rounded-lg border border-white/5 my-1 overflow-x-auto ${
                  isHeader
                    ? 'bg-purple-950/40 text-purple-200 font-semibold'
                    : 'bg-white/[0.02] text-slate-300'
                }`}
              >
                {cells.map((cell, cIdx) => (
                  <div key={cIdx} className="truncate">
                    {cell.replace(/\*\*/g, '')}
                  </div>
                ))}
              </div>
            );
          }

          const boldParts = line.split(/\*\*(.*?)\*\*/g);
          return (
            <p key={idx} className="text-xs md:text-sm text-slate-300">
              {boldParts.map((part, pIdx) =>
                pIdx % 2 === 1 ? (
                  <strong key={pIdx} className="text-white font-semibold">
                    {part}
                  </strong>
                ) : (
                  part
                )
              )}
            </p>
          );
        })}
      </div>
    );
  };

  const activePrompts = useTrackedPrompts ? trackedPrompts : defaultPrompts;

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-200 text-slate-200">
      {/* Top navigation row */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            aria-label="Go back"
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] backdrop-blur px-3.5 py-2 text-sm text-slate-400 hover:text-white hover:bg-white/[0.08] transition cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </button>

          <button
            type="button"
            onClick={onHome}
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] backdrop-blur px-3.5 py-2 text-sm text-slate-400 hover:text-white hover:bg-white/[0.08] transition cursor-pointer"
          >
            <Home className="h-4 w-4" />
            <span>Home</span>
          </button>
        </div>

        {/* Current status pill */}
        <div className="hidden sm:flex items-center gap-3 text-xs text-slate-400 font-mono">
          <span className="flex items-center gap-1.5 text-purple-400">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            <span>AI Copilot Engine Active</span>
          </span>
          <span aria-hidden="true" className="text-slate-600">
            ·
          </span>
          <span>{activeTrack}</span>
        </div>
      </div>

      {/* Main Header matching exact Screenshot */}
      <div className="space-y-1.5">
        <div className="text-xs font-mono uppercase tracking-[0.25em] text-slate-400 font-semibold flex items-center gap-2">
          <span>05 · AI COPILOT</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
          Ask anything about your rivals.
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-2xl leading-relaxed">
          Grounded in your tracked competitors' engagement, cadence, and creative patterns.
        </p>
      </div>

      {/* Main Container Card matching exact Screenshot */}
      <div className="rounded-3xl border border-white/10 bg-[#0d0f28]/80 backdrop-blur-xl p-6 sm:p-10 md:p-12 relative flex flex-col justify-between min-h-[480px] shadow-2xl overflow-hidden">
        {/* VIEW A: Pristine Initial State with 2x2 Grid (when no conversation started) */}
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col justify-center items-center py-6">
            {/* Sparkling Icon Circle matching Screenshot */}
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-600 to-violet-500 shadow-lg shadow-purple-600/40 flex items-center justify-center text-white mb-4">
              <Sparkles className="w-7 h-7 text-white" />
            </div>

            {/* Headings matching Screenshot */}
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight text-center">
              Start with a question
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 mb-6 text-center">
              Or try one of these:
            </p>

            {/* Optional switch for custom tracked rivals */}
            {firstCompany && (
              <div className="flex items-center gap-2 mb-4 p-1 rounded-xl bg-white/[0.03] border border-white/10 text-xs">
                <button
                  type="button"
                  onClick={() => setUseTrackedPrompts(false)}
                  className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                    !useTrackedPrompts ? 'bg-purple-600 text-white font-medium' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Standard Prompts
                </button>
                <button
                  type="button"
                  onClick={() => setUseTrackedPrompts(true)}
                  className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                    useTrackedPrompts ? 'bg-purple-600 text-white font-medium' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Tracked: {c1Name} vs {c2Name}
                </button>
              </div>
            )}

            {/* 2x2 Grid of Prompt Cards matching Screenshot */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 max-w-2xl mx-auto w-full">
              {activePrompts.map((prompt) => (
                <button
                  key={prompt.id}
                  type="button"
                  onClick={() => handleSendMessage(prompt.text)}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.07] hover:border-purple-500/40 p-4 text-left text-xs sm:text-sm text-slate-200 transition-all cursor-pointer flex items-center justify-between group shadow-sm"
                >
                  <span className="leading-snug pr-2 group-hover:text-white transition-colors">
                    {prompt.text}
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* VIEW B: Active Live Conversation View */
          <div className="flex-1 flex flex-col space-y-5 pb-6">
            {/* Conversation Header Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center gap-2 text-xs font-mono text-purple-300">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>Live Grounded Analysis</span>
                <span className="text-slate-600">·</span>
                <span className="text-slate-400">{messages.length} messages</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleStartNewQuestion}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-white/10 bg-white/[0.04] text-xs text-slate-300 hover:text-white hover:bg-white/[0.08] transition cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Start New Question</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportConversation}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-white/10 bg-white/[0.04] text-xs text-slate-300 hover:text-white hover:bg-white/[0.08] transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-purple-400" />
                  <span>Export</span>
                </button>
              </div>
            </div>

            {/* Conversation Message List */}
            <div className="space-y-5 max-h-[500px] overflow-y-auto pr-1">
              {messages.map((msg) => {
                const isUser = msg.role === 'user';

                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3.5 ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isUser && (
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shrink-0 mt-1 shadow-md shadow-purple-900/30">
                        <Sparkles className="w-4 h-4" />
                      </div>
                    )}

                    <div
                      className={`max-w-[85%] rounded-2xl p-4 sm:p-5 shadow-lg ${
                        isUser
                          ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium text-sm'
                          : 'bg-[#08091a]/90 border border-white/10 text-slate-200'
                      }`}
                    >
                      {isUser ? (
                        <p className="text-sm leading-relaxed">{msg.content}</p>
                      ) : (
                        <div className="space-y-4">
                          {renderFormattedContent(msg.content)}

                          {/* Assistant message action strip */}
                          <div className="flex items-center justify-between pt-3 border-t border-white/5 text-xs text-slate-400">
                            <span className="font-mono text-[11px]">{msg.timestamp}</span>

                            <button
                              type="button"
                              onClick={() => handleCopy(msg.id, msg.content)}
                              className="inline-flex items-center gap-1 text-slate-400 hover:text-white transition cursor-pointer"
                            >
                              {copiedId === msg.id ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                  <span className="text-emerald-400">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                          </div>

                          {/* Suggested follow-up chips */}
                          {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                            <div className="pt-2 space-y-1.5">
                              <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold font-mono">
                                Suggested Follow-ups:
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {msg.suggestedFollowUps.map((prompt, idx) => (
                                  <button
                                    key={idx}
                                    type="button"
                                    onClick={() => handleSendMessage(prompt)}
                                    className="px-3 py-1.5 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-purple-600/20 hover:border-purple-500/40 text-xs text-slate-300 hover:text-purple-200 transition cursor-pointer text-left"
                                  >
                                    {prompt}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {isUser && (
                      <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-slate-300 shrink-0 mt-1">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Generating loading indicator */}
              {isGenerating && (
                <div className="flex items-start gap-3.5 justify-start">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shrink-0 mt-1 animate-pulse">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="bg-[#08091a]/90 border border-white/10 rounded-2xl p-4 text-xs text-purple-300 flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
                    <span>Analyzing competitor telemetry & synthesizing strategic findings...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>
        )}

        {/* Bottom Input Area matching exact Screenshot */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="pt-4 border-t border-white/5 flex items-center gap-3 w-full"
        >
          <input
            ref={inputRef}
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask about a competitor, a format, or next week's plan..."
            className="flex-1 bg-[#08091a]/90 border border-white/10 rounded-2xl px-5 py-3.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition shadow-inner"
          />

          <button
            type="submit"
            disabled={!inputQuery.trim() || isGenerating}
            className={`px-6 py-3.5 rounded-2xl font-medium text-xs sm:text-sm flex items-center gap-2 transition shadow-lg shrink-0 cursor-pointer ${
              inputQuery.trim() && !isGenerating
                ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-900/40'
                : 'bg-white/5 text-slate-500 cursor-not-allowed border border-white/5'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
