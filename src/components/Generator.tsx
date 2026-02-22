import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowLeft, Download, Layout, ChevronRight, ChevronLeft, Loader2, Play, Palette, Type as TypeIcon } from 'lucide-react';
import { generatePresentation } from '../services/gemini';
import { exportToPptx } from '../services/pptxExport';
import { Presentation, SlideStyle, AnimationTheme } from '../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const animationVariants = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slide: {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 },
  },
  zoom: {
    initial: { opacity: 0, scale: 0.5 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.5 },
  },
  bounce: {
    initial: { opacity: 0, y: 100 },
    animate: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 20 } },
    exit: { opacity: 0, y: -100 },
  }
};

export const Generator = ({ onBack }: { onBack: () => void }) => {
  const [topic, setTopic] = useState('');
  const [style, setStyle] = useState<SlideStyle>('corporate');
  const [isGenerating, setIsGenerating] = useState(false);
  const [presentation, setPresentation] = useState<Presentation | null>(null);
  const [currentSlideIdx, setCurrentSlideIdx] = useState(0);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setIsGenerating(true);
    try {
      const result = await generatePresentation(topic, style);
      setPresentation(result);
      setCurrentSlideIdx(0);
    } catch (error) {
      console.error(error);
      alert("Failed to generate presentation. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExport = async () => {
    if (!presentation) return;
    try {
      await exportToPptx(presentation);
    } catch (error) {
      console.error(error);
      alert("Failed to export PPTX.");
    }
  };

  const updateTheme = (theme: AnimationTheme) => {
    if (!presentation) return;
    setPresentation({ ...presentation, animationTheme: theme });
  };

  const updateSlideAnimation = (idx: number, anim: AnimationTheme) => {
    if (!presentation) return;
    const newSlides = [...presentation.slides];
    newSlides[idx] = { ...newSlides[idx], animation: anim };
    setPresentation({ ...presentation, slides: newSlides });
  };

  const updateSlideColor = (idx: number, field: 'backgroundColor' | 'textColor', color: string) => {
    if (!presentation) return;
    const newSlides = [...presentation.slides];
    newSlides[idx] = { ...newSlides[idx], [field]: color };
    setPresentation({ ...presentation, slides: newSlides });
  };

  if (presentation) {
    const currentSlide = presentation.slides[currentSlideIdx];
    const activeAnim = currentSlide.animation || presentation.animationTheme;
    const variants = animationVariants[activeAnim];
    
    return (
      <div className="min-h-screen bg-zinc-50 pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <button 
              onClick={() => setPresentation(null)}
              className="flex items-center gap-2 text-zinc-600 hover:text-zinc-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Editor
            </button>
            <div className="flex gap-3">
              <div className="flex items-center gap-2 bg-white border border-zinc-200 rounded-full px-4 py-1.5 shadow-sm">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Theme:</span>
                {(['fade', 'slide', 'zoom', 'bounce'] as AnimationTheme[]).map(t => (
                  <button
                    key={t}
                    onClick={() => updateTheme(t)}
                    style={{ backgroundColor: presentation.animationTheme === t ? presentation.themeColor : 'transparent' }}
                    className={cn(
                      "text-xs font-semibold px-2 py-1 rounded-md transition-all",
                      presentation.animationTheme === t ? "text-white" : "text-zinc-500 hover:bg-zinc-100"
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <button 
                onClick={handleExport}
                style={{ backgroundColor: presentation.themeColor }}
                className="text-white px-6 py-2 rounded-full font-medium hover:brightness-110 transition-all flex items-center gap-2 shadow-lg"
              >
                <Download className="w-4 h-4" /> Download PPTX
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar / Slide List */}
            <div className="lg:col-span-1 space-y-2 overflow-y-auto max-h-[70vh] pr-2 custom-scrollbar">
              {presentation.slides.map((slide, idx) => (
                <div key={idx} className="group relative">
                  <button
                    onClick={() => setCurrentSlideIdx(idx)}
                    style={{ 
                      borderColor: currentSlideIdx === idx ? presentation.themeColor : 'transparent',
                      boxShadow: currentSlideIdx === idx ? `0 0 0 1px ${presentation.themeColor}1a` : 'none'
                    }}
                    className={cn(
                      "w-full text-left p-4 rounded-xl border transition-all",
                      currentSlideIdx === idx 
                        ? "bg-white shadow-sm" 
                        : "bg-transparent border-transparent hover:bg-white/50 text-zinc-500"
                    )}
                  >
                    <p className="text-[10px] font-bold uppercase tracking-wider mb-1 opacity-50">Slide {idx + 1}</p>
                    <p className="text-sm font-semibold truncate">{slide.title}</p>
                  </button>
                  {currentSlideIdx === idx && (
                    <div className="absolute right-2 top-2 flex gap-1">
                       <select 
                         value={slide.animation || ""}
                         onChange={(e) => updateSlideAnimation(idx, e.target.value as AnimationTheme)}
                         className="text-[10px] bg-zinc-100 border-none rounded px-1 py-0.5 text-zinc-500 focus:ring-0"
                       >
                         <option value="">Default</option>
                         <option value="fade">Fade</option>
                         <option value="slide">Slide</option>
                         <option value="zoom">Zoom</option>
                         <option value="bounce">Bounce</option>
                       </select>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Main Preview Area */}
            <div className="lg:col-span-3">
              <div className="flex gap-4 mb-4">
                <div className="flex items-center gap-2 bg-white border border-zinc-200 rounded-lg px-3 py-1.5 shadow-sm">
                  <Palette className="w-4 h-4 text-zinc-400" />
                  <span className="text-xs font-bold text-zinc-500 uppercase">Background:</span>
                  <input 
                    type="color" 
                    value={currentSlide.backgroundColor || "#ffffff"}
                    onChange={(e) => updateSlideColor(currentSlideIdx, 'backgroundColor', e.target.value)}
                    className="w-6 h-6 rounded cursor-pointer border-none bg-transparent"
                  />
                </div>
                <div className="flex items-center gap-2 bg-white border border-zinc-200 rounded-lg px-3 py-1.5 shadow-sm">
                  <TypeIcon className="w-4 h-4 text-zinc-400" />
                  <span className="text-xs font-bold text-zinc-500 uppercase">Text:</span>
                  <input 
                    type="color" 
                    value={currentSlide.textColor || "#18181b"}
                    onChange={(e) => updateSlideColor(currentSlideIdx, 'textColor', e.target.value)}
                    className="w-6 h-6 rounded cursor-pointer border-none bg-transparent"
                  />
                </div>
              </div>

              <div 
                style={{ backgroundColor: currentSlide.backgroundColor || '#ffffff' }}
                className="aspect-[16/9] rounded-2xl shadow-xl border border-zinc-200 overflow-hidden relative group"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlideIdx}
                    initial={variants.initial}
                    animate={variants.animate}
                    exit={variants.exit}
                    transition={{ duration: 0.5 }}
                    style={{ color: currentSlide.textColor || '#18181b' }}
                    className="w-full h-full p-12 flex flex-col"
                  >
                    <div className="flex-1 flex gap-8">
                      {currentSlide.layout === 'quote' ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center px-12">
                          <motion.p 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            style={{ color: presentation.themeColor }}
                            className="text-4xl font-serif italic mb-8 leading-tight"
                          >
                            "{currentSlide.content[0]}"
                          </motion.p>
                          {currentSlide.content[1] && (
                            <motion.p 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.3 }}
                              style={{ color: currentSlide.textColor || '#71717a' }}
                              className="text-xl font-medium self-end"
                            >
                              — {currentSlide.content[1]}
                            </motion.p>
                          )}
                        </div>
                      ) : currentSlide.layout === 'comparison' ? (
                        <div className="flex-1 grid grid-cols-2 gap-8">
                          {[0, 1].map((side) => {
                            const mid = Math.ceil(currentSlide.content.length / 2);
                            const items = side === 0 ? currentSlide.content.slice(0, mid) : currentSlide.content.slice(mid);
                            return (
                              <motion.div 
                                key={side}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: side * 0.2 }}
                                style={{ backgroundColor: currentSlide.backgroundColor ? `${currentSlide.backgroundColor}33` : '#f4f4f5' }}
                                className="rounded-2xl p-8 border border-zinc-100"
                              >
                                <ul className="space-y-4">
                                  {items.map((item, i) => (
                                    <li key={i} style={{ color: currentSlide.textColor || '#3f3f46' }} className="flex items-start gap-3 text-lg">
                                      <span 
                                        style={{ backgroundColor: presentation.themeColor }}
                                        className="mt-2 w-1.5 h-1.5 rounded-full shrink-0" 
                                      />
                                      {item}
                                    </li>
                                  ))}
                                </ul>
                              </motion.div>
                            );
                          })}
                        </div>
                      ) : currentSlide.layout === 'timeline' ? (
                        <div className="flex-1 flex flex-col justify-center">
                          <div className="relative flex justify-between items-start">
                            <div 
                              style={{ backgroundColor: `${presentation.themeColor}33` }}
                              className="absolute top-4 left-0 right-0 h-0.5 -z-10" 
                            />
                            {currentSlide.content.slice(0, 4).map((item, i) => (
                              <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="flex flex-col items-center w-1/4 px-4"
                              >
                                <div 
                                  style={{ backgroundColor: presentation.themeColor }}
                                  className="w-8 h-8 rounded-full border-4 border-white shadow-sm mb-4" 
                                />
                                <p style={{ color: currentSlide.textColor || '#18181b' }} className="text-center text-sm font-bold">{item}</p>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className={cn(
                          "flex-1",
                          (currentSlide.layout === 'image-right' || currentSlide.layout === 'image-left') ? "w-1/2" : "w-full"
                        )}>
                          <motion.h2 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            style={{ borderLeftColor: presentation.themeColor, color: currentSlide.textColor || '#18181b' }}
                            className="text-4xl font-bold mb-6 border-l-4 pl-6"
                          >
                            {currentSlide.title}
                          </motion.h2>
                          
                          <div className="space-y-6">
                            <ul className="space-y-3">
                              {currentSlide.content.map((point, i) => (
                                <motion.li 
                                  key={i}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.2 + i * 0.1 }}
                                  style={{ color: currentSlide.textColor || '#3f3f46' }}
                                  className="flex items-start gap-3 text-lg font-medium"
                                >
                                  <span 
                                    style={{ backgroundColor: presentation.themeColor }}
                                    className="mt-2 w-1.5 h-1.5 rounded-full shrink-0" 
                                  />
                                  {point}
                                </motion.li>
                              ))}
                            </ul>
                            
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.5 }}
                              style={{ backgroundColor: currentSlide.backgroundColor ? `${currentSlide.backgroundColor}33` : '#f4f4f5' }}
                              className="p-4 rounded-xl border border-zinc-100"
                            >
                              <p style={{ color: currentSlide.textColor || '#52525b' }} className="text-sm leading-relaxed">
                                {currentSlide.explanation}
                              </p>
                            </motion.div>
                          </div>
                        </div>
                      )}

                      {(currentSlide.layout === 'image-right' || currentSlide.layout === 'image-left') && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className={cn(
                            "w-1/2 h-full rounded-xl overflow-hidden shadow-lg border border-zinc-100",
                            currentSlide.layout === 'image-left' ? "order-first" : ""
                          )}
                        >
                          <img 
                            src={currentSlide.imageUrl} 
                            alt={currentSlide.imageQuery}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </motion.div>
                      )}
                    </div>
                    
                    <div className="mt-auto pt-6 border-t border-zinc-100 flex justify-between items-center text-zinc-400 text-xs font-bold uppercase tracking-widest">
                      <span>{presentation.title}</span>
                      <span className="bg-zinc-100 px-2 py-1 rounded">{currentSlideIdx + 1} / {presentation.slides.length}</span>
                    </div>
                  </motion.div>
                </AnimatePresence>
                
                {/* Navigation Arrows */}
                <button 
                  onClick={() => setCurrentSlideIdx(prev => Math.max(0, prev - 1))}
                  disabled={currentSlideIdx === 0}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 border border-zinc-200 shadow-sm opacity-0 group-hover:opacity-100 disabled:opacity-0 transition-all hover:bg-white"
                >
                  <ChevronLeft className="w-6 h-6 text-zinc-600" />
                </button>
                <button 
                  onClick={() => setCurrentSlideIdx(prev => Math.min(presentation.slides.length - 1, prev + 1))}
                  disabled={currentSlideIdx === presentation.slides.length - 1}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 border border-zinc-200 shadow-sm opacity-0 group-hover:opacity-100 disabled:opacity-0 transition-all hover:bg-white"
                >
                  <ChevronRight className="w-6 h-6 text-zinc-600" />
                </button>
              </div>

              {/* Speaker Notes */}
              <div className="mt-6 bg-zinc-100/50 rounded-xl p-6 border border-zinc-200">
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Layout className="w-3 h-3" /> Speaker Notes
                </h4>
                <p className="text-zinc-600 italic">
                  {currentSlide.notes || "No speaker notes generated for this slide."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 pt-32 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl border border-zinc-100 p-8 md:p-12"
        >
          <button 
            onClick={onBack}
            className="mb-8 flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </button>

          <div className="mb-10">
            <h2 className="text-3xl font-bold text-zinc-900 mb-2">Create New Presentation</h2>
            <p className="text-zinc-500">Enter your topic and let AI do the heavy lifting.</p>
          </div>

          <div className="space-y-8">
            <div>
              <label className="block text-sm font-bold text-zinc-700 mb-3 uppercase tracking-wider">What's your presentation about?</label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. The future of sustainable energy in urban environments..."
                className="w-full h-32 bg-zinc-50 border border-zinc-200 rounded-2xl p-4 text-zinc-900 placeholder:text-zinc-400 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-zinc-700 mb-4 uppercase tracking-wider">Choose a visual style</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {(['corporate', 'creative', 'educational', 'minimalist'] as SlideStyle[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => setStyle(s)}
                    className={cn(
                      "p-4 rounded-xl border text-sm font-semibold capitalize transition-all",
                      style === s 
                        ? "bg-teal-600 border-teal-600 text-white shadow-lg shadow-teal-600/20" 
                        : "bg-white border-zinc-200 text-zinc-600 hover:border-teal-200 hover:bg-teal-50/50"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !topic.trim()}
              className="w-full bg-zinc-900 text-white py-5 rounded-2xl text-lg font-bold hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 shadow-xl"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Generating Slides...
                </>
              ) : (
                <>
                  <Sparkles className="w-6 h-6" />
                  Generate Presentation
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
