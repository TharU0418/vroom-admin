import { compactFormat } from "@/lib/format-number";
import { OverviewCard } from "./card";
import * as icons from "./icons";
import { getOverviewData } from "../../../../../../pages/api/fetch";

export async function OverviewCardsGroup() {
  const {
    totalRequests,
    pendingRequests,
    acceptedRequests,
    pendingHRequests
  } = await getOverviewData();

  return (
    <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4 2xl:gap-7.5">
      <OverviewCard
  label="Total Car Requests"
  data={{
    ...totalRequests,
    value: compactFormat(totalRequests.value),
    growthRate: totalRequests.growthRate, // ensure growthRate is explicitly passed
  }}
  Icon={icons.Users}
/>

<OverviewCard
  label="Pending Car Requests"
  data={{
    ...pendingRequests,
    value: compactFormat(pendingRequests.value),
    growthRate: pendingRequests.growthRate,
  }}
  Icon={icons.Product}
/>

<OverviewCard
  label="Total Hire Requests"
  data={{
    ...acceptedRequests,
    value: compactFormat(acceptedRequests.value),
    growthRate: acceptedRequests.growthRate,
  }}
  Icon={icons.Views}
/>

<OverviewCard
  label="Pending Hire Requests"
  data={{
    ...pendingHRequests,
    value: compactFormat(pendingHRequests.value),
    growthRate: pendingHRequests.growthRate,
  }}
  Icon={icons.Views}
/>

      
    </div>
  );
}
