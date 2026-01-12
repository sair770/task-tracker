"use client";

import { useTaskStore } from '@/hooks/useTaskStore';
import { Check, Trash2, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function TaskList() {
    const { tasks, toggleTask, removeTask } = useTaskStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null; // Avoid hydration mismatch with localStorage

    const activeTasks = tasks.filter(t => !t.completed);
    const completedTasks = tasks.filter(t => t.completed);

    return (
        <div className="w-full max-w-md mx-auto space-y-6">
            {/* Active Tasks */}
            <div className="space-y-3">
                <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800">
                    <Clock className="text-blue-500" />
                    Pending ({activeTasks.length})
                </h2>
                {activeTasks.length === 0 && (
                    <p className="text-gray-400 italic text-center py-4">No pending tasks. You're all caught up!</p>
                )}
                {activeTasks.map(task => (
                    <div key={task.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between group">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => toggleTask(task.id)}
                                className="w-6 h-6 rounded-full border-2 border-gray-300 hover:border-blue-500 transition flex items-center justify-center"
                            >
                                {/* Empty circle */}
                            </button>
                            <div className="flex flex-col">
                                <span className="text-gray-800 font-medium">{task.title}</span>
                                {task.description && <span className="text-xs text-gray-500 line-clamp-1">{task.description}</span>}
                                {task.dueDate && (
                                    <span className="text-xs text-blue-600 flex items-center gap-1 mt-0.5">
                                        <Clock size={10} />
                                        {new Date(task.dueDate).toLocaleDateString()}
                                    </span>
                                )}
                            </div>
                        </div>
                        <button onClick={() => removeTask(task.id)} className="text-gray-300 hover:text-red-500 transition opacity-0 group-hover:opacity-100">
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))}
            </div>

            {/* Completed Tasks */}
            {completedTasks.length > 0 && (
                <div className="space-y-3 pt-4 border-t">
                    <h2 className="text-lg font-semibold text-gray-500">Completed</h2>
                    {completedTasks.map(task => (
                        <div key={task.id} className="bg-gray-50 p-3 rounded-lg flex items-center justify-between opacity-70">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => toggleTask(task.id)}
                                    className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white"
                                >
                                    <Check size={14} />
                                </button>
                                <span className="text-gray-500 line-through">{task.title}</span>
                            </div>
                            <button onClick={() => removeTask(task.id)} className="text-gray-300 hover:text-red-500 transition">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
