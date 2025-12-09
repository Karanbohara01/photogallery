import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0f0f0f] text-gray-300 p-8">
      <div className="max-w-3xl mx-auto bg-[#1a1a1a] p-8 rounded border border-[#333]">
        <h1 className="text-3xl font-bold text-[#e62e04] mb-6">Privacy Policy</h1>
        
        <div className="space-y-6 text-sm leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white mb-2">1. Information We Collect</h2>
            <p>We do not collect personal names, addresses, or phone numbers from visitors. We may collect non-personal technical data such as your IP address, browser type, and device type for analytics purposes.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">2. Cookies</h2>
            <p>We use cookies to improve user experience and serve personalized advertisements. Third-party vendors, including ad networks like ExoClick and JuicyAds, use cookies to serve ads based on a user's prior visits to our website.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">3. Third-Party Advertising</h2>
            <p>We use third-party advertising companies to serve ads when you visit our Website. These companies may use information (not including your name, address, email address, or telephone number) about your visits to this and other websites in order to provide advertisements about goods and services of interest to you.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">4. Security</h2>
            <p>We implement a variety of security measures to maintain the safety of your personal information. However, no method of transmission over the Internet is 100% secure.</p>
          </section>
        </div>
      </div>
    </div>
  );
}