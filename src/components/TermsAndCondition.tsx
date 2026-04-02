import { motion } from "motion/react";
import { ArrowLeft, FileText } from "lucide-react";

import LegalHeader from "./Header";
import Footer from "./Footer";
import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function TermsOfService() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <LegalHeader />
      <div className="min-h-screen bg-[#050505] text-white pt-8 md:pt-16 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <Link to="/">
            <button className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-12 group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />{" "}
              Back to Home
            </button>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="prose prose-invert prose-emerald max-w-none"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-center text-emerald-400">
                <FileText className="w-6 h-6" />
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-0 ">
                Terms of Service
              </h1>
            </div>

            <p className="text-slate-400 text-lg mb-12 pb-8 border-b border-white/10">
              Last Updated: April 2nd 2026
            </p>

            <div className="space-y-12 text-slate-300">
              <section>
                <p>
                  Welcome to SproutoGo (the "Platform"), a service provided by
                  SproutoGo ("we," "us," or "our") designed to support and
                  empower microbusinesses.
                </p>
                <p>
                  By accessing or using our website at www.sproutogo.com and any
                  associated services, you agree to be bound by these Terms of
                  Service ("Terms"). Please read them carefully. If you do not
                  agree to these Terms, you must not use the Platform.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">
                  1. About the Platform
                </h2>
                <p>
                  SproutoGo provides digital tools and services specifically
                  curated for microbusinesses. These Terms apply to all users,
                  including those who are browsing or registered subscribers.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">
                  2. Eligibility
                </h2>
                <ul className="list-disc pl-6 mt-4 space-y-3">
                  <li>Be at least 18 years of age.</li>
                  <li>
                    Represent a legitimate microbusiness or be an individual
                    intending to start one.
                  </li>
                  <li>
                    Have the legal capacity to enter into a binding contract.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">
                  3. Subscription Plans and Terms
                </h2>

                <h3 className="text-xl font-medium text-white mt-6 mb-3">
                  3.1 Yearly Plans
                </h3>
                <p>
                  <strong>Term:</strong> Yearly subscriptions are billed
                  annually and provide access to the Platform for a period of 12
                  months from the date of purchase.
                </p>
                <p>
                  <strong>Renewal:</strong> Unless cancelled, yearly plans will
                  automatically renew for subsequent 12-month periods.
                </p>

                <h3 className="text-xl font-medium text-white mt-6 mb-3">
                  3.2 Monthly Plans
                </h3>
                <p>
                  <strong>Minimum Term:</strong> All monthly subscriptions are
                  subject to a minimum commitment period of four (4) months.
                </p>
                <p>
                  <strong>Billing:</strong> After the initial four-month period,
                  your subscription will continue on a rolling month-to-month
                  basis.
                </p>
                <p>
                  <strong>Cancellation:</strong> You may cancel anytime, but
                  access and billing continue until the end of the minimum term
                  or current billing month (whichever is later).
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">
                  4. Cancellation and Cooling-off Period
                </h2>
                <p>
                  We provide a 14-day cooling-off period from the date of your
                  initial sign-up.
                </p>
                <p>
                  <strong>Right to Cancel:</strong> You may cancel within the
                  first 14 days to terminate long-term commitments.
                </p>
                <p>
                  <strong>No Refunds:</strong> All fees are non-refundable.
                  Access continues until the paid period ends.
                </p>
                <p>
                  <strong>Post-Cooling-off:</strong> After 14 days, you are
                  bound by your selected plan duration.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">
                  5. Fees and Payment
                </h2>
                <ul className="list-disc pl-6 mt-4 space-y-3">
                  <li>
                    <strong>Non-Refundable Policy:</strong> All payments are
                    final unless required by law.
                  </li>
                  <li>
                    <strong>Pricing:</strong> Prices may change with 30 days’
                    notice.
                  </li>
                  <li>
                    <strong>Payment Method:</strong> A valid payment method is
                    required.
                  </li>
                  <li>
                    <strong>Taxes:</strong> Fees include VAT where applicable.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">
                  6. Acceptable Use
                </h2>
                <ul className="list-disc pl-6 mt-4 space-y-3">
                  <li>Do not use the Platform for unlawful purposes.</li>
                  <li>
                    Do not interfere with system security or functionality.
                  </li>
                  <li>
                    Do not upload harmful, illegal, or infringing content.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">
                  7. Intellectual Property
                </h2>
                <p>
                  <strong>Our Content:</strong> All platform materials are owned
                  or licensed by SproutoGo.
                </p>
                <p>
                  <strong>Your Content:</strong> You retain ownership but grant
                  us a licence to process it for service delivery.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">
                  8. Limitation of Liability
                </h2>
                <ul className="list-disc pl-6 mt-4 space-y-3">
                  <li>The Platform is provided "as-is" and "as-available".</li>
                  <li>
                    We are not liable for indirect or consequential damages.
                  </li>
                  <li>
                    Liability is capped at the amount paid in the last 12
                    months.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">
                  9. Termination
                </h2>
                <p>
                  <strong>By You:</strong> You may terminate via your dashboard
                  (subject to terms).
                </p>
                <p>
                  <strong>By Us:</strong> We may suspend or terminate access for
                  violations or service discontinuation.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">
                  10. Changes to Terms
                </h2>
                <p>
                  We may update these Terms from time to time. Continued use of
                  the Platform after changes constitutes acceptance.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">
                  11. Governing Law
                </h2>
                <p>
                  These Terms are governed by the laws of England and Wales.
                  Disputes fall under their exclusive jurisdiction.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">
                  Contact Us
                </h2>
                <p>
                  If you have any questions about these Terms, please contact us
                  at:
                </p>
                <div className="mt-4 p-6 bg-white/5 rounded-xl border border-white/10">
                  <p className="text-white font-medium">support@sprouto.com</p>
                </div>
              </section>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
}
