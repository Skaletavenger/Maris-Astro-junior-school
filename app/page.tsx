"use client";
import ContactForm from './components/ContactForm';
import React from 'react';

export default function Home() {
  
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {/* --- TOP BAR --- */}
      <div className="bg-[#001f3f] text-white py-2 px-6 hidden md:flex justify-between text-xs">
        <div className="flex gap-4">
          <span>📞 (+256) 704105651</span>
          <span>📍 Lugeye, Kakiri Town Council, Wakiso-Kampala</span>
        </div>
        <div className="flex gap-4">
          <span>Facebook</span>
          <span>TikTok</span>
        </div>
      </div>

      {/* --- NAVBAR --- */}
      <header className="sticky top-0 z-50 bg-white shadow-md border-b border-slate-100">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <img src="/logo-PNG.png" alt="Maris-Astro Logo" className="h-14 w-auto" />
            <div className="hidden sm:block">
              <p className="text-lg font-bold uppercase tracking-tighter text-emerald-800 leading-none">Maris-Astro</p>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Junior School</p>
            </div>
          </div>
          <nav className="flex gap-4 md:gap-8 text-sm font-bold text-slate-700 items-center">
            <a href="#about" className="hover:text-emerald-700 transition">About</a>
            <a href="#academics" className="hover:text-emerald-700 transition">Academics</a>
            <a href="#gallery" className="hover:text-emerald-700 transition">Gallery</a>
            <a href="#resources" className="hover:text-emerald-700 transition">Resources</a>
            <button 
              onClick={() => window.location.href = '/admin/login'}
              className="bg-[#001f3f] text-white px-4 py-2 rounded-lg text-xs hover:bg-emerald-800 transition"
            >
              Admin Login
            </button>
          </nav>
        </div>
      </header>

      <main>
        {/* --- HERO SECTION --- */}
        <section className="relative bg-[#001f3f] py-24 px-6 overflow-hidden">
          <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-[#FDB813] mb-6">
              Welcome to Maris-Astro Junior School
            </h1>
            <p className="max-w-3xl text-lg text-slate-200 leading-relaxed">
              A nurturing learning community dedicated to helping every child grow academically, socially, and emotionally. 
              Providing quality education in a safe, supportive, and engaging environment.
            </p>
            <div className="mt-10 flex gap-4">
              <button className="bg-[#FDB813] text-[#001f3f] px-8 py-3 rounded-md font-bold hover:scale-105 transition">Learn More</button>
              <button className="bg-white text-[#001f3f] px-8 py-3 rounded-md font-bold hover:scale-105 transition">2026 Events Calendar</button>
            </div>
          </div>
          {/* Subtle Background Pattern */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <img src="/logo-PNG.png" className="w-96 absolute -right-20 -bottom-20 rotate-12" alt="" />
          </div>
        </section>

        {/* --- MISSION & VISION --- */}
        <section className="py-20 bg-slate-50 px-6">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8">
            <div className="bg-white p-10 rounded-2xl border-2 border-[#FDB813] shadow-lg">
              <h3 className="text-[#FDB813] text-sm font-bold uppercase tracking-widest mb-4">Our Mission</h3>
              <p className="text-slate-700 leading-8">
                To provide quality, affordable, and holistic education that nurtures curiosity, creativity, and moral integrity in every child, 
                empowering learners to become confident, compassionate, and productive members of society.
              </p>
            </div>
            <div className="bg-white p-10 rounded-2xl border-2 border-emerald-700 shadow-lg">
              <h3 className="text-emerald-700 text-sm font-bold uppercase tracking-widest mb-4">Our Vision</h3>
              <p className="text-slate-700 leading-8">
                A thriving generation of well-educated, inspired young people who transform their communities through knowledge, discipline, and service.
              </p>
            </div>
          </div>
        </section>

        {/* --- ABOUT / WHO WE ARE --- */}
        <section id="about" className="py-24 px-6 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <img src="/logo-PNG.png" className="w-full max-w-md rounded-3xl shadow-2xl border-8 border-slate-100" alt="School Life" />
            </div>
            <div>
              <h2 className="text-4xl font-bold text-[#001f3f] mb-6 underline decoration-[#FDB813] underline-offset-8">Who We Are</h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Maris Astro Junior School is a community-based, not-for-profit educational institution founded by 
                <span className="font-bold text-emerald-800"> Mr. Mboowa Ssebwami Deogratias</span> and 
                <span className="font-bold text-emerald-800"> Mrs. Mboowa Mary Gorrethy Nalubega</span>.
              </p>
              <p className="text-slate-600 mb-8 leading-relaxed">
                Established in 2014 and officially opened in 2017, our school stands as a beacon of hope for the community of 
                Lugeye Village, Kakiri Town Council—about 16 miles from Kampala.
              </p>
              <div className="bg-emerald-50 p-6 rounded-xl border-l-4 border-emerald-700 italic text-emerald-900">
                &quot;Together we are winners&quot; — Our Story began with a genuine desire to give back to the community of Lugeye.
              </div>
            </div>
          </div>
        </section>

        {/* --- RESOURCES / CIRCULARS --- */}
        <section id="resources" className="py-20 bg-slate-100 px-6">
          <div className="max-w-7xl mx-auto text-center mb-12">
            <h2 className="text-4xl font-bold text-[#001f3f]">School Resources</h2>
            <p className="text-slate-500 mt-2">Important downloads for parents and guardians</p>
          </div>
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-md flex flex-col items-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-red-600 font-bold">PDF</span>
              </div>
              <h3 className="font-bold text-center mb-4">Admission Requirement & Fees Structure</h3>
              <button className="bg-emerald-700 text-white px-6 py-2 rounded-full text-sm hover:bg-emerald-800">Download Document</button>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-md flex flex-col items-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-red-600 font-bold">PDF</span>
              </div>
              <h3 className="font-bold text-center mb-4">PLE Results 2025</h3>
              <button className="bg-emerald-700 text-white px-6 py-2 rounded-full text-sm hover:bg-emerald-800">Download Results</button>
            </div>
          </div>
        </section>

        {/* --- GALLERY (Public View) --- */}
        <section id="gallery" className="py-20 px-6 max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Our Impact in Photos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
             {/* Replace these divs with real <img> tags once you have them in /public */}
             <div className="aspect-video bg-slate-200 rounded-lg shadow-sm flex items-center justify-center italic text-slate-400">Classroom Learning</div>
             <div className="aspect-video bg-slate-200 rounded-lg shadow-sm flex items-center justify-center italic text-slate-400">Sports Day 2025</div>
             <div className="aspect-video bg-slate-200 rounded-lg shadow-sm flex items-center justify-center italic text-slate-400">Gardening Project</div>
             <div className="aspect-video bg-slate-200 rounded-lg shadow-sm flex items-center justify-center italic text-slate-400">Founders Event</div>
          </div>
        </section>

      <section id="contact" className="py-24 px-6 bg-gray-50 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-black mb-8 uppercase italic">Contact Us</h2>
          <p className="text-gray-600 text-lg mb-12">
            Have questions? Get in touch with us.
          </p>
          <ContactForm />
        </div>
      </section>

      </main>

      {/* --- FOOTER --- */}
      <footer className="bg-[#001f3f] text-white py-16 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12 border-b border-slate-700 pb-12">
          <div>
            <img src="/logo-PNG.png" alt="Logo" className="h-16 bg-white p-1 rounded-md mb-6" />
            <p className="text-slate-400 text-sm">Empowering the next generation with quality, affordable, and holistic education since 2014.</p>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-[#FDB813]">Quick Links</h4>
            <ul className="space-y-3 text-sm text-slate-300">
              <li><a href="#about" className="hover:text-white transition">About Us</a></li>
              <li><a href="#academics" className="hover:text-white transition">Academics</a></li>
              <li><a href="#resources" className="hover:text-white transition">Resources</a></li>
              <li><a href="#gallery" className="hover:text-white transition">Gallery</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-[#FDB813]">Visit Us</h4>
            <p className="text-sm text-slate-300">Lugeye Village, Kakiri Town Council</p>
            <p className="text-sm text-slate-300 mt-2">Wakiso District, Uganda</p>
            <p className="text-sm text-[#FDB813] mt-4 font-bold">marisjuniorsch@gmail.com</p>
          </div>
        </div>
        <div className="text-center mt-12 text-xs text-slate-500">
          © 2026 Maris-Astro Junior School. &quot;Together we are winners&quot;
        </div>
      </footer>

    </div>
  );
}