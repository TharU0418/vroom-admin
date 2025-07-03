// fetch.ts
//import Rentrequests from "../../../models/rentrequests";
//import Hirerequest from "../../../models/hirerequests";

export async function getOverviewData() {
  //await dbConnect();

  // const totalRequests = await Rentrequests.countDocuments({});
  // const pendingRequests = await Rentrequests.countDocuments({ availability: 'pending' });
  // //const acceptedRequests = await Rentrequests.countDocuments({ availability: 'accept' });
  // const totalHRequests = await Hirerequest.countDocuments({});
  // const pendingHRequests = await Hirerequest.countDocuments({availability: 'pending' });


  // Growth rate is mocked for now – you'd calculate based on date ranges or previous period
  return {
    totalRequests: {
      value: 12,
      //growthRate: 5.2, // mock
    },
    pendingRequests: {
      value: 1,
      //growthRate: -3.1, // mock
    },
    acceptedRequests: {
      value: 5,
      growthRate: 2.7, // mock
    },
    pendingHRequests: {
      value: 1,
      //growthRate: 2.7, // mock
    },
  };
}
