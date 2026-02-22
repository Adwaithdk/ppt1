import React, { useState } from 'react';
import { Navbar, Hero, HowItWorks, Features, Testimonials, Footer } from './components/Landing';
import { Generator } from './components/Generator';

export default function App() {
  const [view, setView] = useState<'landing' | 'generator'>('landing');

  return (
    <div className="min-h-screen bg-white selection:bg-teal-100 selection:text-teal-900">
      <Navbar />
      
      {view === 'landing' ? (
        <main>
          <Hero onStart={() => setView('generator')} />
          <HowItWorks />
          <Features />
          <Testimonials />
          <Footer />
        </main>
      ) : (
        <Generator onBack={() => setView('landing')} />
      )}
    </div>
  );
}
