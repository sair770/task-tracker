import { Link } from 'react-router-dom';
import TaskList from '@/components/TaskList';
import TaskInput from '@/components/TaskInput';

export default function Home() {
    return (
        <main className="min-h-screen bg-gray-50 flex justify-center items-start md:items-center p-0 md:p-6">
            {/* Main Panel: Task List */}
            <div className="w-full max-w-2xl flex flex-col h-[100dvh] md:h-[85vh] overflow-hidden shadow-none md:shadow-2xl rounded-none md:rounded-3xl bg-white border border-gray-100">
                <div className="flex-1 overflow-y-auto p-6 md:p-10 scrollbar-thin">
                    <header className="mb-8 flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Family Tasks</h1>
                            <p className="text-gray-500">Shared with everyone</p>
                        </div>
                        <Link to="/tv" className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition">
                            📺 Open TV Mode
                        </Link>
                    </header>

                    <TaskList />
                </div>

                <div className="p-6 md:p-10 bg-gray-50 border-t border-gray-200 md:border-none shrink-0 md:rounded-b-3xl">
                    <TaskInput />
                </div>
            </div>
        </main>
    );
}
