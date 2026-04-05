"use client";

import { motion } from "framer-motion";
import { fadeUp } from "@/app/animations";
import { useRef } from "react";
import PageHeader from "@/components/public/ui/PageHeader";
import SectionHeading from "@/components/public/ui/SectionHeading";

const sections = [
  { id: "info", label: "Information We Collect" },
  { id: "purpose", label: "Purpose of Processing" },
  { id: "cookies", label: "Cookies & Tracking" },
  { id: "thirdparty", label: "Service Providers" },
  { id: "payments", label: "Payments" },
  { id: "retention", label: "Data Retention" },
  { id: "international", label: "International Data" },
  { id: "updates", label: "Policy Updates" },
  { id: "contact", label: "Contact" },
];

export default function PrivacyClient() {
  const contentRef = useRef<HTMLDivElement>(null);

  const sectionRefs = {
    info: useRef<HTMLElement>(null),
    purpose: useRef<HTMLElement>(null),
    cookies: useRef<HTMLElement>(null),
    thirdparty: useRef<HTMLElement>(null),
    payments: useRef<HTMLElement>(null),
    retention: useRef<HTMLElement>(null),
    international: useRef<HTMLElement>(null),
    updates: useRef<HTMLElement>(null),
    contact: useRef<HTMLElement>(null),
  };

  const handleScrollTo = (id: keyof typeof sectionRefs) => {
    const container = contentRef.current;
    const target = sectionRefs[id].current;

    if (!container || !target) return;

    const containerRect = container.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();

    const offset = targetRect.top - containerRect.top;

    container.scrollTo({
      top: container.scrollTop + offset - 20,
      behavior: "smooth",
    });
  };

  return (
    <section className="w-full">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1100px] mx-auto mt-24">
          <PageHeader
            title="Privacy Policy"
            subtitle="How Vedic Wellness protects your information with transparency, responsibility, and modern data protection practices."
          />
        </div>

        <div className="mt-10 grid lg:grid-cols-[280px_minmax(0,1fr)] gap-8 items-start mb-24">
          {/* SIDEBAR */}
          <aside className="hidden lg:block sticky top-48 self-start">
            <div className="surface rounded-xl p-5 space-y-4 text-sm">
              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleScrollTo(s.id as keyof typeof sectionRefs)}
                  className="
                    group relative block w-fit text-left 
                    text-neutral-500 dark:text-neutral-400 
                    hover:text-neutral-900 dark:hover:text-white 
                    transition-colors duration-300 font-medium pb-1
                  "
                >
                  {s.label}
                  {/* Sliding Underline */}
                  <span className="absolute left-0 bottom-0 h-[1.5px] w-0 bg-neutral-900 dark:bg-white transition-all duration-300 group-hover:w-full" />
                </button>
              ))}
            </div>
          </aside>

          {/* SCROLLABLE POLICY CARD */}
          <motion.div
            ref={contentRef}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="
              surface
              rounded-2xl
              p-6 md:p-10
              leading-relaxed
              overflow-y-auto
              h-[70vh]
              scroll-smooth
              space-y-14
            "
          >
            <p className="text-sm text-muted">
              Last Updated: 16-Feb-2026
            </p>

            {/* 1 */}
            <section ref={sectionRefs.info} id="info" className="space-y-6">
              <SectionHeading title="1. Information We Collect" />
              <p>
                Vedic Wellness collects information that users voluntarily
                provide when interacting with our digital platforms, franchise
                inquiry systems, and product ordering workflows. This may
                include contact details such as name, phone number, email
                address, business location, and any information submitted
                through franchise or product inquiry forms. When creating an
                account or engaging in business communication, limited identity
                data may be stored to maintain continuity of service and
                improve operational reliability. In addition to information
                directly provided by users, certain technical metadata is
                automatically collected to maintain platform performance,
                security, and fraud prevention. This may include device type,
                browser category, anonymized IP indicators, and general usage
                patterns necessary to keep the platform stable and protected.
                Vedic Wellness does not intentionally collect excessive or
                irrelevant personal data and limits collection strictly to
                information required for business functionality, customer
                support, logistics coordination, and service optimization.
              </p>
            </section>

            {/* 2 */}
            <section ref={sectionRefs.purpose} id="purpose" className="space-y-6">
              <SectionHeading title="2. Purpose of Data Processing" />
              <p>
                All information collected by Vedic Wellness is processed for
                clearly defined business purposes that align with ethical data
                practices and responsible operational management. These
                purposes include responding to franchise or product inquiries,
                managing registered accounts, facilitating order coordination,
                maintaining internal records, and ensuring that platform
                services remain secure and reliable. Data may also be used to
                analyze general performance metrics, identify technical issues,
                and enhance overall user experience without profiling
                individuals for targeted advertising. Processing activities are
                designed to minimize exposure of personal data while ensuring
                that customers receive efficient support and accurate
                communication. Vedic Wellness does not sell personal
                information, does not engage in behavioral advertising, and
                does not use personal data for unrelated marketing campaigns.
                Information is handled strictly within the boundaries necessary
                to fulfill legitimate business operations and applicable legal
                obligations.
              </p>
            </section>

            {/* 3 */}
            <section ref={sectionRefs.cookies} id="cookies" className="space-y-6">
              <SectionHeading title="3. Cookies and Technical Tracking" />
              <p>
                Our website utilizes essential cookies and technical tracking
                mechanisms that support core functionality such as user
                authentication, session stability, and protection against
                automated abuse. These cookies help maintain login sessions,
                remember basic interface preferences, and ensure secure access
                to account-related features. Unlike advertising platforms, our
                systems do not deploy cross-site tracking technologies or
                behavioral profiling tools. Any performance analytics collected
                are aggregated and anonymized to monitor uptime, loading speed,
                and technical reliability rather than individual behavior.
                Cookies used within the platform are strictly operational and
                are configured to expire based on session or system
                requirements. Users retain control through browser settings,
                though disabling essential cookies may impact certain
                functionalities. Our goal is to maintain a secure and efficient
                browsing environment without intrusive tracking practices.
              </p>
            </section>

            {/* 4 */}
            <section ref={sectionRefs.thirdparty} id="thirdparty" className="space-y-6">
              <SectionHeading title="4. Service Providers" />
              <p>
                Vedic Wellness collaborates with carefully selected technology
                partners that provide hosting infrastructure, secure storage,
                monitoring tools, and platform maintenance services. These
                service providers operate under contractual obligations that
                restrict them from using data for independent purposes and
                require adherence to modern security practices. Access to
                information is limited strictly to what is necessary for system
                operation, performance optimization, or technical diagnostics.
                Examples of service functions include cloud hosting,
                application deployment environments, content delivery networks,
                and error monitoring solutions. We do not authorize third-party
                partners to sell, distribute, or repurpose personal information
                outside the scope of platform functionality. By working only
                with trusted infrastructure providers, we ensure that the
                underlying technology supporting Vedic Wellness maintains
                reliability while safeguarding user privacy at every stage of
                operation.
              </p>
            </section>

            {/* 5 */}
            <section ref={sectionRefs.payments} id="payments" className="space-y-6">
              <SectionHeading title="5. Payments and Financial Information" />
              <p>
                Vedic Wellness prioritizes financial security by minimizing the
                collection and storage of sensitive payment information. The
                platform does not store credit card numbers, banking
                credentials, or payment authentication data within its own
                systems. Transactions may be handled through invoice-based
                workflows or secure external payment channels depending on the
                nature of the business relationship. Any financial processing
                that occurs through third-party systems follows the policies
                and security frameworks established by those providers. Our
                internal systems retain only limited transactional records
                required for accounting, order verification, and compliance
                obligations.
              </p>
            </section>

            {/* 6 */}
            <section ref={sectionRefs.retention} id="retention" className="space-y-6">
              <SectionHeading title="6. Data Retention" />
              <p>
                Information is retained only for durations that support
                operational continuity, customer communication, and legal
                compliance requirements. Customer account records and order
                history may be preserved to ensure accurate service delivery,
                resolve disputes, and maintain transparent transaction logs.
                Inquiry submissions and communication records are stored for
                reasonable periods so that follow-up support and business
                coordination can occur efficiently. Technical system logs are
                maintained temporarily to monitor performance, identify
                security incidents, and improve infrastructure stability.
                Retention timelines are periodically reviewed to prevent
                unnecessary accumulation of data, and outdated information is
                securely removed or anonymized when no longer required. This
                structured retention approach helps maintain accountability
                while protecting users from excessive long-term storage of
                personal details.
              </p>
            </section>

            {/* 7 */}
            <section ref={sectionRefs.international} id="international" className="space-y-6">
              <SectionHeading title="7. International Data Processing" />
              <p>
                Depending on operational needs, certain technical services used
                by Vedic Wellness may operate on infrastructure located outside
                a user's immediate geographic region. When international data
                processing occurs, safeguards are implemented to maintain
                confidentiality, integrity, and protection standards consistent
                with modern industry practices. These safeguards may include
                encrypted data transmission, restricted access controls, and
                contractual agreements with infrastructure providers. While
                cross-border processing can improve platform reliability and
                performance, Vedic Wellness ensures that such processing is
                limited to essential technical operations and does not expose
                users to unnecessary privacy risks. Our commitment is to ensure
                that data remains handled responsibly regardless of where
                underlying servers or operational tools may be located.
              </p>
            </section>

            {/* 8 */}
            <section ref={sectionRefs.updates} id="updates" className="space-y-6">
              <SectionHeading title="8. Policy Updates" />
              <p>
                This Privacy Policy may evolve periodically to reflect updates
                to technology infrastructure, regulatory requirements, or
                improvements to our services. When changes are made, the
                revision date displayed at the top of this document will be
                updated to maintain transparency. Minor adjustments that do not
                materially affect user rights may occur without direct notice,
                while significant changes will be communicated through
                appropriate website announcements when applicable. Continued
                use of the Vedic Wellness platform after updates are published
                indicates acceptance of the revised terms. We encourage users
                to review this policy occasionally to stay informed about how
                information is handled and protected within our ecosystem.
              </p>
            </section>

            {/* 9 */}
            <section ref={sectionRefs.contact} id="contact" className="space-y-6">
              <SectionHeading title="9. Contact Information" />
              <p>
                Vedic Wellness — Division of Innovia Drugs, India remains
                committed to addressing privacy-related questions and ensuring
                transparent communication with customers and franchise
                partners. If you have concerns about data handling practices,
                wish to request clarification regarding this policy, or need
                assistance related to information submitted through the
                platform, you may contact us directly using the details below.
                Our team reviews privacy inquiries carefully and responds in a
                timely manner to maintain accountability and trust.
                <br />
                <br />
                Phone: +91 93060 25799 <br />
                Email: vedicwellnessid@gmail.com
              </p>
            </section>
          </motion.div>
        </div>
      </div>
    </section>
  );
}