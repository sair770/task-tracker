"use client";

import { create } from 'zustand';
import { Task } from '@/types';

interface TaskState {
    tasks: Task[];
    isLoading: boolean;
    fetchTasks: () => Promise<void>;
    addTask: (task: { title: string, description?: string, dueDate?: number }) => Promise<void>;
    toggleTask: (id: string) => Promise<void>;
    removeTask: (id: string) => Promise<void>;
}

export const useTaskStore = create<TaskState>((set, get) => ({
    tasks: [],
    isLoading: false,

    fetchTasks: async () => {
        set({ isLoading: true });
        try {
            const res = await fetch('/api/tasks');
            const data = await res.json();
            set({ tasks: data });
        } catch (e) {
            console.error("Sync error", e);
        } finally {
            set({ isLoading: false });
        }
    },

    addTask: async (task) => {
        if (!task.title.trim()) return;

        // Optimistic Update
        const newTask = {
            id: Math.random().toString(36).substring(2, 9) + Date.now().toString(36),
            title: task.title.trim(),
            description: task.description,
            dueDate: task.dueDate,
            completed: false,
            createdAt: Date.now(),
        };

        set(state => ({ tasks: [newTask, ...state.tasks] }));

        // Sync to Server
        await fetch('/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'add', task: newTask })
        });

        // Background re-fetch to ensure consistency
        get().fetchTasks();
    },

    toggleTask: async (id) => {
        // Optimistic
        set(state => ({
            tasks: state.tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
        }));

        await fetch('/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'toggle', id })
        });
    },

    removeTask: async (id) => {
        // Optimistic
        set(state => ({
            tasks: state.tasks.filter(t => t.id !== id)
        }));

        await fetch('/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'remove', id })
        });
    },
}));
