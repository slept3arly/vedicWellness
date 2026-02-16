"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
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
          <SectionHeading
            title="Terms & Conditions"
            subtitle="Legal terms governing the use of Vedic Wellness services."
          />
        </div>

        <div className="mt-10 grid lg:grid-cols-[280px_minmax(0,1fr)] gap-8 items-start mb-24">
          {/* SIDEBAR */}
          <aside className="hidden lg:block sticky top-48 self-start">
            <div className="surface rounded-xl p-5 space-y-3 text-sm">
              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() =>
                    handleScrollTo(s.id as keyof typeof sectionRefs)
                  }
                  className="block w-full text-left text-muted hover:text-[var(--brand-primary)] transition font-medium"
                >
                  {s.label}
                </button>
              ))}
            </div>
          </aside>

          {/* TERMS CONTENT */}
          <motion.div
            ref={contentRef}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="surface rounded-2xl p-6 md:p-10 leading-relaxed overflow-y-auto h-[70vh] space-y-14"
          >
            <p className="text-sm text-muted">Last Updated: 16-Feb-2026</p>

            {/* 1 */}
            <section ref={sectionRefs.general} id="general">
              <h2 className="text-xl font-semibold">1. General Use</h2>
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
            <section ref={sectionRefs.account} id="account">
              <h2 className="text-xl font-semibold">
                2. Account Responsibility
              </h2>
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
            <section ref={sectionRefs.medical} id="medical">
              <h2 className="text-xl font-semibold">3. Medical Disclaimer</h2>
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
                guidelines and avoid making unverified medical claims. Any
                misuse of product information that violates advertising or
                healthcare regulations remains the responsibility of the
                distributor or user.
              </p>
            </section>

            {/* 4 */}
            <section ref={sectionRefs.orders} id="orders">
              <h2 className="text-xl font-semibold">
                4. Orders & Availability
              </h2>
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
                constraints. Shipment timelines are estimates and may vary due
                to external factors such as transportation delays or regional
                restrictions. All business transactions remain subject to
                applicable invoicing terms communicated separately.
              </p>
            </section>

            {/* 5 */}
            <section ref={sectionRefs.liability} id="liability">
              <h2 className="text-xl font-semibold">
                5. Limitation of Liability
              </h2>
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
                Vedic Wellness shall not be held responsible for losses arising
                from third-party logistics delays, distributor actions, or
                external market conditions beyond its direct control.
              </p>
            </section>

            {/* 6 */}
            <section ref={sectionRefs.law} id="law">
              <h2 className="text-xl font-semibold">6. Governing Law</h2>
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
