"use client";

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Task } from '@/types';

interface TaskState {
    tasks: Task[];
    addTask: (task: { title: string, description?: string, dueDate?: number }) => void;
    toggleTask: (id: string) => void;
    removeTask: (id: string) => void;
}

export const useTaskStore = create<TaskState>()(
    persist(
        (set) => ({
            tasks: [],
            addTask: (task) => {
                if (!task.title.trim()) return;
                set((state) => ({
                    tasks: [
                        {
                            id: crypto.randomUUID(),
                            title: task.title.trim(),
                            description: task.description,
                            dueDate: task.dueDate,
                            completed: false,
                            createdAt: Date.now(),
                        },
                        ...state.tasks,
                    ],
                }));
            },
            toggleTask: (id) => set((state) => ({
                tasks: state.tasks.map((t) =>
                    t.id === id ? { ...t, completed: !t.completed } : t
                ),
            })),
            removeTask: (id) => set((state) => ({
                tasks: state.tasks.filter((t) => t.id !== id),
            })),
        }),
        {
            name: 'shared_tasks_v1',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
