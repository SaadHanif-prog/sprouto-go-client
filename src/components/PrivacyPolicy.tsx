import { motion } from "motion/react";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import LegalHeader from "./Header";
import Footer from "./Footer";
import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function PrivacyPolicy() {
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
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-0">
                Privacy Policy
              </h1>
            </div>

            <p className="text-slate-400 text-lg mb-12 pb-8 border-b border-white/10">
              Last updated and effective: {new Date().toLocaleDateString()}
              <br />
              Compliant with the UK General Data Protection Regulation (UK GDPR)
              and the Data Protection Act 2018.
            </p>

            <div className="space-y-12 text-slate-300">
              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">
                  1. Important Information and Who We Are
                </h2>
                <h3 className="text-xl font-medium text-white mt-6 mb-3">
                  Purpose of this Privacy Policy
                </h3>
                <p>
                  This privacy policy aims to give you information on how
                  SproutoGO collects and processes your personal data through
                  your use of this website and our services, including any data
                  you may provide when you sign up for our platform, purchase a
                  service, or interact with our AI engine Go's and bio-diverse
                  system.
                </p>
                <p>
                  This website is not intended for children and we do not
                  knowingly collect data relating to children.
                </p>

                <h3 className="text-xl font-medium text-white mt-6 mb-3">
                  Controller
                </h3>
                <p>
                  SproutoGO is the controller and responsible for your personal
                  data (collectively referred to as "SproutoGO", "we", "us" or
                  "our" in this privacy policy).
                </p>

                <h3 className="text-xl font-medium text-white mt-6 mb-3">
                  Contact Details
                </h3>
                <p>
                  If you have any questions about this privacy policy or our
                  privacy practices, please contact our Data Protection Officer
                  (DPO) in the following ways:
                </p>
                <div className="mt-4 p-6 bg-white/5 rounded-xl border border-white/10">
                  <p className="font-medium text-white mb-2">
                    Full name of legal entity: SproutoGO
                  </p>
                  <p>Email address: privacy@sprouto.com</p>
                  <p>Postal address:</p>
                  <p className="text-slate-400">
                    82 King Street
                    <br />
                    Manchester
                    <br />
                    M2 4WQ
                    <br />
                    United Kingdom
                  </p>
                </div>
                <p className="mt-4 text-sm text-slate-400">
                  You have the right to make a complaint at any time to the
                  Information Commissioner's Office (ICO), the UK regulator for
                  data protection issues (www.ico.org.uk). We would, however,
                  appreciate the chance to deal with your concerns before you
                  approach the ICO so please contact us in the first instance.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">
                  2. The Data We Collect About You
                </h2>
                <p>
                  Personal data, or personal information, means any information
                  about an individual from which that person can be identified.
                  It does not include data where the identity has been removed
                  (anonymous data).
                </p>
                <p>
                  We may collect, use, store and transfer different kinds of
                  personal data about you which we have grouped together as
                  follows:
                </p>
                <ul className="list-disc pl-6 mt-4 space-y-3">
                  <li>
                    <strong>Identity Data</strong> includes first name, last
                    name, username or similar identifier, and title.
                  </li>
                  <li>
                    <strong>Contact Data</strong> includes billing address,
                    email address and telephone numbers.
                  </li>
                  <li>
                    <strong>Financial Data</strong> includes bank account and
                    payment card details (processed securely via our payment
                    providers; we do not store full card details).
                  </li>
                  <li>
                    <strong>Transaction Data</strong> includes details about
                    payments to and from you and other details of products and
                    services you have purchased from us.
                  </li>
                  <li>
                    <strong>Technical Data</strong> includes internet protocol
                    (IP) address, your login data, browser type and version,
                    time zone setting and location, browser plug-in types and
                    versions, operating system and platform, and other
                    technology on the devices you use to access this website.
                  </li>
                  <li>
                    <strong>Profile Data</strong> includes your username and
                    password, purchases or orders made by you, your interests,
                    preferences, feedback and survey responses.
                  </li>
                  <li>
                    <strong>Usage Data</strong> includes information about how
                    you use our website, products and services, including
                    interactions with our AI engine Go's.
                  </li>
                  <li>
                    <strong>Marketing and Communications Data</strong> includes
                    your preferences in receiving marketing from us and our
                    third parties and your communication preferences.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">
                  3. How Is Your Personal Data Collected?
                </h2>
                <p>
                  We use different methods to collect data from and about you
                  including through:
                </p>
                <ul className="list-disc pl-6 mt-4 space-y-3">
                  <li>
                    <strong>Direct interactions.</strong> You may give us your
                    Identity, Contact and Financial Data by filling in forms or
                    by corresponding with us by post, phone, email or otherwise.
                  </li>
                  <li>
                    <strong>Automated technologies or interactions.</strong> As
                    you interact with our website, we will automatically collect
                    Technical Data about your equipment, browsing actions and
                    patterns. We collect this personal data by using cookies,
                    server logs and other similar technologies.
                  </li>
                  <li>
                    <strong>
                      Third parties or publicly available sources.
                    </strong>{" "}
                    We will receive personal data about you from various third
                    parties such as analytics providers (e.g., Google),
                    advertising networks, and search information providers.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">
                  4. How We Use Your Personal Data & Legal Basis
                </h2>
                <p>
                  We will only use your personal data when the law allows us to.
                  Most commonly, we will use your personal data in the following
                  circumstances:
                </p>
                <ul className="list-disc pl-6 mt-4 space-y-3">
                  <li>
                    <strong>Performance of Contract:</strong> Where we need to
                    perform the contract we are about to enter into or have
                    entered into with you (e.g., providing our bio-diverse
                    system services).
                  </li>
                  <li>
                    <strong>Legitimate Interests:</strong> Where it is necessary
                    for our legitimate interests (or those of a third party) and
                    your interests and fundamental rights do not override those
                    interests.
                  </li>
                  <li>
                    <strong>Legal Obligation:</strong> Where we need to comply
                    with a legal obligation.
                  </li>
                  <li>
                    <strong>Consent:</strong> Generally, we do not rely on
                    consent as a legal basis for processing your personal data
                    although we will get your consent before sending third-party
                    direct marketing communications to you via email or text
                    message.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">
                  5. Disclosures of Your Personal Data
                </h2>
                <p>
                  We may share your personal data with the parties set out below
                  for the purposes set out in Section 4:
                </p>
                <ul className="list-disc pl-6 mt-4 space-y-3">
                  <li>
                    Internal Third Parties: Other companies in the SproutoGO
                    Group acting as joint controllers or processors.
                  </li>
                  <li>
                    External Third Parties: Service providers acting as
                    processors based in the UK, EEA, or US who provide IT and
                    system administration services, including AI processing
                    partners.
                  </li>
                  <li>
                    Professional advisers acting as processors or joint
                    controllers including lawyers, bankers, auditors and
                    insurers.
                  </li>
                  <li>
                    HM Revenue & Customs, regulators and other authorities
                    acting as processors or joint controllers based in the
                    United Kingdom.
                  </li>
                </ul>
                <p className="mt-4">
                  We require all third parties to respect the security of your
                  personal data and to treat it in accordance with the law. We
                  do not allow our third-party service providers to use your
                  personal data for their own purposes and only permit them to
                  process your personal data for specified purposes and in
                  accordance with our instructions.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">
                  6. International Transfers
                </h2>
                <p>
                  Some of our external third parties are based outside the UK,
                  so their processing of your personal data will involve a
                  transfer of data outside the UK.
                </p>
                <p>
                  Whenever we transfer your personal data out of the UK, we
                  ensure a similar degree of protection is afforded to it by
                  ensuring at least one of the following safeguards is
                  implemented:
                </p>
                <ul className="list-disc pl-6 mt-4 space-y-3">
                  <li>
                    We will only transfer your personal data to countries that
                    have been deemed to provide an adequate level of protection
                    for personal data.
                  </li>
                  <li>
                    Where we use certain service providers, we may use specific
                    contracts approved for use in the UK which give personal
                    data the same protection it has in the UK (e.g.,
                    International Data Transfer Agreement or Addendum).
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">
                  7. Data Security
                </h2>
                <p>
                  We have put in place appropriate security measures to prevent
                  your personal data from being accidentally lost, used or
                  accessed in an unauthorised way, altered or disclosed. In
                  addition, we limit access to your personal data to those
                  employees, agents, contractors and other third parties who
                  have a business need to know. They will only process your
                  personal data on our instructions and they are subject to a
                  duty of confidentiality.
                </p>
                <p>
                  We have put in place procedures to deal with any suspected
                  personal data breach and will notify you and any applicable
                  regulator of a breach where we are legally required to do so.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">
                  8. Data Retention
                </h2>
                <p>
                  We will only retain your personal data for as long as
                  reasonably necessary to fulfil the purposes we collected it
                  for, including for the purposes of satisfying any legal,
                  regulatory, tax, accounting or reporting requirements. We may
                  retain your personal data for a longer period in the event of
                  a complaint or if we reasonably believe there is a prospect of
                  litigation in respect to our relationship with you.
                </p>
                <p>
                  To determine the appropriate retention period for personal
                  data, we consider the amount, nature and sensitivity of the
                  personal data, the potential risk of harm from unauthorised
                  use or disclosure of your personal data, the purposes for
                  which we process your personal data and whether we can achieve
                  those purposes through other means, and the applicable legal,
                  regulatory, tax, accounting or other requirements.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">
                  9. Your Legal Rights
                </h2>
                <p>
                  Under certain circumstances, you have rights under data
                  protection laws in relation to your personal data. You have
                  the right to:
                </p>
                <ul className="list-disc pl-6 mt-4 space-y-3">
                  <li>
                    <strong>Request access</strong> to your personal data
                    (commonly known as a "data subject access request").
                  </li>
                  <li>
                    <strong>Request correction</strong> of the personal data
                    that we hold about you.
                  </li>
                  <li>
                    <strong>Request erasure</strong> of your personal data.
                  </li>
                  <li>
                    <strong>Object to processing</strong> of your personal data
                    where we are relying on a legitimate interest.
                  </li>
                  <li>
                    <strong>Request restriction of processing</strong> of your
                    personal data.
                  </li>
                  <li>
                    <strong>Request the transfer</strong> of your personal data
                    to you or to a third party.
                  </li>
                  <li>
                    <strong>Withdraw consent at any time</strong> where we are
                    relying on consent to process your personal data.
                  </li>
                </ul>
                <p className="mt-4">
                  If you wish to exercise any of the rights set out above,
                  please contact us at privacy@sprouto.com.
                </p>
                <p>
                  <strong>No fee usually required:</strong> You will not have to
                  pay a fee to access your personal data (or to exercise any of
                  the other rights). However, we may charge a reasonable fee if
                  your request is clearly unfounded, repetitive or excessive.
                  Alternatively, we could refuse to comply with your request in
                  these circumstances.
                </p>
              </section>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
}
