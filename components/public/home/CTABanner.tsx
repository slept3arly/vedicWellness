"use client";

import { useRouter } from "next/navigation";
import { Phone, MessageCircle, FileText, Info } from "lucide-react";

import Card from "@/components/public/ui/Card";
import Button from "@/components/public/ui/Button";
import SectionHeading from "@/components/public/ui/SectionHeading";

export default function FranchiseCTA() {
  const router = useRouter();

  const handleWhatsApp = () =>
    window.open("https://wa.me/+919306025799", "_blank");

  const handleCall = () =>
    (window.location.href = "tel:+919306025799");

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 md:pb-20">
      <div>
        <div>
          <Card className="bg-white/80 dark:bg-black/50">
            <div className="flex flex-col items-center space-y-10 py-4">
              <div className="w-full">
                <SectionHeading
                  title="Franchise Opportunities in Your Area"
                  subtitle="Verified details, clear support, fast response."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                <Button 
                  className="w-full uppercase tracking-wider font-semibold" 
                  onClick={() => router.push("/contact")}
                >
                  <FileText size={18} className="mr-2" />
                  Enquiry Form
                </Button>
                <Button 
                  variant="secondary" 
                  className="w-full uppercase tracking-wider font-semibold" 
                  onClick={handleWhatsApp}
                >
                  <MessageCircle size={18} className="mr-2" />
                  WhatsApp
                </Button>
                <Button 
                  variant="secondary" 
                  className="w-full uppercase tracking-wider font-semibold" 
                  onClick={handleCall}
                >
                  <Phone size={18} className="mr-2" />
                  Call Us
                </Button>
                <Button
                  variant="secondary"
                  className="w-full uppercase tracking-wider font-semibold"
                  onClick={() => router.push("/about")}
                >
                  <Info size={18} className="mr-2" />
                  About Us
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}