"use client";

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useTaskStore } from '@/hooks/useTaskStore';
import { parseTaskInput } from '@/lib/smartParser';

export default function TaskInput() {
    const [input, setInput] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);
    const addTask = useTaskStore(state => state.addTask);

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim()) return;

        const parsed = parseTaskInput(input);
        addTask(parsed);
        setInput('');
        setIsExpanded(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (

        <div className={`transition-all duration-300 ease-in-out ${isExpanded ? 'fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm p-4' : 'relative z-10'}`}>
            {/* Click outside to cancel */}
            {isExpanded && (
                <div className="absolute inset-0" onClick={() => setIsExpanded(false)} />
            )}

            <div className={`relative w-full max-w-2xl transition-all duration-300 ${isExpanded ? 'scale-100 opacity-100' : 'scale-100 opacity-100'}`}>
                {/* Collapsed State: Button */}
                {!isExpanded ? (
                    <div className="flex justify-center">
                        <button
                            onClick={() => setIsExpanded(true)}
                            className="w-14 h-14 rounded-full bg-slate-900 text-white shadow-xl flex items-center justify-center hover:bg-slate-800 transition shadow-slate-300 hover:scale-110 active:scale-95 group"
                        >
                            <Plus size={24} className="group-hover:rotate-90 transition duration-300" />
                        </button>
                    </div>
                ) : (
                    /* Expanded State: Input */
                    <div className="bg-white p-4 rounded-3xl shadow-2xl w-full animate-in slide-in-from-bottom-10 fade-in duration-300">
                        <div className="flex justify-between items-center mb-2 px-1">
                            <span className="text-sm font-semibold text-slate-500">New Task</span>
                            <button
                                onClick={() => setIsExpanded(false)}
                                className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition"
                            >
                                <span className="sr-only">Cancel</span>
                                <Plus size={20} className="rotate-45" />
                            </button>
                        </div>

                        <div className="relative">
                            <textarea
                                autoFocus
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="e.g. 'Buy Milk tomorrow'"
                                className="w-full p-4 pr-14 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-slate-900 focus:ring-4 focus:ring-slate-100 shadow-inner focus:outline-none transition-all resize-none text-lg"
                                rows={3}
                            />
                            <button
                                onClick={() => handleSubmit()}
                                disabled={!input.trim()}
                                className="absolute right-3 bottom-3 p-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition transform active:scale-95"
                            >
                                <Plus size={20} />
                            </button>
                        </div>
                        <p className="text-xs text-gray-400 mt-3 px-2 flex justify-between">
                            <span className="flex items-center gap-1">⚡ Smart Parse</span>
                            <span>Shift+Enter for newline</span>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
