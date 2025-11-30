import React, { useState } from 'react';
import { clsx } from 'clsx';
import { SparklesIcon, ClockIcon } from '@heroicons/react/24/outline';

const QueryInterface = () => {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState(null);
    const [loading, setLoading] = useState(false);

    const quickQuestions = [
        "Was anyone home today?",
        "What happened this morning?",
        "Any threats detected?",
        "How many people visited?"
    ];

    const handleAsk = async (q) => {
        const questionToAsk = q || question;
        if (!questionToAsk.trim()) return;

        setLoading(true);
        try {
            const res = await fetch('http://localhost:8001/query', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question: questionToAsk })
            });

            if (!res.ok) {
                throw new Error(`Server error: ${res.status}`);
            }

            const data = await res.json();
            setAnswer(data);
        } catch (err) {
            setAnswer({ success: false, error: err.message });
        }
        setLoading(false);
    };

    return (
        <div className="bg-obsidian/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <SparklesIcon className="w-6 h-6 text-neon-purple" />
                <h2 className="text-xl font-bold text-white">Ask AEGIS AI</h2>
                <span className="ml-auto text-xs text-neon-purple/70 font-mono">🏆 COMPETITION FEATURE</span>
            </div>

            {/* Quick Questions */}
            <div className="mb-4">
                <p className="text-xs text-slate-400 mb-2">Quick questions:</p>
                <div className="flex flex-wrap gap-2">
                    {quickQuestions.map((q, i) => (
                        <button
                            key={i}
                            onClick={() => {
                                setQuestion(q);
                                handleAsk(q);
                            }}
                            className="px-3 py-1 text-xs bg-neon-purple/10 border border-neon-purple/30 rounded-lg hover:bg-neon-purple/20 transition-colors text-neon-purple"
                        >
                            {q}
                        </button>
                    ))}
                </div>
            </div>

            {/* Input */}
            <div className="flex gap-2 mb-4">
                <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAsk()}
                    placeholder="Ask about your security footage..."
                    className="flex-1 bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-neon-purple/50"
                />
                <button
                    onClick={() => handleAsk()}
                    disabled={loading || !question.trim()}
                    className={clsx(
                        "px-6 py-2 rounded-lg font-medium transition-all",
                        loading || !question.trim()
                            ? "bg-slate-700 text-slate-500 cursor-not-allowed"
                            : "bg-neon-purple hover:bg-neon-purple/80 text-white"
                    )}
                >
                    {loading ? "Thinking..." : "Ask"}
                </button>
            </div>

            {/* Answer */}
            {answer && (
                <div className={clsx(
                    "p-4 rounded-xl border",
                    answer.success
                        ? "bg-neon-purple/5 border-neon-purple/30"
                        : "bg-red-500/5 border-red-500/30"
                )}>
                    {answer.success ? (
                        <>
                            <p className="text-white mb-3">{answer.answer}</p>
                            <div className="flex items-center gap-4 text-xs text-slate-400">
                                <span>Confidence: {(answer.confidence * 100).toFixed(0)}%</span>
                                <span className="flex items-center gap-1">
                                    <ClockIcon className="w-3 h-3" />
                                    {answer.inference_time_ms?.toFixed(0)}ms
                                </span>
                                <span>{answer.total_events_analyzed} events analyzed</span>
                            </div>
                        </>
                    ) : (
                        <p className="text-red-400">{answer.error}</p>
                    )}
                </div>
            )}

            {/* Powered by */}
            <div className="mt-4 text-center">
                <p className="text-xs text-slate-500">
                    Powered by <span className="text-neon-purple font-semibold">Parallax AI</span> • Zero cloud costs
                </p>
            </div>
        </div>
    );
};

export default QueryInterface;
