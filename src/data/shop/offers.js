const offers = [
  {
    id: 1,
    title: "50% OFF Pizza",
    category: "Food",
    description:
      "Enjoy delicious pizzas at half the price. Valid on all medium and large pizzas.",
    discount: "50%",
    originalPrice: 599,
    offerPrice: 299,
    validTill: "30 Aug 2026",
    startDate: "01 Aug 2026",
    endDate: "30 Aug 2026",
    status: "Active",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600",
    terms: "Valid only for dine-in. Cannot be combined with any other offer.",
  },
  {
    id: 2,
    title: "Buy 1 Get 1 Burger",
    category: "Food",
    description:
      "Buy any premium burger and get another burger absolutely free.",
    discount: "BOGO",
    originalPrice: 399,
    offerPrice: 199,
    validTill: "10 Sep 2026",
    startDate: "15 Aug 2026",
    endDate: "10 Sep 2026",
    status: "Active",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600",
    terms: "Applicable only on premium burgers. One offer per customer.",
  },
  {
    id: 3,
    title: "30% OFF Hair Spa",
    category: "Salon",
    description:
      "Get a nourishing hair spa treatment with a flat 30% discount.",
    discount: "30%",
    originalPrice: 1200,
    offerPrice: 840,
    validTill: "05 Jul 2026",
    startDate: "01 Jun 2026",
    endDate: "05 Jul 2026",
    status: "Expired",
    image: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=600",
    terms: "Appointment required. Offer valid only on weekdays.",
  },
];

export default offers;
