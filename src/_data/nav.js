module.exports = [
  {
    label: "Heating",
    url: "/services/",
    children: [
      { label: "Furnace Installation", url: "/services/furnace-installation/" },
      { label: "Furnace Repair",       url: "/services/furnace-repair/" },
    ],
  },
  {
    label: "Cooling",
    url: "/services/",
    children: [
      { label: "AC Installation", url: "/services/ac-installation/" },
      { label: "AC Repair",       url: "/services/ac-repair/" },
      { label: "Ductless AC",     url: "/services/ductless-ac/" },
    ],
  },
  {
    label: "Heat Pumps",
    url: "/services/heat-pump-installation/",
  },
  {
    label: "Other Services",
    url: "/services/",
    children: [
      { label: "Water Heaters",     url: "/services/water-heater/" },
      { label: "Fireplaces",        url: "/services/fireplaces/" },
      { label: "HRV & ERV",         url: "/services/hrv-erv/" },
      { label: "Maintenance Plans", url: "/services/maintenance-plans/" },
    ],
  },
  { label: "Service Areas", url: "/service-areas/" },
  { label: "About",         url: "/about/" },
  { label: "Blog",          url: "/blog/" },
  { label: "Get a Quote",   url: "/quote/", cta: true },
];
