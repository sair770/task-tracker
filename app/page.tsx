import Link from 'next/link';
import TaskList from '@/components/TaskList';
import WhatsAppSimulator from '@/components/WhatsAppSimulator';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Mobile/Left Panel: Task List */}
      <div className="flex-1 p-6 md:p-12 overflow-y-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Family Tasks</h1>
            <p className="text-gray-500">Shared with everyone</p>
          </div>
          <Link href="/tv" className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition">
            📺 Open TV Mode
          </Link>
        </header>

        <TaskList />
      </div>

      {/* Desktop/Right Panel: WhatsApp Simulator */}
      <div className="flex-1 bg-white border-l border-gray-200 p-6 md:p-12 flex flex-col items-center justify-center">
        <div className="mb-6 text-center">
          <h2 className="text-xl font-bold text-gray-900">Add via WhatsApp</h2>
          <p className="text-gray-500 text-sm">Try typing "Buy Milk" below</p>
        </div>
        <WhatsAppSimulator />
      </div>
    </main>
  );
}
