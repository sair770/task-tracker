"use client";

import { useTaskStore } from '@/hooks/useTaskStore';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function TVPage() {
    const { tasks, fetchTasks } = useTaskStore();
    const [mounted, setMounted] = useState(false);
    const [currentTime, setCurrentTime] = useState('');

    useEffect(() => {
        setMounted(true);
        // Initial Time
        setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        fetchTasks();

        const timer = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        }, 1000);

        const syncTimer = setInterval(fetchTasks, 2000);

        return () => {
            clearInterval(timer);
            clearInterval(syncTimer);
        };
    }, []);

    if (!mounted) return <div className="min-h-screen bg-slate-950" />;

    const activeTasks = tasks.filter(t => !t.completed);

    return (
        <main className="min-h-screen bg-slate-950 text-white p-12 overflow-hidden selection:bg-transparent">
            {/* TV Header */}
            <header className="flex justify-between items-end mb-12 border-b border-slate-800 pb-6">
                <div>
                    <h1 className="text-5xl font-black tracking-tight mb-2">Today's Tasks</h1>
                    <p className="text-2xl text-slate-400">Family Dashboard</p>
                </div>
                <div className="text-6xl font-thin font-mono text-slate-200">
                    {currentTime}
                </div>
            </header>

            {/* TV Grid */}
            <div className="grid grid-cols-2 gap-8">
                {activeTasks.length === 0 ? (
                    <div className="col-span-2 flex flex-col items-center justify-center h-96 text-slate-500">
                        <p className="text-4xl text-center">All caught up!</p>
                        <p className="text-2xl mt-4">Great job team 🎉</p>
                    </div>
                ) : (
                    activeTasks.map((task) => (
                        <div key={task.id} className="bg-slate-900 p-8 rounded-3xl border border-slate-800 flex items-center gap-6">
                            <div className="h-12 w-12 rounded-full border-4 border-slate-600 flex-shrink-0" />
                            <div className="overflow-hidden">
                                <div className="text-4xl font-medium truncate">{task.title}</div>
                                {task.dueDate && (
                                    <div className="text-xl text-slate-400 mt-2 flex items-center gap-2">
                                        Due: {new Date(task.dueDate).toLocaleDateString()}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Footer Hint */}
            <div className="absolute bottom-12 right-12 text-slate-600 text-xl">
                Press <span className="bg-slate-800 px-3 py-1 rounded mx-1 text-slate-400">SELECT</span> to mark done
            </div>

            <Link href="/" className="absolute bottom-12 left-12 text-slate-700 hover:text-white transition">
                ← Back to Phone View
            </Link>
        </main>
    );
}
