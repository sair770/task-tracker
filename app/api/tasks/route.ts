import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// DATA STORAGE STRATEGY
// 1. Try to read/write to a local file (Persistent on VPS/Docker/Localhost)
// 2. Fallback to In-Memory (Serverless/Vercel) if file access fails

const DATA_FILE = path.join(process.cwd(), 'data', 'tasks.json');
let IN_MEMORY_TASKS: any[] = [];
let isFileStorageWorking = false;

// Initialize: Try to load from file
try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    if (fs.existsSync(DATA_FILE)) {
        const fileContent = fs.readFileSync(DATA_FILE, 'utf-8');
        IN_MEMORY_TASKS = JSON.parse(fileContent);
        isFileStorageWorking = true;
        console.log("✅ Loaded tasks from disk");
    } else {
        // Try writing empty array to check permissions
        fs.writeFileSync(DATA_FILE, JSON.stringify([]));
        isFileStorageWorking = true;
        console.log("✅ Created new task database on disk");
    }
} catch (e) {
    console.log("ℹ️ Running in Serverless/Ephemeral mode (No persistent disk)");
}

function saveTasks() {
    if (isFileStorageWorking) {
        try {
            fs.writeFileSync(DATA_FILE, JSON.stringify(IN_MEMORY_TASKS, null, 2));
        } catch (e) {
            console.error("Failed to save to disk", e);
        }
    }
}

export async function GET() {
    return NextResponse.json(IN_MEMORY_TASKS);
}

export async function POST(request: Request) {
    const body = await request.json();
    const { action, task, id } = body;

    if (action === 'add') {
        IN_MEMORY_TASKS.unshift(task);
    } else if (action === 'toggle') {
        IN_MEMORY_TASKS = IN_MEMORY_TASKS.map(t =>
            t.id === id ? { ...t, completed: !t.completed } : t
        );
    } else if (action === 'remove') {
        IN_MEMORY_TASKS = IN_MEMORY_TASKS.filter(t => t.id !== id);
    }

    // Persist changes
    saveTasks();

    return NextResponse.json(IN_MEMORY_TASKS);
}
