import React from 'react';

const About = () => {
  return (
    <div className="bg-gradient-to-b from-white via-blue-50 to-slate-100 text-slate-800 px-6 py-16 lg:px-24">
      {/* Hero Section */}
      <section className="text-center mb-20">
        <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-900 mb-4 drop-shadow-md">
          About Conquer Technologies
        </h1>
        <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">
          Powering digital evolution for over 30 years — Conquer Technologies is India’s trusted partner for innovative IT solutions,
          Apple enterprise deployment, and next-gen infrastructure services.
        </p>
      </section>

      {/* Mission Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-blue-700 mb-4">Our Mission</h2>
        <p className="text-slate-700 text-base md:text-lg leading-relaxed max-w-4xl">
          To drive progress through powerful, efficient, and tailored technology solutions. We help organizations unlock their
          potential through industry-leading devices, intelligent infrastructure, and future-ready support systems.
        </p>
      </section>

      {/* Services Section */}
      <section className="mb-20">
        <h2 className="text-2xl font-semibold text-blue-700 mb-6">What We Offer</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { title: 'Apple Enterprise & Education', color: 'bg-indigo-100' },
            { title: 'Smart Campus Integration', color: 'bg-blue-100' },
            { title: 'IT Infrastructure (HP, Dell, Lenovo)', color: 'bg-sky-100' },
            { title: 'Cloud & Network Services', color: 'bg-cyan-100' },
            { title: 'Sustainable Tech Solutions', color: 'bg-emerald-100' },
            { title: 'Certified Repairs & Support', color: 'bg-rose-100' },
          ].map(({ title, color }, index) => (
            <div
              key={index}
              className={`${color} p-6 rounded-2xl shadow hover:shadow-lg transition-all duration-300 border border-white`}
            >
              <p className="text-lg font-medium text-slate-800">{title}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-blue-700 mb-4">Why Choose Us?</h2>
        <p className="text-slate-700 text-base md:text-lg leading-relaxed max-w-4xl">
          We combine experience, certification, and a client-first approach. As an Apple Authorized Enterprise Reseller
          with partnerships across the tech ecosystem, we’re uniquely positioned to deliver scalable, secure,
          and sustainable solutions that move your business forward.
        </p>
      </section>
    </div>
  );
};

export default About;
