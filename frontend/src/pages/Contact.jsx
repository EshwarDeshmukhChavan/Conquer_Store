import React from 'react';

const Contact = () => {
  return (
    <div className="bg-gradient-to-b from-slate-50 to-white text-slate-800 px-6 py-16 lg:px-24">
      {/* Header */}
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-4">Contact Us</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          We’d love to hear from you! Whether you have a question about solutions, pricing, demos, or anything else — our team is ready to help.
        </p>
      </section>

      {/* Form & Info Grid */}
      <div className="grid md:grid-cols-2 gap-10 items-start">
        {/* Contact Form */}
        <form className="bg-white p-8 rounded-2xl shadow-md space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your full name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="message">Message</label>
            <textarea
              id="message"
              rows="5"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tell us how we can help you..."
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition duration-200 w-full"
          >
            Send Message
          </button>
        </form>

        {/* Company Info */}
        <div className="space-y-6 bg-blue-50 p-8 rounded-2xl shadow-md text-slate-800">
          <h2 className="text-2xl font-semibold text-blue-800">Conquer Technologies</h2>
          <div className="space-y-2 text-sm md:text-base">
            <p><strong>📍 Address:</strong><br />113, Aditya Trade Center, Ameerpet, Hyderabad, Telangana - 500038</p>
            <p><strong>📞 Phone:</strong><br />1800 572 9904</p>
            <p><strong>📧 Email:</strong><br />enquiry@vconquer.com</p>
            <p><strong>🕒 Business Hours:</strong><br />Monday – Saturday: 10:00 AM to 6:00 PM</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
