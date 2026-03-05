"use client";

import SectionHeading from "@/components/public/ui/SectionHeading";
import AccountOverviewCard from "@/components/customer/account/AccountOverviewCard";
import AddressList from "@/components/customer/account/AddressList";
import type { Address } from "@prisma/client";

type Props = {
  user: {
    email: string;
  };
  orderCount: number;
  addresses: Address[];
};

export default function AccountClient({
  user,
  orderCount,
  addresses,
}: Props) {
  return (
    <>
      <SectionHeading
        align="left"
        title="My Account"
        subtitle="Manage your personal information"
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <AccountOverviewCard
          email={user.email}
          orderCount={orderCount}
          addressCount={addresses.length}
        />
      </div>

      <AddressList addresses={addresses} />
    </>
  );
}
