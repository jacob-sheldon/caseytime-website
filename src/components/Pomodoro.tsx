'use client';

import { useState, useEffect } from 'react';

type TimerState = 'work' | 'break' | 'stopped';

export default function Pomodoro() {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [timerState, setTimerState] = useState<TimerState>('stopped');
  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [workDuration, setWorkDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [autoStartWork, setAutoStartWork] = useState(true);
  const [autoStartBreak, setAutoStartBreak] = useState(true);

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('pomodoroSettings');
    if (savedSettings) {
      const { work, break: breakTime, autoWork, autoBreak } = JSON.parse(savedSettings);
      setWorkDuration(work);
      setBreakDuration(breakTime);
      setTimeLeft(work * 60);
      setAutoStartWork(autoWork ?? true);
      setAutoStartBreak(autoBreak ?? true);
    }
  }, []);

  // Save settings to localStorage
  const saveSettings = () => {
    localStorage.setItem('pomodoroSettings', JSON.stringify({
      work: workDuration,
      break: breakDuration,
      autoWork: autoStartWork,
      autoBreak: autoStartBreak
    }));
    setTimeLeft(workDuration * 60);
    setShowSettings(false);
    setTimerState('stopped');
  };

  // Request notification permission on component mount
  useEffect(() => {
    if ('Notification' in window) {
      Notification.requestPermission();
    }
  }, []);

  // Send notification
  const sendNotification = (title: string, body: string) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/favicon.ico', // You can add a custom icon
        silent: false
      });
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (timerState !== 'stopped' && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      if (timerState === 'work') {
        setTimeLeft(breakDuration * 60);
        setTimerState(autoStartBreak ? 'break' : 'stopped');
        sendNotification(
          'Work Session Complete! 🎉',
          `Time for a ${breakDuration}-minute break.${!autoStartBreak ? ' Click Start to begin.' : ''}`
        );
        new Audio('/notification.mp3').play().catch(() => {});
      } else if (timerState === 'break') {
        setTimeLeft(workDuration * 60);
        setTimerState(autoStartWork ? 'work' : 'stopped');
        sendNotification(
          'Break Time Over ⏰',
          `Ready to start a ${workDuration}-minute work session?${!autoStartWork ? ' Click Start to begin.' : ''}`
        );
        new Audio('/notification.mp3').play().catch(() => {});
      }
    }

    return () => clearInterval(interval);
  }, [timerState, timeLeft, workDuration, breakDuration, autoStartWork, autoStartBreak]);

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
    setTimeLeft(workDuration * 60);
    setTimerState('stopped');
  };

  return (
    <div className="fixed top-4 left-4 text-white z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors"
        type="button"
      >
        {isOpen ? '×' : '⏱'}
      </button>

      {isOpen && (
        <div className="absolute top-12 left-0 bg-black/50 backdrop-blur-md rounded-lg p-4 min-w-[200px] z-50">
          <div className="text-center">
            {!showSettings ? (
              <>
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
                  <button
                    onClick={() => setShowSettings(true)}
                    className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded transition-colors"
                  >
                    ⚙️
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-xl font-light mb-4">Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm mb-1">Work Duration (minutes)</label>
                    <input
                      type="number"
                      value={workDuration}
                      onChange={(e) => setWorkDuration(Number(e.target.value))}
                      className="bg-white/10 rounded px-3 py-2 w-20 text-center"
                      min="1"
                      max="60"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Break Duration (minutes)</label>
                    <input
                      type="number"
                      value={breakDuration}
                      onChange={(e) => setBreakDuration(Number(e.target.value))}
                      className="bg-white/10 rounded px-3 py-2 w-20 text-center"
                      min="1"
                      max="30"
                    />
                  </div>
                  <div className="flex items-center gap-2 justify-between px-2">
                    <label className="text-sm">Auto-start work</label>
                    <button
                      onClick={() => setAutoStartWork(!autoStartWork)}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        autoStartWork ? 'bg-green-500/50' : 'bg-white/10'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white transition-transform ${
                          autoStartWork ? 'translate-x-7' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 justify-between px-2">
                    <label className="text-sm">Auto-start break</label>
                    <button
                      onClick={() => setAutoStartBreak(!autoStartBreak)}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        autoStartBreak ? 'bg-green-500/50' : 'bg-white/10'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white transition-transform ${
                          autoStartBreak ? 'translate-x-7' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  <button
                    onClick={saveSettings}
                    className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded transition-colors w-full"
                  >
                    Save Settings
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 