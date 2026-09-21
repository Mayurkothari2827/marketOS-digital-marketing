import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Sparkles,
  Plus,
  X,
  CheckCircle2,
} from 'lucide-react';
import { Client, CalendarEvent, AssetStatus } from '../../types';

interface MarketingCalendarProps {
  client: Client;
  onLaunchCampaignForEvent: (event: CalendarEvent) => void;
}

export const MarketingCalendar: React.FC<MarketingCalendarProps> = ({
  client,
  onLaunchCampaignForEvent,
}) => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isAddingEvent, setIsAddingEvent] = useState(false);

  // New event form state
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newCategory, setNewCategory] = useState<'Festival' | 'National Day' | 'Seasonal Peak' | 'Weekend Sale'>('Weekend Sale');
  const [newIdea, setNewIdea] = useState('');
  const [newPlatform, setNewPlatform] = useState<string>('Instagram');

  const filteredEvents = events.filter((e) => {
    if (selectedCategory === 'All') return true;
    return e.category === selectedCategory;
  });

  const handleUpdateStatus = (id: string, status: AssetStatus) => {
    setEvents(events.map((e) => (e.id === id ? { ...e, status } : e)));
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newEvent: CalendarEvent = {
      id: `event-${Date.now()}`,
      clientId: client?.id || 'client-default',
      title: newTitle,
      date: newDate,
      category: newCategory,
      platforms: [newPlatform as any],
      recommendedIdea: newIdea || `Promotional campaign for ${newTitle}`,
      status: 'Idea',
    };

    setEvents([newEvent, ...events]);
    setNewTitle('');
    setNewIdea('');
    setIsAddingEvent(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-[#E5E5E5] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#111111] flex items-center justify-center text-white shrink-0">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#111111] tracking-tight">
              Marketing Calendar: Scheduled Posts & Events
            </h2>
            <p className="text-xs text-[#666666] mt-0.5">
              Plan and schedule promotions, events, and seasonal campaigns for {client?.businessInfo?.businessName || 'your business'}.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {['All', 'Festival', 'National Day', 'Seasonal Peak', 'Weekend Sale'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[#111111] text-white'
                    : 'bg-white text-[#666666] hover:text-[#111111] border border-[#E5E5E5]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsAddingEvent(true)}
            className="py-2 px-3.5 rounded-xl bg-[#111111] hover:bg-[#222222] text-white text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Schedule Event</span>
          </button>
        </div>
      </div>

      {/* Add Event Modal */}
      {isAddingEvent && (
        <div className="bg-[#F7F7F7] border border-[#E5E5E5] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-[#111111]">Schedule Marketing Event</h3>
            <button
              onClick={() => setIsAddingEvent(false)}
              className="p-1 rounded-lg text-[#999999] hover:text-[#111111] hover:bg-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleAddEvent} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#666666] mb-1">Event Title</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Diwal Dhamaka Sale, Weekend Clearance"
                required
                className="w-full bg-white border border-[#E5E5E5] rounded-xl px-3 py-2 text-xs text-[#111111] placeholder-[#999999] focus:outline-none focus:border-[#111111]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#666666] mb-1">Date</label>
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                required
                className="w-full bg-white border border-[#E5E5E5] rounded-xl px-3 py-2 text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#666666] mb-1">Category</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as any)}
                className="w-full bg-white border border-[#E5E5E5] rounded-xl px-3 py-2 text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
              >
                <option value="Weekend Sale">Weekend Sale</option>
                <option value="Festival">Festival</option>
                <option value="National Day">National Day</option>
                <option value="Seasonal Peak">Seasonal Peak</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#666666] mb-1">Primary Channel</label>
              <select
                value={newPlatform}
                onChange={(e) => setNewPlatform(e.target.value)}
                className="w-full bg-white border border-[#E5E5E5] rounded-xl px-3 py-2 text-xs text-[#111111] focus:outline-none focus:border-[#111111]"
              >
                <option value="Instagram">Instagram</option>
                <option value="WhatsApp">WhatsApp</option>
                <option value="Facebook">Facebook</option>
                <option value="Google Business">Google Business</option>
              </select>
            </div>

            <div className="md:col-span-2 lg:col-span-3">
              <label className="block text-xs font-medium text-[#666666] mb-1">Campaign Angle / Notes</label>
              <input
                type="text"
                value={newIdea}
                onChange={(e) => setNewIdea(e.target.value)}
                placeholder="Key marketing hook or offer mechanics"
                className="w-full bg-white border border-[#E5E5E5] rounded-xl px-3 py-2 text-xs text-[#111111] placeholder-[#999999] focus:outline-none focus:border-[#111111]"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-2 px-4 rounded-xl bg-[#111111] hover:bg-[#222222] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Save to Calendar</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Calendar Timeline Grid */}
      {filteredEvents.length === 0 ? (
        <div className="bg-white border border-[#E5E5E5] rounded-xl p-12 text-center flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-xl bg-[#F7F7F7] border border-[#E5E5E5] flex items-center justify-center mb-4">
            <CalendarIcon className="w-6 h-6 text-[#999999]" />
          </div>
          <h3 className="text-base font-semibold text-[#111111] mb-1">Nothing scheduled.</h3>
          <p className="text-sm text-[#666666] max-w-sm mb-6">
            Add your first marketing campaign date, festival, or store event to plan your promotional calendar.
          </p>
          <button
            onClick={() => setIsAddingEvent(true)}
            className="px-5 py-2.5 rounded-xl bg-[#111111] text-white hover:bg-[#222222] text-sm font-semibold flex items-center gap-2 transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Event</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEvents.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-[#E5E5E5] rounded-xl p-5 flex flex-col justify-between hover:border-[#111111]/30 transition-all text-xs shadow-xs"
            >
              <div>
                {/* Event Date & Category Pill */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#666666] px-2 py-0.5 rounded bg-[#F7F7F7] border border-[#E5E5E5]">
                      {item.date}
                    </span>
                    {item.festivalName && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#F7F7F7] text-[#111111] border border-[#E5E5E5]">
                        {item.festivalName}
                      </span>
                    )}
                  </div>

                  {/* Status selector */}
                  <select
                    value={item.status}
                    onChange={(e) => handleUpdateStatus(item.id, e.target.value as AssetStatus)}
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-full border bg-white cursor-pointer text-[#111111] border-[#E5E5E5]"
                  >
                    <option value="Idea">Idea</option>
                    <option value="Draft">Draft</option>
                    <option value="Ready">Ready</option>
                    <option value="Approved">Approved</option>
                    <option value="Published">Published</option>
                  </select>
                </div>

                {/* Title */}
                <h3 className="text-sm font-bold text-[#111111] mb-2 leading-snug">
                  {item.title}
                </h3>

                {/* Recommended Idea */}
                <div className="bg-[#F7F7F7] p-3 rounded-xl border border-[#E5E5E5] text-[#666666] leading-relaxed mb-3">
                  <span className="text-[10px] font-bold text-[#111111] uppercase tracking-wider block mb-1">
                    Campaign Angle:
                  </span>
                  {item.recommendedIdea}
                </div>

                {/* Platforms */}
                <div className="flex items-center gap-2 text-[#999999] text-[11px]">
                  <span>Channels:</span>
                  <span className="text-[#111111] font-medium">{item.platforms.join(', ')}</span>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-[#E5E5E5] mt-4 flex items-center justify-between">
                <span className="text-[11px] text-[#999999] capitalize">{item.category}</span>
                <button
                  onClick={() => onLaunchCampaignForEvent(item)}
                  className="py-1.5 px-3 rounded-lg bg-[#111111] hover:bg-[#222222] text-white font-semibold flex items-center gap-1 shadow-sm transition-all"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Launch Campaign</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
