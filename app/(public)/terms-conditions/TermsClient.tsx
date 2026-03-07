"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import PageHeader from "@/components/public/ui/PageHeader";
import SectionHeading from "@/components/public/ui/SectionHeading";
import { fadeUp } from "app/animations";

const sections = [
  { id: "general", label: "General Use" },
  { id: "account", label: "Account Responsibility" },
  { id: "medical", label: "Medical Disclaimer" },
  { id: "orders", label: "Orders & Availability" },
  { id: "liability", label: "Limitation of Liability" },
  { id: "law", label: "Governing Law" },
];

export default function TermsClient() {
  const contentRef = useRef<HTMLDivElement>(null);

  const sectionRefs = {
    general: useRef<HTMLElement>(null),
    account: useRef<HTMLElement>(null),
    medical: useRef<HTMLElement>(null),
    orders: useRef<HTMLElement>(null),
    liability: useRef<HTMLElement>(null),
    law: useRef<HTMLElement>(null),
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
            title="Terms & Conditions"
            subtitle="Legal terms governing the use of Vedic Wellness services."
          />
        </div>

        <div className="mt-10 grid lg:grid-cols-[280px_minmax(0,1fr)] gap-8 items-start mb-24">
          {/* SIDEBAR WITH SLIDING UNDERLINE */}
          <aside className="hidden lg:block sticky top-48 self-start">
            <div className="surface rounded-xl p-6 space-y-4 text-sm">
              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() =>
                    handleScrollTo(s.id as keyof typeof sectionRefs)
                  }
                  className="
                    group relative block w-fit text-left 
                    text-neutral-500 dark:text-neutral-400
                    hover:text-neutral-900 dark:hover:text-white 
                    transition-colors duration-300 font-medium pb-1
                  "
                >
                  {s.label}
                  {/* Sliding Underline Span */}
                  <span 
                    className="
                      absolute left-0 bottom-0 h-[1.5px] w-0 
                      bg-neutral-900 dark:bg-white 
                      transition-all duration-300 group-hover:w-full
                    " 
                  />
                </button>
              ))}
            </div>
          </aside>

          {/* TERMS CONTENT - INCREASED HEIGHT */}
          <motion.div
            ref={contentRef}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="
              surface 
              rounded-2xl 
              p-6 md:p-12 
              leading-relaxed 
              overflow-y-auto 
              h-[85vh] 
              min-h-[700px]
              scroll-smooth 
              space-y-20
            "
          >
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Last Updated: 16-Feb-2026
            </p>

            {/* 1 */}
            <section ref={sectionRefs.general} id="general" className="space-y-6">
              <SectionHeading title="1. General Use" />
              <p>
                These Terms & Conditions govern access to and use of the Vedic
                Wellness website, products, and franchise-related services.
                Vedic Wellness operates as a PCD Ayurvedic wellness and pharma
                distribution company providing product information, franchise
                opportunities, and business communication tools. By accessing
                this platform, users agree to use the services only for lawful
                business purposes and in a manner consistent with applicable
                pharmaceutical marketing and trade regulations in India.
                Content available on the website, including product
                descriptions, catalogues, images, branding material, and
                educational resources, is intended for informational and
                commercial reference only and may not be reproduced,
                redistributed, or modified without prior authorization. Vedic
                Wellness reserves the right to update or modify website
                functionality, product availability, and informational content
                without prior notice to maintain operational accuracy and
                compliance with evolving regulatory standards.
              </p>
            </section>

            {/* 2 */}
            <section ref={sectionRefs.account} id="account" className="space-y-6">
              <SectionHeading title="2. Account Responsibility" />
              <p>
                Users who create accounts or engage in franchise communication
                through this platform are responsible for maintaining the
                confidentiality of their login credentials and ensuring that
                all information provided remains accurate and up to date.
                Accounts are intended strictly for legitimate distributors,
                franchise partners, or customers engaging in genuine business
                activity. Any misuse of accounts, including unauthorized
                access, misleading representation, or attempts to disrupt
                platform operations, may result in suspension or termination
                without prior notice. Franchise applicants and distributors
                acknowledge that access to product catalogues, pricing
                information, or business materials does not constitute a
                legally binding franchise agreement unless confirmed through
                separate written authorization issued by Vedic Wellness.
              </p>
            </section>

            {/* 3 */}
            <section ref={sectionRefs.medical} id="medical" className="space-y-6">
              <SectionHeading title="3. Medical Disclaimer" />
              <p>
                Products listed on this website are Ayurvedic wellness
                formulations intended to support general health practices.
                Information presented regarding ingredients, usage, or benefits
                is provided for educational and promotional purposes only and
                should not be interpreted as medical diagnosis, prescription,
                or treatment advice. Vedic Wellness does not guarantee specific
                therapeutic outcomes, and individuals are encouraged to consult
                qualified healthcare professionals before making health-related
                decisions. Franchise partners and distributors must ensure that
                product promotion, marketing communication, and local
                distribution activities comply with applicable regulatory
                guidelines and avoid making unverified medical claims.
              </p>
            </section>

            {/* 4 */}
            <section ref={sectionRefs.orders} id="orders" className="space-y-6">
              <SectionHeading title="4. Orders & Availability" />
              <p>
                Product listings, pricing structures, and franchise materials
                displayed on the platform are subject to change based on market
                conditions, regulatory updates, and inventory availability.
                Orders placed through the platform may undergo verification and
                confirmation prior to processing. Vedic Wellness reserves the
                right to modify quantities, adjust dispatch timelines, or
                decline orders where necessary to maintain operational
                integrity or regulatory compliance. Order placement does not
                guarantee automatic acceptance, and fulfillment may depend on
                distributor eligibility, regional considerations, or logistical
                constraints.
              </p>
            </section>

            {/* 5 */}
            <section ref={sectionRefs.liability} id="liability" className="space-y-6">
              <SectionHeading title="5. Limitation of Liability" />
              <p>
                To the fullest extent permitted by law, Vedic Wellness shall not
                be liable for indirect, incidental, or consequential losses
                arising from the use of this website, franchise communication,
                or reliance on informational content. While reasonable efforts
                are made to maintain accurate product and business information,
                the platform is provided on an “as available” basis without
                warranties of uninterrupted availability or error-free
                performance. Users and franchise partners assume responsibility
                for evaluating business decisions, regional marketing
                activities, and compliance with applicable trade regulations.
              </p>
            </section>

            {/* 6 */}
            <section ref={sectionRefs.law} id="law" className="space-y-6 pb-20">
              <SectionHeading title="6. Governing Law" />
              <p>
                These Terms & Conditions shall be governed by and interpreted in
                accordance with the laws of India. Any disputes arising from the
                use of the website, franchise discussions, or commercial
                interactions shall be subject to the jurisdiction of competent
                courts located in India. By continuing to access this platform,
                users acknowledge that business relationships, franchise
                negotiations, and product distribution activities remain
                subject to applicable national regulations and internal company
                policies communicated through official channels.
              </p>
            </section>
          </motion.div>
        </div>
      </div>
    </section>
  );
}