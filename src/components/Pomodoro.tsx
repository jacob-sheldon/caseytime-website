'use client';

import { useState, useEffect } from 'react';

type TimerState = 'work' | 'break' | 'stopped';

export default function Pomodoro() {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [timerState, setTimerState] = useState<TimerState>('stopped');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (timerState !== 'stopped' && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      if (timerState === 'work') {
        setTimeLeft(5 * 60); // 5 minute break
        setTimerState('break');
        new Audio('/notification.mp3').play().catch(() => {}); // Add a notification sound file
      } else if (timerState === 'break') {
        setTimeLeft(25 * 60);
        setTimerState('work');
        new Audio('/notification.mp3').play().catch(() => {});
      }
    }

    return () => clearInterval(interval);
  }, [timerState, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => {
    if (timerState === 'stopped') {
      setTimerState('work');
    } else {
      setTimerState('stopped');
    }
  };

  const resetTimer = () => {
    setTimeLeft(25 * 60);
    setTimerState('stopped');
  };

  return (
    <div className="fixed top-4 left-4 text-white">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors"
      >
        {isOpen ? '×' : '⏱'}
      </button>

      {isOpen && (
        <div className="absolute top-12 left-0 bg-black/50 backdrop-blur-md rounded-lg p-4 min-w-[200px]">
          <div className="text-center">
            <h3 className="text-xl font-light mb-2">
              {timerState === 'work' ? 'Work Time' : timerState === 'break' ? 'Break Time' : 'Pomodoro'}
            </h3>
            <div className="text-3xl font-mono mb-4">{formatTime(timeLeft)}</div>
            <div className="flex gap-2 justify-center">
              <button
                onClick={toggleTimer}
                className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded transition-colors"
              >
                {timerState === 'stopped' ? 'Start' : 'Pause'}
              </button>
              <button
                onClick={resetTimer}
                className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 