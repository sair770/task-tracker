"use client";

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';
import { useTaskStore } from '@/hooks/useTaskStore';
import { parseTaskInput } from '@/lib/smartParser';

export default function WhatsAppSimulator() {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<{ id: string, text: string, sender: 'user' | 'bot' }[]>([
        { id: '1', text: 'Hi! I am your Task Bot. Send me a message to add a task.', sender: 'bot' }
    ]);
    const addTask = useTaskStore((state) => state.addTask);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim()) return;

        const userMsg = input;
        setInput('');
        setMessages(prev => [...prev, { id: crypto.randomUUID(), text: userMsg, sender: 'user' }]);

        // Simulate Bot Response & Action
        setTimeout(() => {
            const parsedTask = parseTaskInput(userMsg);
            addTask(parsedTask);

            let responseText = `✅ Added "${parsedTask.title}"`;
            if (parsedTask.dueDate) {
                responseText += ` due ${new Date(parsedTask.dueDate).toLocaleDateString()}`;
            }

            setMessages(prev => [...prev, {
                id: crypto.randomUUID(),
                text: responseText,
                sender: 'bot'
            }]);
        }, 600);
    };

    return (
        <div className="flex flex-col h-[600px] w-full max-w-md bg-[#efeae2] rounded-xl overflow-hidden shadow-2xl border border-gray-200">
            {/* Header */}
            <div className="bg-[#008069] p-4 flex items-center text-white shadow-md">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-3">
                    <Bot size={24} />
                </div>
                <div>
                    <h3 className="font-bold">Task Bot</h3>
                    <p className="text-xs opacity-90">Meta Cloud API (Demo)</p>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4" ref={scrollRef}>
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-3 rounded-lg shadow-sm text-sm ${msg.sender === 'user'
                            ? 'bg-[#d9fdd3] text-gray-800 rounded-tr-none'
                            : 'bg-white text-gray-800 rounded-tl-none'
                            }`}>
                            {msg.text}
                            <div className="text-[10px] text-gray-400 text-right mt-1">
                                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Input */}
            <div className="p-3 bg-gray-100">
                <form onSubmit={handleSend} className="flex items-end gap-2">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                        placeholder="Type a message..."
                        className="flex-1 p-3 rounded-2xl border border-gray-300 focus:outline-none focus:border-[#008069] min-h-[44px] max-h-32 resize-none"
                        rows={1}
                        style={{ height: 'auto', minHeight: '44px' }}
                    />

                    <button type="submit" className="p-3 bg-[#008069] text-white rounded-full hover:bg-[#006d59] transition">
                        <Send size={20} />
                    </button>
                </form>
            </div>
        </div>
    );
}
