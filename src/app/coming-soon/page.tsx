"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ComingSoonPage() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 24);
    targetDate.setHours(targetDate.getHours() + 10);

    const interval = setInterval(() => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();

      if (diff <= 0) {
        clearInterval(interval);
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className="antialiased min-h-screen flex flex-col justify-between text-white"
      style={{
        backgroundImage: "linear-gradient(rgba(30,57,50,0.85), rgba(30,57,50,0.9)), url('https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      {/* Navbar (Simplified) */}
      <header className="w-full z-50 p-6 flex justify-between items-center animate-[slideUp_0.8s_ease-out]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#0f7f6d] rounded-lg flex items-center justify-center text-white">
            <span className="material-icons-outlined text-2xl">school</span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-2xl text-white leading-none">SMaRT</span>
            <span className="text-xs font-semibold tracking-widest text-[#E3E8E7] uppercase">School</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" className="hover:text-[#0f7f6d] transition-colors text-sm font-semibold flex items-center gap-1">
            <span className="material-icons-outlined text-sm">home</span> Home
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center px-6">
        <div className="max-w-2xl text-center animate-[slideUp_0.8s_ease-out]">
          <span className="inline-block px-3 py-1 bg-white/10 border border-white/20 text-[#E3E8E7] text-xs font-bold rounded mb-6 uppercase tracking-widest">
            Exciting Things Ahead
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">We Are Launching Something New</h1>
          <p className="text-gray-300 mb-12 text-lg">
            Our team is working hard to bring you a brand new learning experience. The new portal will be available soon.
          </p>
          
          {/* Countdown Timer */}
          {isMounted && (
            <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-12">
              <div className="min-w-[80px] bg-white/10 backdrop-blur-sm border border-white/10 rounded-lg p-4">
                <h3 className="text-4xl font-bold text-[#0f7f6d] mb-1">{timeLeft.days}</h3>
                <p className="text-xs uppercase tracking-widest text-gray-300">Days</p>
              </div>
              <div className="min-w-[80px] bg-white/10 backdrop-blur-sm border border-white/10 rounded-lg p-4">
                <h3 className="text-4xl font-bold text-white mb-1">
                  {timeLeft.hours < 10 ? `0${timeLeft.hours}` : timeLeft.hours}
                </h3>
                <p className="text-xs uppercase tracking-widest text-gray-300">Hours</p>
              </div>
              <div className="min-w-[80px] bg-white/10 backdrop-blur-sm border border-white/10 rounded-lg p-4">
                <h3 className="text-4xl font-bold text-white mb-1">
                  {timeLeft.minutes < 10 ? `0${timeLeft.minutes}` : timeLeft.minutes}
                </h3>
                <p className="text-xs uppercase tracking-widest text-gray-300">Minutes</p>
              </div>
              <div className="min-w-[80px] bg-white/10 backdrop-blur-sm border border-white/10 rounded-lg p-4">
                <h3 className="text-4xl font-bold text-white mb-1">
                  {timeLeft.seconds < 10 ? `0${timeLeft.seconds}` : timeLeft.seconds}
                </h3>
                <p className="text-xs uppercase tracking-widest text-gray-300">Seconds</p>
              </div>
            </div>
          )}

          {/* Subscribe */}
          <div className="max-w-md mx-auto">
            <p className="text-sm text-gray-400 mb-3">Notify me when it&apos;s ready:</p>
            <form className="flex w-full shadow-lg" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Email Address" 
                className="flex-1 border-0 rounded-l px-5 py-3 text-sm text-gray-700 focus:outline-none bg-white"
                required
              />
              <button 
                type="submit" 
                className="bg-[#0f7f6d] text-white px-6 font-bold rounded-r hover:bg-[#005e3e] transition-colors text-sm uppercase tracking-wider"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full p-6 text-center text-gray-400 text-sm animate-[slideUp_0.8s_ease-out]">
        <div className="flex justify-center gap-4 mb-4">
          <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#0f7f6d] text-white transition-colors">
            <span className="material-icons-outlined text-sm">facebook</span>
          </a>
          <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#0f7f6d] text-white transition-colors">
            <span className="material-icons-outlined text-sm">camera_alt</span>
          </a>
          <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#0f7f6d] text-white transition-colors">
            <span className="material-icons-outlined text-sm">email</span>
          </a>
        </div>
        <p>&copy; {new Date().getFullYear()} NextCMS. All rights reserved.</p>
      </footer>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: none; }
        }
      `}} />
    </div>
  );
}
