"use client";

import SectionHeading from "@/components/public/ui/SectionHeading";
import AccountOverviewCard from "@/components/customer/account/AccountOverviewCard";
import AccountDetailsForm from "@/components/customer/account/AccountDetailsForm";
import AddressList from "@/components/customer/account/AddressList";
import type { Address } from "@prisma/client";

type Props = {
  addresses: Address[];
};

export default function AccountClient({ addresses }: Props) {
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

      <AddressList addresses={addresses} />
    </>
  );
}
