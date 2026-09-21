import React, { useState } from 'react';
import { X, Send, Bot, User, ArrowRight, MessageSquare } from 'lucide-react';
import { Client } from '../../types';
import { aiManager } from '../../services/ai/aiManager';

interface AIChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeClient: Client | null;
  onActionTrigger?: (action: string, payload?: unknown) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  actionButton?: {
    label: string;
    action: string;
  };
}

export const AIChatDrawer: React.FC<AIChatDrawerProps> = ({
  isOpen,
  onClose,
  activeClient,
  onActionTrigger,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text: activeClient
        ? `Hello! I am your AI Marketing Director for **${activeClient.businessInfo.businessName}** in ${activeClient.businessInfo.city}. I have full context on your ${activeClient.products.length} products, current offers, and local audience pain points.\n\nHow can I help you drive local growth today?`
        : `Hello! I am your AI Marketing Director. Please add or select a client to start generating personalized campaigns and localized content.`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const quickChips = activeClient
    ? [
        `Recommend campaign for ${activeClient.businessInfo.city}`,
        'Draft 1-tap WhatsApp broadcast',
        'Evaluate brand consistency',
        'Formulate a retail offer',
      ]
    : [
        'How does MarketOS work?',
        'How do I onboard a new client?',
        'What features are available?',
      ];

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInput('');
    setLoading(true);

    try {
      if (!activeClient) {
        setMessages((prev) => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            sender: 'assistant',
            text: 'Please create or select an active client first. Once a client is selected, I can formulate custom marketing strategies, generate multi-channel campaigns, and write localized copy.',
          },
        ]);
        setLoading(false);
        return;
      }

      const provider = aiManager.getProvider();
      const q = textToSend.toLowerCase();

      let replyText = '';
      let actionBtn: { label: string; action: string } | undefined;

      if (q.includes('weekend') || q.includes('campaign')) {
        const recs = await provider.getDailyRecommendations(activeClient);
        const topRec = recs[0];
        replyText = `Based on **${activeClient.businessInfo.businessName}**'s product lineup and seasonal purchase patterns in ${activeClient.businessInfo.city}, here is my high-conviction recommendation:\n\n🔥 **${topRec.title}**\n• **Why:** ${topRec.why}\n• **Target Audience:** ${topRec.targetAudience}\n• **Offer Mechanics:** ${topRec.offer}\n• **CTA:** ${topRec.cta}\n\nWould you like me to generate the full multi-channel campaign machine pack?`;
        actionBtn = {
          label: 'Generate Full Campaign Now',
          action: 'open_campaign_machine',
        };
      } else if (q.includes('whatsapp') || q.includes('broadcast')) {
        const waContent = await provider.generateContent(activeClient, {
          platform: 'WhatsApp',
          contentType: 'WhatsApp Broadcast',
          tone: 'hinglish',
          language: activeClient.marketingGoals.preferredLanguage,
          campaignFocus: activeClient.products[0]?.name || 'Special Offer',
        });
        replyText = `Here is a high-conversion WhatsApp Broadcast drafted specifically for ${activeClient.businessInfo.businessName}:\n\n**${waContent.headline}**\n\n${waContent.primaryCopy}\n\n*CTA Trigger:* ${waContent.cta}`;
        actionBtn = {
          label: 'Open in Content Studio',
          action: 'open_content_studio',
        };
      } else if (q.includes('brand') || q.includes('consistency')) {
        const audit = await provider.analyzeBrandConsistency(
          activeClient,
          `${activeClient.businessInfo.businessName} in ${activeClient.businessInfo.city}. Visit our store or WhatsApp us at ${activeClient.businessInfo.whatsapp} for best deals!`
        );
        replyText = `### Brand Consistency Audit for ${activeClient.businessInfo.businessName}\n**Score:** ${audit.score}/100\n\n**Strengths:**\n${audit.strengths.map((s) => `• ${s}`).join('\n')}\n\n**Guidelines to remember:**\n• Maintain brand tone: *${activeClient.brandKit.brandTone}*\n• Always feature contact: *${activeClient.businessInfo.whatsapp}*\n• Primary Accent Color: *${activeClient.brandKit.primaryColor}*`;
        actionBtn = {
          label: 'Inspect Brand Kit',
          action: 'open_brand_kit',
        };
      } else {
        replyText = `I have analyzed **${activeClient.businessInfo.businessName}** in ${activeClient.businessInfo.city}. For maximum ROI this week, focus on your top product (**${activeClient.products[0]?.name || 'Hero Product'}**) with direct WhatsApp lead generation.\n\nLet me know if you want to generate visual creatives, craft copy, or review competitor opportunities!`;
        actionBtn = {
          label: 'Open AI Strategist',
          action: 'open_strategist',
        };
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          text: replyText,
          actionButton: actionBtn,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          text: 'I encountered an issue generating that response. Please try again or refine your query.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 transition-opacity"
        style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
        onClick={onClose}
      />

      {/* Slide-over Panel */}
      <div
        className="relative w-full max-w-md h-full flex flex-col z-10 shadow-2xl animate-slideLeft"
        style={{
          backgroundColor: 'var(--bg)',
          borderLeft: '1px solid var(--border)',
        }}
      >
        {/* Header */}
        <div
          className="p-4 border-b flex items-center justify-between"
          style={{ borderColor: 'var(--border)' }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center font-bold"
              style={{ backgroundColor: 'var(--btn-primary-bg)', color: 'var(--btn-primary-text)' }}
            >
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                AI Marketing Copilot
              </h3>
              <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                {activeClient ? `${activeClient.businessInfo.businessName} (${activeClient.businessInfo.city})` : 'No client selected'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-md transition-colors"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--hover-bg)';
              e.currentTarget.style.color = 'var(--text-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--text-muted)';
            }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {messages.map((m) => {
            const isUser = m.sender === 'user';
            return (
              <div
                key={m.id}
                className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div
                    className="w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5"
                    style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
                  >
                    <Bot className="w-3.5 h-3.5" style={{ color: 'var(--text-secondary)' }} />
                  </div>
                )}

                <div
                  className={`p-3.5 rounded-xl max-w-[85%] space-y-2 leading-relaxed whitespace-pre-wrap ${
                    isUser ? 'rounded-tr-none' : 'rounded-tl-none'
                  }`}
                  style={{
                    backgroundColor: isUser ? 'var(--btn-primary-bg)' : 'var(--bg-secondary)',
                    color: isUser ? 'var(--btn-primary-text)' : 'var(--text-primary)',
                    border: isUser ? 'none' : '1px solid var(--border)',
                  }}
                >
                  <p>{m.text}</p>

                  {m.actionButton && onActionTrigger && (
                    <button
                      onClick={() => onActionTrigger(m.actionButton!.action)}
                      className="mt-2 py-1 px-2.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all"
                      style={{
                        backgroundColor: 'var(--btn-primary-bg)',
                        color: 'var(--btn-primary-text)',
                      }}
                    >
                      <span>{m.actionButton.label}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {isUser && (
                  <div
                    className="w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5"
                    style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
                  >
                    <User className="w-3.5 h-3.5" style={{ color: 'var(--text-secondary)' }} />
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-2.5 items-center text-xs" style={{ color: 'var(--text-muted)' }}>
              <div
                className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
                style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
              >
                <Bot className="w-3.5 h-3.5" style={{ color: 'var(--text-secondary)' }} />
              </div>
              <div className="flex gap-1 py-2">
                <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: 'var(--text-muted)' }} />
                <span className="w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:0.2s]" style={{ backgroundColor: 'var(--text-muted)' }} />
                <span className="w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:0.4s]" style={{ backgroundColor: 'var(--text-muted)' }} />
              </div>
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div
          className="px-4 py-2 border-t overflow-x-auto no-scrollbar flex gap-1.5"
          style={{ borderColor: 'var(--border)' }}
        >
          {quickChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(chip)}
              className="text-[11px] px-2.5 py-1 rounded-md whitespace-nowrap transition-colors"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-strong)';
                e.currentTarget.style.color = 'var(--text-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }}
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div
          className="p-3 border-t"
          style={{ borderColor: 'var(--border)' }}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={activeClient ? `Ask about ${activeClient.businessInfo.businessName}...` : 'Type a message...'}
              className="flex-1 rounded-lg px-3 py-2 text-xs focus:outline-none transition-colors"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
              }}
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-2 rounded-lg transition-all disabled:opacity-30"
              style={{
                backgroundColor: 'var(--btn-primary-bg)',
                color: 'var(--btn-primary-text)',
              }}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
