"use client";

import { useChat } from '@ai-sdk/react';
import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Minimize2, Maximize2, Leaf } from 'lucide-react';
import { cn } from '@/lib/utils';

export function FarmerAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
        api: '/api/chat',
        initialMessages: [
            { id: '1', role: 'assistant', content: "Hello! I'm your AI Agronomist. Ask me about crop diseases, fertilizers, or yield optimization." }
        ]
    });
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-brand-600 hover:bg-brand-700 text-white rounded-full shadow-lg shadow-brand-500/30 flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
            >
                <div className="relative">
                    <MessageSquare className="w-6 h-6" />
                    <span className="absolute -top-2 -right-2 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-brand-600"></span>
                    </span>
                </div>
            </button>
        );
    }

    return (
        <div
            className={cn(
                "fixed right-4 z-50 flex flex-col bg-white border border-slate-200 shadow-2xl overflow-hidden transition-all duration-300 ease-in-out origin-bottom-right",
                isMinimized
                    ? "bottom-4 w-72 h-14 rounded-xl"
                    : "bottom-4 sm:bottom-6 w-[calc(100vw-2rem)] sm:w-[400px] h-[550px] max-h-[85vh] rounded-2xl"
            )}
        >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-gradient-to-r from-brand-600 to-brand-700 text-white cursor-pointer" onClick={() => isMinimized && setIsMinimized(false)}>
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                        <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-sm">AI Agronomist</h3>
                        <p className="text-xs text-brand-100 opacity-90 leading-none">Powered by AgriScan</p>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }}
                        className="p-1.5 hover:bg-white/20 rounded-lg transition-colors text-white"
                        title={isMinimized ? "Expand" : "Minimize"}
                    >
                        {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                    </button>
                    {!isMinimized && (
                        <button
                            onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
                            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors text-white"
                            title="Close"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            {/* Chat Area */}
            {!isMinimized && (
                <>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 relative">
                        {messages.map((m) => (
                            <div key={m.id} className={cn("flex w-full", m.role === 'user' ? "justify-end" : "justify-start")}>
                                <div className={cn(
                                    "flex max-w-[85%] gap-2 shadow-sm",
                                    m.role === 'user'
                                        ? "bg-brand-600 text-white rounded-2xl rounded-tr-sm px-4 py-2"
                                        : "bg-white border border-slate-200 text-slate-700 rounded-2xl rounded-tl-sm px-4 py-3"
                                )}>
                                    {m.role === 'assistant' && (
                                        <div className="shrink-0 mt-0.5">
                                            <div className="w-6 h-6 rounded-full bg-brand-100 flex items-center justify-center">
                                                <Leaf className="w-3 h-3 text-brand-600" />
                                            </div>
                                        </div>
                                    )}
                                    <div className="prose prose-sm prose-slate max-w-none text-sm leading-relaxed whitespace-pre-wrap">
                                        {m.content}
                                    </div>
                                    {m.role === 'user' && (
                                        <div className="shrink-0 mt-0.5 ml-1">
                                            <div className="w-6 h-6 rounded-full bg-brand-500 flex items-center justify-center">
                                                <User className="w-3 h-3 text-white" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex w-full justify-start">
                                <div className="bg-white border border-slate-200 text-slate-700 rounded-2xl rounded-tl-sm px-4 py-3 flex gap-2 shadow-sm items-center">
                                    <div className="shrink-0">
                                        <div className="w-6 h-6 rounded-full bg-brand-100 flex items-center justify-center">
                                            <Leaf className="w-3 h-3 text-brand-600" />
                                        </div>
                                    </div>
                                    <div className="flex gap-1 ml-1 items-center h-4">
                                        <div className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                        <div className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                        <div className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-3 bg-white border-t border-slate-100">
                        <form onSubmit={handleSubmit} className="flex gap-2 relative">
                            <input
                                value={input}
                                onChange={handleInputChange}
                                placeholder="Ask about farming practices..."
                                className="flex-1 py-2.5 pl-4 pr-12 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all shadow-inner"
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || isLoading}
                                className="absolute right-1.5 top-1.5 bottom-1.5 w-8 rounded-lg bg-brand-600 text-white flex items-center justify-center disabled:opacity-50 disabled:bg-slate-300 transition-colors shadow-sm"
                            >
                                <Send className="w-4 h-4 ml-0.5" />
                            </button>
                        </form>
                        <div className="text-center mt-2">
                            <span className="text-[10px] text-slate-400">AI can make mistakes. Verify critical agronomic advice.</span>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
