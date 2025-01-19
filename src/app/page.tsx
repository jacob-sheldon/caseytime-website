'use client';

import { useEffect, useState } from 'react';
import Pomodoro from '@/components/Pomodoro';
import Tasks from '@/components/Tasks';

export default function Home() {
  const [time, setTime] = useState('');
  const [greeting, setGreeting] = useState('');
  const [name] = useState('Friend');

  useEffect(() => {
    // Update time every second
    const timer = setInterval(() => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }));
      
      // Set greeting based on time of day
      const hour = now.getHours();
      if (hour < 12) setGreeting('Good morning');
      else if (hour < 18) setGreeting('Good afternoon');
      else setGreeting('Good evening');
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative min-h-screen">
      {/* Background image - you can add a random nature image service here */}
      <div className="absolute inset-0 backdrop" />
      
      {/* Add Pomodoro and Tasks components */}
      <Pomodoro />
      <Tasks />
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center">
        {/* Time */}
        <h1 className="text-8xl font-light mb-4">
          {time}
        </h1>

        {/* Greeting */}
        <h2 className="text-4xl font-light mb-8">
          {greeting}, {name}
        </h2>

        {/* Main focus input */}
        <div className="mt-8">
          <p className="text-xl text-text-secondary mb-2">
            What is your main focus for today?
          </p>
          <input
            type="text"
            className="bg-transparent border-b border-white/30 px-4 py-2 text-xl text-center focus:outline-none focus:border-white/60 transition-colors"
            placeholder="Enter your focus..."
          />
        </div>
      </div>

      {/* Weather widget could go here */}
      <div className="absolute top-4 right-4">
        {/* Weather component */}
      </div>

      {/* Quote could go here */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
        <p className="text-lg text-text-secondary">
          &ldquo;The best way to predict the future is to create it.&rdquo;
        </p>
      </div>
    </div>
  );
}
