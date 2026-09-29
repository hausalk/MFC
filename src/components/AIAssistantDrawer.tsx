import React, { useState } from 'react';
import { Sparkles, Send, Bot, User, BookOpen, Lightbulb, X } from 'lucide-react';

interface AIAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  datasetContext: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const AIAssistantDrawer: React.FC<AIAssistantDrawerProps> = ({
  isOpen,
  onClose,
  datasetContext,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        'Hello! I am your bioelectrochemistry and machine learning research assistant. I can help you interpret model results, formulate Physics-Informed Neural Networks (PINNs) constraints, or polish academic paragraphs for your Microbial Fuel Cells review paper. What would you like to explore?',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: Message = { role: 'user', content: query };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/gemini/assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Research Context: The user is writing an academic review paper titled "Microbial Fuel Cells: A Comprehensive Review of Fundamentals, Advancements, and Future Prospects for Sustainable Bioenergy Generation" and adding a new section "Machine Learning for MFC Performance Prediction".
They are predicting power_density_mWm2 from 11 variables (anode_material, cathode_material, membrane, substrate, COD_mgL, pH, temperature_C, electrode_area_cm2, reactor_volume_mL, coulombic_efficiency_pct, internal_resistance_ohm) using Ridge, Random Forest, and Gradient Boosting.
Current Dataset Summary: ${datasetContext}

Researcher's Question:
${query}

Please respond with rigorous academic prose suitable for an environmental science/engineering review paper.`,
          systemInstruction:
            'You are a senior bioelectrochemistry researcher and machine learning scientist with expertise in Microbial Fuel Cells (MFCs), extracellular electron transfer, polarization kinetics, and journal writing (ES&T, Water Research, Bioresource Technology).',
        }),
      });

      const data = await res.json();
      const reply = data.text || 'Unable to generate response at this time.';
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'Internal analysis note: In Microbial Fuel Cells, power density is governed by P_max = E_emf^2 / (4 * R_int). Machine learning captures non-linear substrate saturation (Monod kinetics) and ohmic impedance losses. Let me know if you need specific paragraph phrasing or LaTeX equations!',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const samplePrompts = [
    'How do I explain why Random Forest beats Linear Regression in MFCs?',
    'What are Physics-Informed ML (PINN) loss functions for bioelectrochemistry?',
    'Why does internal resistance dominate feature importance over COD?',
    'How should I respond to a reviewer asking about dataset sample size (N=55)?',
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-end">
      <div className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl border-l border-slate-200 animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Bioelectrochemical AI Advisor</h3>
              <p className="text-[11px] text-slate-500 font-mono">MFC Domain & ML Consultation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.role === 'assistant' && (
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}
              <div
                className={`p-3 rounded-xl max-w-[85%] leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-xs'
                    : 'bg-slate-100 text-slate-800 rounded-tl-xs border border-slate-200'
                }`}
              >
                <div className="whitespace-pre-wrap">{m.content}</div>
              </div>
              {m.role === 'user' && (
                <div className="w-6 h-6 rounded-full bg-slate-800 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-slate-500 text-xs italic">
              <Sparkles className="w-3.5 h-3.5 animate-spin text-blue-600" />
              <span>Formulating academic response...</span>
            </div>
          )}
        </div>

        {/* Suggested Prompts */}
        <div className="p-3 bg-slate-50 border-t border-slate-200">
          <span className="text-[10px] font-mono uppercase text-slate-500 block mb-1.5 font-semibold">
            Suggested Research Questions:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {samplePrompts.slice(0, 2).map((sp, i) => (
              <button
                key={i}
                onClick={() => handleSend(sp)}
                className="text-[11px] text-left p-1.5 rounded-md bg-white border border-slate-200 hover:border-blue-400 text-slate-700 hover:text-blue-700 transition-colors"
              >
                {sp}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-slate-200 bg-white flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask a bioelectrochemistry or ML question..."
            className="flex-1 text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            className="p-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-lg transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
