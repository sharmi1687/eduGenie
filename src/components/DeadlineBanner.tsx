import React, { useState, useEffect } from 'react';
import { Calendar, Clock, ExternalLink, CheckCircle2, AlertTriangle } from 'lucide-react';

export const DeadlineBanner: React.FC = () => {
  // Target: Saturday, October 3, 2026 23:59:59
  const targetDate = new Date('2026-10-03T23:59:59').getTime();

  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white border-b border-indigo-800/60 py-2.5 px-4">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs md:text-sm">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          <span className="font-semibold text-amber-300 uppercase tracking-wider text-[11px]">
            Final Project Submission Deadline:
          </span>
          <span className="font-medium text-slate-200">Saturday, October 3, 2026</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1 rounded-md border border-white/10 font-mono text-xs">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-white font-bold">{timeLeft.days}</span>
            <span className="text-slate-400 text-[10px]">d</span>
            <span className="text-white font-bold">{timeLeft.hours}</span>
            <span className="text-slate-400 text-[10px]">h</span>
            <span className="text-white font-bold">{timeLeft.minutes}</span>
            <span className="text-slate-400 text-[10px]">m</span>
            <span className="text-amber-400 font-bold">{timeLeft.seconds}</span>
            <span className="text-slate-400 text-[10px]">s</span>
          </div>

          <a
            href="https://youtu.be/wPPI9-mK2P0"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center gap-1 text-slate-300 hover:text-white transition underline underline-offset-2 text-xs"
          >
            <span>GitHub Demo Video</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
