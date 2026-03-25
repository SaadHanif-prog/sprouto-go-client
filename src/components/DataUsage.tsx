import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Database } from 'lucide-react';

export default function DataUsage({ onBack }: { onBack: () => void }) {
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
              <Database className="w-6 h-6" />
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold m-0">How We Use Your Data</h1>
          </div>
          
          <p className="text-slate-400 text-lg mb-12 pb-8 border-b border-white/10">
            Last updated and effective: {new Date().toLocaleDateString()}<br/>
            Compliant with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.
          </p>
          
          <div className="space-y-12 text-slate-300">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">1. Our Commitment to Data Privacy</h2>
              <p>At SproutoGO, we believe in transparency regarding how we handle your information. This page explains specifically how we process, store, and utilize the data you entrust to us when using our platform, our bio-diverse system, and our innovative AI engine Go's.</p>
              <p>Under the UK GDPR, we must always have a lawful basis for using personal data. This may be because the data is necessary for our performance of a contract with you, because you have consented to our use of your personal data, or because it is in our legitimate business interests to use it.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">2. Core Data Usage and Processing</h2>
              <p>We use your data primarily to provide and improve our services. This includes:</p>
              <ul className="list-disc pl-6 mt-4 space-y-4">
                <li>
                  <strong>Service Delivery:</strong> Managing your account, processing payments, and delivering the digital growth services you've requested. This includes building, hosting, and maintaining your website.
                </li>
                <li>
                  <strong>Communication:</strong> Sending you important updates about your account, service changes, responding to your support requests, and providing performance reports.
                </li>
                <li>
                  <strong>Analytics and Improvement:</strong> Understanding how our platform is used to improve user experience, develop new features, and ensure the security of our systems.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">3. The "Go's" AI Engine and Bio-Diverse System</h2>
              <p>A core component of SproutoGO is our proprietary AI engine, Go's, and our bio-diverse system. These systems process data to automate tasks, generate insights, and accelerate your growth.</p>
              <h3 className="text-xl font-medium text-white mt-6 mb-3">How AI Processing Works</h3>
              <p>Our AI systems analyze your website data, traffic patterns, and SEO metrics to provide actionable insights and automated improvements. The data processed by our AI includes:</p>
              <ul className="list-disc pl-6 mt-4 space-y-3">
                <li>Website performance metrics (load times, bounce rates).</li>
                <li>Search engine ranking data and keyword performance.</li>
                <li>Anonymized user interaction data on your website.</li>
                <li>Content from your website to generate SEO recommendations.</li>
              </ul>
              
              <h3 className="text-xl font-medium text-white mt-6 mb-3">Automated Decision-Making and Profiling</h3>
              <p>We use automated systems to analyze your website's performance and generate recommendations. However, these automated processes do not produce legal effects concerning you or similarly significantly affect you. They are solely used to provide business insights and optimize your digital presence. You always have the right to request human intervention or challenge an automated recommendation.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">4. Data Minimization and Anonymization</h2>
              <p>We adhere strictly to the principle of data minimization. We only collect and process the data that is absolutely necessary for the purposes stated in this policy.</p>
              <p>When training or improving our AI models, we use aggregated and anonymized data wherever possible. This means that the data cannot be linked back to you or your specific business, ensuring your privacy is protected while allowing us to improve our services for all users.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">5. Data Sharing and Third Parties</h2>
              <p>We do not sell your personal data. We only share your data with trusted third parties when necessary to provide our services, under strict data processing agreements:</p>
              <ul className="list-disc pl-6 mt-4 space-y-3">
                <li><strong>Service Providers:</strong> Cloud hosting providers (e.g., AWS, Google Cloud), payment processors (e.g., Stripe), and analytics tools that help us operate our business.</li>
                <li><strong>AI Partners:</strong> We may use third-party AI models (such as Google Gemini) to power specific features. Data shared with these partners is strictly limited to the context required for the task and is not used by them to train their own models unless explicitly stated and consented to.</li>
                <li><strong>Legal Requirements:</strong> When required by law, court order, or to protect our rights and the safety of our users.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">6. Your Rights and Control</h2>
              <p>Under the UK GDPR, you have full control over your data. You have the right to:</p>
              <ul className="list-disc pl-6 mt-4 space-y-3">
                <li><strong>Access:</strong> Request a copy of the personal data we hold about you.</li>
                <li><strong>Rectification:</strong> Request correction of inaccurate or incomplete data.</li>
                <li><strong>Erasure:</strong> Request deletion of your personal data (the "right to be forgotten").</li>
                <li><strong>Restriction:</strong> Request that we limit the processing of your data.</li>
                <li><strong>Portability:</strong> Request the transfer of your data to another service provider.</li>
                <li><strong>Objection:</strong> Object to our processing of your data, particularly for direct marketing or automated profiling.</li>
              </ul>
              <p className="mt-4">To exercise any of these rights, please contact our Data Protection Officer.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">7. Contact Us</h2>
              <p>If you have any questions about how we use your data or wish to exercise your rights, please contact our Data Protection Officer at:</p>
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
