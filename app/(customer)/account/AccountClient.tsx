"use client";

import SectionHeading from "@/components/public/ui/SectionHeading";
import AccountOverviewCard from "@/components/customer/account/AccountOverviewCard";
import AccountDetailsForm from "@/components/customer/account/AccountDetailsForm";
import AddressList from "@/components/customer/account/AddressList";

export default function AccountClient() {
  return (
    <>
      <SectionHeading
        align="left"
        title="My Account"
        subtitle="Manage your personal information"
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <AccountOverviewCard />
        <AccountDetailsForm />
      </div>

      <AddressList />
    </>
  );
}
