'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const QUICK_REPLIES = [
  'Book an appointment',
  'Find a specialist',
  'Emergency help',
  'Check my symptoms',
];

const BOT_RESPONSES = {
  default:
    "I'm your MediCare AI Assistant! I can help you find doctors, book appointments, or answer health questions. What would you like to know?",
  appointment:
    "To book an appointment, you can:\n1. Click 'Book Appointment' on our website\n2. Call us at +91 98765 43210\n3. Visit our reception desk\n\nWould you like me to guide you through online booking?",
  doctor:
    'We have 500+ specialist doctors across 25+ departments. You can search by:\n• Specialty or department\n• Doctor name\n• Availability\n\nVisit our Doctors page to find the right specialist for you.',
  emergency:
    '🚨 For medical emergencies, please:\n• Call immediately: +91 98765 43210\n• Visit our Emergency Department (open 24/7)\n• We\'re located at 123 Healthcare Avenue\n\nDo NOT delay — call emergency services first!',
  symptoms:
    'I can provide general guidance, but please consult a doctor for proper diagnosis. Common departments based on symptoms:\n• Chest pain → Cardiology\n• Headache/dizziness → Neurology\n• Joint pain → Orthopedics\n• Fever/infection → General Medicine\n\nWould you like to book an appointment?',
};

function getBotResponse(message) {
  const lower = message.toLowerCase();
  if (lower.includes('appointment') || lower.includes('book')) return BOT_RESPONSES.appointment;
  if (lower.includes('doctor') || lower.includes('specialist') || lower.includes('find'))
    return BOT_RESPONSES.doctor;
  if (lower.includes('emergency') || lower.includes('urgent') || lower.includes('help'))
    return BOT_RESPONSES.emergency;
  if (lower.includes('symptom') || lower.includes('pain') || lower.includes('sick'))
    return BOT_RESPONSES.symptoms;
  return BOT_RESPONSES.default;
}

export function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, role: 'bot', text: BOT_RESPONSES.default },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async (text) => {
    const msg = text || input;
    if (!msg.trim()) return;
    const userMsg = { id: Date.now(), role: 'user', text: msg };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    const botMsg = { id: Date.now() + 1, role: 'bot', text: getBotResponse(msg) };
    setMessages((m) => [...m, botMsg]);
    setLoading(false);
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:shadow-xl hover:bg-blue-700 flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{ y: open ? 100 : 0, opacity: open ? 0 : 1 }}
      >
        <MessageCircle className="w-6 h-6" />
        <span className="absolute top-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col"
            style={{ height: '500px' }}
          >
            {/* Header */}
            <div className="bg-blue-600 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">MediCare Assistant</p>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full" />
                    <span className="text-blue-200 text-xs">Online</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-white hover:bg-white/20 rounded-lg p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                      msg.role === 'bot' ? 'bg-blue-100' : 'bg-gray-100'
                    }`}
                  >
                    {msg.role === 'bot' ? (
                      <Bot className="w-4 h-4 text-blue-600" />
                    ) : (
                      <User className="w-4 h-4 text-gray-600" />
                    )}
                  </div>
                  <div
                    className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm whitespace-pre-line ${
                      msg.role === 'bot'
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-blue-600 text-white'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex gap-2">
                  <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="bg-gray-100 rounded-2xl px-3 py-2">
                    <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                  </div>
                </div>
              )}
            </div>

            {/* Quick Replies */}
            <div className="px-4 py-2 flex gap-1 overflow-x-auto scrollbar-none">
              {QUICK_REPLIES.map((r) => (
                <button
                  key={r}
                  onClick={() => sendMessage(r)}
                  className="shrink-0 text-xs bg-blue-50 text-blue-600 border border-blue-100 px-3 py-1 rounded-full hover:bg-blue-100 transition-colors"
                >
                  {r}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="p-3 border-t flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="text-sm"
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              />
              <Button
                size="icon"
                onClick={() => sendMessage()}
                className="bg-blue-600 hover:bg-blue-700 shrink-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
