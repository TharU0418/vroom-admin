// import { compactFormat } from "@/lib/format-number";
// import { getOverviewData } from "../../fetch";
// import { OverviewCard } from "./card";
// import * as icons from "./icons";

// export async function OverviewCardsGroup() {
//   const { views, profit, products, users } = await getOverviewData();

//   return (
//     <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4 2xl:gap-7.5">
//       <OverviewCard
//         label="Total Views"
//         data={{
//           ...views,
//           value: compactFormat(views.value),
//         }}
//         Icon={icons.Views}
//       />

//       <OverviewCard
//         label="Total Profit"
//         data={{
//           ...profit,
//           value: "$" + compactFormat(profit.value),
//         }}
//         Icon={icons.Profit}
//       />

//       <OverviewCard
//         label="Total Products"
//         data={{
//           ...products,
//           value: compactFormat(products.value),
//         }}
//         Icon={icons.Product}
//       />

//       <OverviewCard
//         label="Total Users"
//         data={{
//           ...users,
//           value: compactFormat(users.value),
//         }}
//         Icon={icons.Users}
//       />
//     </div>
//   );
// }


// index.tsx

import { compactFormat } from "@/lib/format-number";
import { OverviewCard } from "./card";
import * as icons from "./icons";
import { getOverviewData } from "../../../../../pages/api/fetch";

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
        }}
        Icon={icons.Users}
      />

      <OverviewCard
        label="Pending Car Requests"
        data={{
          ...pendingRequests,
          value: compactFormat(pendingRequests.value),
        }}
        Icon={icons.Product}
      />

      <OverviewCard
        label="Total Hire Requests"
        data={{
          ...acceptedRequests,
          value: compactFormat(acceptedRequests.value),
        }}
        Icon={icons.Views}
      />
      <OverviewCard
        label="Pending Hire Requests"
        data={{
          ...pendingHRequests,
          value: compactFormat(pendingHRequests.value),
        }}
        Icon={icons.Views}
      />
      
    </div>
  );
}
