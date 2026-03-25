import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Cookie } from 'lucide-react';

export default function CookiesPolicy({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen bg-[#050505] text-white pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-12 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Home
        </button>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="prose prose-invert prose-emerald max-w-none"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-center text-emerald-400">
              <Cookie className="w-6 h-6" />
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold m-0">Cookies Policy</h1>
          </div>
          
          <p className="text-slate-400 text-lg mb-12 pb-8 border-b border-white/10">
            Last updated and effective: {new Date().toLocaleDateString()}<br/>
            Compliant with the UK Privacy and Electronic Communications Regulations (PECR) and UK GDPR.
          </p>
          
          <div className="space-y-12 text-slate-300">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">1. Information About Our Use of Cookies</h2>
              <p>Our website uses cookies to distinguish you from other users of our website. This helps us to provide you with a good experience when you browse our website and also allows us to improve our site.</p>
              <p>By continuing to browse the site, you are agreeing to our use of cookies as set out in this policy. We will ask for your consent to place cookies or other similar technologies on your device, except where they are essential for us to provide you with a service that you have requested.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">2. What Are Cookies?</h2>
              <p>A cookie is a small file of letters and numbers that we store on your browser or the hard drive of your computer if you agree. Cookies contain information that is transferred to your computer's hard drive.</p>
              <p>Cookies can be "persistent" or "session" cookies. Persistent cookies remain on your personal computer or mobile device when you go offline, while session cookies are deleted as soon as you close your web browser.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">3. Types of Cookies We Use</h2>
              <p>We use the following cookies:</p>
              <ul className="list-disc pl-6 mt-4 space-y-4">
                <li>
                  <strong>Strictly necessary cookies:</strong> These are cookies that are required for the operation of our website. They include, for example, cookies that enable you to log into secure areas of our website, use a shopping cart or make use of e-billing services. We do not require your consent to place these cookies.
                </li>
                <li>
                  <strong>Analytical or performance cookies:</strong> These allow us to recognise and count the number of visitors and to see how visitors move around our website when they are using it. This helps us to improve the way our website works, for example, by ensuring that users are finding what they are looking for easily. We use third-party analytics services, such as Google Analytics, to help us understand how our site is used.
                </li>
                <li>
                  <strong>Functionality cookies:</strong> These are used to recognise you when you return to our website. This enables us to personalise our content for you, greet you by name and remember your preferences (for example, your choice of language or region).
                </li>
                <li>
                  <strong>Targeting cookies:</strong> These cookies record your visit to our website, the pages you have visited and the links you have followed. We will use this information to make our website and the advertising displayed on it more relevant to your interests. We may also share this information with third parties for this purpose.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">4. Third-Party Cookies</h2>
              <p>Please note that third parties (including, for example, advertising networks and providers of external services like web traffic analysis services) may also use cookies, over which we have no control. These cookies are likely to be analytical/performance cookies or targeting cookies.</p>
              <p>Our bio-diverse system and AI engine Go's may utilize third-party integrations that set their own cookies to function correctly, particularly when analyzing SEO performance or website traffic patterns.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">5. Cookie Consent and Management</h2>
              <p>When you first visit our website, you will be presented with a cookie banner requesting your consent to set non-essential cookies. You can choose to accept all cookies, reject non-essential cookies, or manage your preferences.</p>
              <h3 className="text-xl font-medium text-white mt-6 mb-3">How to block cookies via your browser</h3>
              <p>You can block cookies by activating the setting on your browser that allows you to refuse the setting of all or some cookies. However, if you use your browser settings to block all cookies (including essential cookies) you may not be able to access all or parts of our website.</p>
              <p>To find out more about cookies, including how to see what cookies have been set and how to manage and delete them, visit <a href="https://www.aboutcookies.org" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300">www.aboutcookies.org</a> or <a href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300">www.allaboutcookies.org</a>.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">6. Changes to This Policy</h2>
              <p>We may update this Cookie Policy from time to time in order to reflect, for example, changes to the cookies we use or for other operational, legal or regulatory reasons. Please therefore re-visit this Cookie Policy regularly to stay informed about our use of cookies and related technologies.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">7. Contact Us</h2>
              <p>If you have any questions about our use of cookies, please contact us at:</p>
              <div className="mt-4 p-6 bg-white/5 rounded-xl border border-white/10">
                <p className="font-medium text-white mb-2">SproutoGO</p>
                <p>Email: privacy@sprouto.com</p>
                <p>Postal address:</p>
                <p className="text-slate-400">
                  82 King Street<br />
                  Manchester<br />
                  M2 4WQ<br />
                  United Kingdom
                </p>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
