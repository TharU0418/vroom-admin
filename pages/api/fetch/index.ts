// fetch.ts
//import Rentrequests from "../../../models/rentrequests";
//import Hirerequest from "../../../models/hirerequests";

//export async function getOverviewData() {
  //await dbConnect();

  // const totalRequests = await Rentrequests.countDocuments({});
  // const pendingRequests = await Rentrequests.countDocuments({ availability: 'pending' });
  // //const acceptedRequests = await Rentrequests.countDocuments({ availability: 'accept' });
  // const totalHRequests = await Hirerequest.countDocuments({});
  // const pendingHRequests = await Hirerequest.countDocuments({availability: 'pending' });


  // Growth rate is mocked for now – you'd calculate based on date ranges or previous period
//   return {
//     totalRequests: {
//       value: 12,
//       //growthRate: 5.2, // mock
//     },
//     pendingRequests: {
//       value: 1,
//       //growthRate: -3.1, // mock
//     },
//     acceptedRequests: {
//       value: 5,
//       growthRate: 2.7, // mock
//     },
//     pendingHRequests: {
//       value: 1,
//       //growthRate: 2.7, // mock
//     },
//   };
// }


export async function getOverviewData() {
  return {
    totalRequests: {
      value: 1200,
      growthRate: 4.5,
    },
    pendingRequests: {
      value: 300,
      growthRate: -1.2,
    },
    acceptedRequests: {
      value: 800,
      growthRate: 2.3,
    },
    pendingHRequests: {
      value: 100,
      growthRate: -0.5,
    },
  };
}
