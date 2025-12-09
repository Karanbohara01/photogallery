import React from 'react';

export default function CompliancePage() {
  return (
    <div className="min-h-screen bg-[#0f0f0f] text-gray-300 p-8">
      <div className="max-w-3xl mx-auto bg-[#1a1a1a] p-8 rounded border border-[#333]">
        <h1 className="text-2xl font-bold text-white mb-6 uppercase border-b border-[#333] pb-4">
          18 U.S.C. § 2257 Compliance Statement
        </h1>
        
        <div className="space-y-6 text-sm leading-relaxed">
          <p>
            All models, actors, actresses, and other persons that appear in any visual depiction of actual or simulated sexually explicit conduct appearing on or otherwise contained in this Website were over the age of eighteen (18) years at the time of the creation of such visual depictions.
          </p>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">1. Third-Party Content</h2>
            <p>
              Much of the content on this Website is provided by third-party sponsors or embedded from third-party tube sites. NepalTube does not act as the "primary producer" of such content. The records required pursuant to 18 U.S.C. § 2257 for such third-party content are maintained by the respective producers and can be found on their original websites.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">2. User-Uploaded Content</h2>
            <p>
              For content directly uploaded to our servers by authorized users, we verify that all depicted individuals are adults. We strictly prohibit the upload of content featuring minors.
            </p>
          </section>

          <section className="bg-[#111] p-4 border border-[#333] rounded">
            <h2 className="text-lg font-bold text-white mb-2">Custodian of Records</h2>
            <p className="mb-2">The records required by 18 U.S.C. § 2257 for materials produced or hosted by NepalTube are kept by the Custodian of Records at:</p>
            
            <address className="not-italic text-gray-400">
              <strong>NepalTube Compliance Dept.</strong><br />
              [Your Physical Address or PO Box Here]<br />
              Kathmandu, Nepal<br />
              Email: compliance@nepaltube.com
            </address>
          </section>
        </div>
      </div>
    </div>
  );
}