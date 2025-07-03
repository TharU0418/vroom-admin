import * as Icons from "../icons";

export const NAV_DATA = [
  {
    label: "MAIN MENU",
    items: [
      {
        title: "Dashboard",
        icon: Icons.HomeIcon,
        items: [
          {
            title: "Charts",
            url: "/",
          },
        ],
      },
      {
        title: "Calendar",
        url: "/calendar",
        icon: Icons.Calendar,
        items: [],
      },
      {
        title: "Rent",
        icon: Icons.Alphabet,
        items: [
          {
            title: "Add Cars",
            url: "/rent/add-cars",
          },
          {
            title: "View Cars",
            url: "/rent/view-cars",
          },
          {
            title: "View Requests",
            url: "/rent/requests",
          },
          {
            title: "Accpet Requests",
            url: "/rent/accept-cars",
          },
          {
            title: "Completed Rents Requests",
            url: "/rent/completed-rents",
          },
          
          
        ],
      },
      {
        title: "Hire",
        icon: Icons.Alphabet,
        items: [
          {
            title: "Add Drivers",
            url: "/hire/add-drivers",
          },
          {
            title: "View Drivers",
            url: "/hire/view-drivers",
          },
          {
            title: "View Requests",
            url: "/hire/requests",
          },
          {
            title: "Accept Driver Requests",
            url: "/hire/accept-driver",
          },
          {
            title: "Completed Hire Requests",
            url: "/hire/completed-hirs",
          }


          
        ],
      },
       {
        title: "Buy",
        icon: Icons.Alphabet,
        items: [
          {
            title: "View Sell",
            url: "/sell/view-sell-cars",
          },
          {
            title: "View Sell Requests",
            url: "/sell/sell-requests",
          }

          
        ],
      },
      {
        title: "Consultations",
        icon: Icons.Alphabet,
        items: [
          {
            title: "View Consultation Requests",
            url: "/consultations/view-consultations-requests",
          },
          {
            title: "View Sell Requests",
            url: "/sell/sell-requests",
          }

          
        ],
      },
      {
        title: "Auto Parts",
        icon: Icons.Alphabet,
        items: [
          {
            title: "Add Parts",
            url: "/auto-parts/Add-Parts",
          },
          {
            title: "View Parts",
            url: "/auto-parts/View-Parts",
          }

          
        ],
      },
      {
        title: "Profile",
        url: "/profile",
        icon: Icons.User,
        items: [],
      },
   
      {
        title: "Tables",
        url: "/tables",
        icon: Icons.Table,
        items: [
          {
            title: "Tables",
            url: "/tables",
          },
        ],
      },
      {
        title: "Pages",
        icon: Icons.Alphabet,
        items: [
          {
            title: "Settings",
            url: "/pages/settings",
          },
        ],
      },
    ],
  },
  {
    label: "OTHERS",
    items: [
      {
        title: "Charts",
        icon: Icons.PieChart,
        items: [
          {
            title: "Basic Chart",
            url: "/charts/basic-chart",
          },
        ],
      },
      {
        title: "UI Elements",
        icon: Icons.FourCircle,
        items: [
          {
            title: "Alerts",
            url: "/ui-elements/alerts",
          },
          {
            title: "Buttons",
            url: "/ui-elements/buttons",
          },
        ],
      },
      {
        title: "Authentication",
        icon: Icons.Authentication,
        items: [
          {
            title: "Sign In",
            url: "/auth/sign-in",
          },
        ],
      },
    ],
  },
];
