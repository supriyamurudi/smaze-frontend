import Hero from "../components/Hero";
import Categories from "../components/Categories";
import HomeOffers from "../components/HomeOffers";
import FeaturedShops from "../components/FeaturedShops";
import WhyChooseUs from "../components/WhyChooseUs";
import HowItWorks from "../components/HowItWorks";
import Testimonials from "../components/Testimonials";
import BusinessCTA from "../components/BusinessCTA";

const Home = () => {
  return (
    <>
      <Hero />
      <Categories />
      <HomeOffers />
      <FeaturedShops />
      <WhyChooseUs />
      <HowItWorks />
      <Testimonials />
      <BusinessCTA />
    </>
  );
};

export default Home;
