import React from 'react';
import { Presentation as PresentationIcon, Sparkles, Layout, Download, Users, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

export const Navbar = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-bottom border-zinc-100">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        <div className="flex items-center gap-2">
          <div className="bg-teal-600 p-1.5 rounded-lg">
            <PresentationIcon className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-zinc-900 tracking-tight">SlideCraft AI</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm font-medium text-zinc-600 hover:text-teal-600 transition-colors">Features</a>
          <a href="#how-it-works" className="text-sm font-medium text-zinc-600 hover:text-teal-600 transition-colors">How it Works</a>
          <button className="bg-zinc-900 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-zinc-800 transition-all shadow-sm">
            Get Started
          </button>
        </div>
      </div>
    </div>
  </nav>
);

export const Hero = ({ onStart }: { onStart: () => void }) => (
  <section className="relative pt-32 pb-20 overflow-hidden">
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-teal-50 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-3xl opacity-50" />
    </div>
    
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-bold uppercase tracking-wider mb-6">
          <Sparkles className="w-3 h-3" /> Advanced Gemini 3.1 Intelligence
        </span>
        <h1 className="text-5xl md:text-7xl font-bold text-zinc-900 tracking-tight mb-6 max-w-4xl mx-auto leading-[1.1]">
          Transform Your Ideas into <span className="text-teal-600">Stunning</span> Presentations
        </h1>
        <p className="text-xl text-zinc-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          Enter your topic and let our AI craft a multi-slide, professional deck with animations, visuals, and deep explanations.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={onStart}
            className="w-full sm:w-auto bg-teal-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-teal-700 transition-all shadow-lg shadow-teal-600/20 flex items-center justify-center gap-2 group"
          >
            Generate PPT <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          </button>
          <button className="w-full sm:w-auto bg-white text-zinc-900 border border-zinc-200 px-8 py-4 rounded-full text-lg font-semibold hover:bg-zinc-50 transition-all">
            View Templates
          </button>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="mt-20 relative max-w-5xl mx-auto"
      >
        <div className="aspect-[16/9] bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden border border-zinc-800 p-4">
          <div className="w-full h-full bg-zinc-800 rounded-lg flex items-center justify-center relative overflow-hidden">
             {/* Mock Slide Preview */}
             <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-teal-500 via-transparent to-transparent" />
             <div className="z-10 text-left p-12 w-full">
                <div className="h-8 w-64 bg-zinc-700 rounded-md mb-4" />
                <div className="h-4 w-full bg-zinc-700 rounded-md mb-2" />
                <div className="h-4 w-3/4 bg-zinc-700 rounded-md mb-2" />
                <div className="h-4 w-1/2 bg-zinc-700 rounded-md" />
             </div>
             <div className="absolute bottom-8 right-8 w-32 h-32 bg-teal-600/20 rounded-full blur-2xl" />
          </div>
        </div>
        {/* Floating elements */}
        <div className="absolute -top-6 -right-6 bg-white p-4 rounded-xl shadow-xl border border-zinc-100 hidden lg:block">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-full">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-zinc-900">AI Generated</p>
              <p className="text-[10px] text-zinc-500">Optimized for clarity</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

export const HowItWorks = () => {
  const steps = [
    { icon: Sparkles, title: "Enter Topic", desc: "Provide a title, key points, or raw data you want to cover." },
    { icon: Layout, title: "Deep Analysis", desc: "AI generates 12+ slides with detailed explanations and logical flow." },
    { icon: PresentationIcon, title: "Smart Visuals", desc: "Relevant images and professional layouts are automatically applied." },
    { icon: Download, title: "Export & Present", desc: "Download as PPTX with built-in animations and transitions." },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-zinc-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-zinc-900 mb-4">How It Works</h2>
          <p className="text-zinc-600 max-w-2xl mx-auto">Four simple steps to a professional presentation.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, idx) => (
            <div key={idx} className="relative group">
              {idx < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/4 left-full w-full h-px bg-zinc-200 -translate-y-1/2 z-0" />
              )}
              <div className="relative z-10 bg-white p-8 rounded-2xl border border-zinc-100 shadow-sm group-hover:shadow-md transition-all text-center">
                <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <step.icon className="w-6 h-6 text-teal-600" />
                </div>
                <h3 className="text-lg font-bold text-zinc-900 mb-2">{step.title}</h3>
                <p className="text-sm text-zinc-600 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const Features = () => {
  const features = [
    { title: "Deep Content Generation", desc: "Slides go beyond bullet points, with detailed explanations and structured flow.", icon: Sparkles },
    { title: "Smart Visuals", desc: "Automatically fetches topic-related images, charts, and infographics.", icon: Layout },
    { title: "Cool Animations", desc: "Built-in transitions and motion effects for a polished look.", icon: CheckCircle },
    { title: "Multiple Templates", desc: "Business, academic, creative, and minimalist styles.", icon: Download },
    { title: "Export Options", desc: "High-quality PPTX and PDF exports for all platforms.", icon: Users },
    { title: "Collaboration Tools", desc: "Share your decks and collaborate with your team.", icon: PresentationIcon },
  ];

  return (
    <section id="features" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-zinc-900 mb-4">Powerful Features</h2>
          <p className="text-zinc-600 max-w-2xl mx-auto">Everything you need to create high-impact presentations in minutes.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, idx) => (
            <div key={idx} className="p-8 rounded-2xl border border-zinc-100 hover:border-teal-100 hover:bg-teal-50/30 transition-all">
              <f.icon className="w-8 h-8 text-teal-600 mb-6" />
              <h3 className="text-xl font-bold text-zinc-900 mb-3">{f.title}</h3>
              <p className="text-zinc-600 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const Testimonials = () => {
  const testimonials = [
    { name: "Sarah Jenkins", role: "Marketing Director", quote: "SlideCraft saved me 5 hours on my last pitch deck. The content was spot on." },
    { name: "David Chen", role: "Startup Founder", quote: "The easiest way to build a professional presentation. Highly recommended for busy founders." },
    { name: "Dr. Elena Rossi", role: "University Professor", quote: "Excellent for educational slides. It structures complex topics beautifully." },
  ];

  return (
    <section className="py-24 bg-zinc-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Trusted by Professionals</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div key={idx} className="bg-zinc-800 p-8 rounded-2xl border border-zinc-700">
              <p className="text-zinc-300 italic mb-6">"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-zinc-700 rounded-full" />
                <div>
                  <p className="font-bold">{t.name}</p>
                  <p className="text-xs text-zinc-500 uppercase tracking-wider">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const Footer = () => (
  <footer className="py-12 border-t border-zinc-100">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-2">
          <div className="bg-teal-600 p-1 rounded-lg">
            <PresentationIcon className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-zinc-900">SlideCraft AI</span>
        </div>
        <div className="flex gap-8 text-sm text-zinc-500">
          <a href="#" className="hover:text-teal-600 transition-colors">Privacy</a>
          <a href="#" className="hover:text-teal-600 transition-colors">Terms</a>
          <a href="#" className="hover:text-teal-600 transition-colors">Contact</a>
        </div>
        <p className="text-sm text-zinc-400">© 2024 SlideCraft AI. All rights reserved.</p>
      </div>
    </div>
  </footer>
);
