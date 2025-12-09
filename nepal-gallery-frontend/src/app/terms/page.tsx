import React from 'react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0f0f0f] text-gray-300 p-8">
      <div className="max-w-3xl mx-auto bg-[#1a1a1a] p-8 rounded border border-[#333]">
        <h1 className="text-3xl font-bold text-[#e62e04] mb-6">Terms of Service</h1>
        
        <div className="space-y-6 text-sm leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white mb-2">1. Acceptance of Terms</h2>
            <p>By accessing and using NepalTube (the "Website"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use this Website.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">2. Age Restriction (18+)</h2>
            <p>This Website contains age-restricted materials. By entering, you affirm that you are at least 18 years of age or the age of majority in the jurisdiction you are accessing the Website from, and you represent that it is legal for you to view sexually explicit material in your jurisdiction.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">3. User Generated Content</h2>
            <p>Users are solely responsible for the content they upload. NepalTube acts as a passive conduit for the online distribution of user-submitted material. We do not endorse any user-submitted content. We strictly prohibit:</p>
            <ul className="list-disc ml-5 mt-2 space-y-1 text-gray-400">
              <li>Content depicting minors (under 18).</li>
              <li>Non-consensual sexual content.</li>
              <li>Bestiality, violence, or illegal acts.</li>
              <li>Copyrighted material without permission.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">4. DMCA & Takedowns</h2>
            <p>We respect intellectual property rights. If you believe your work has been copied in a way that constitutes copyright infringement, please contact us immediately at <strong>admin@nepaltube.com</strong> for removal.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-2">5. Limitation of Liability</h2>
            <p>The Website is provided "as is". We are not liable for any damages resulting from the use of this site. Use it at your own risk.</p>
          </section>
        </div>
      </div>
    </div>
  );
}