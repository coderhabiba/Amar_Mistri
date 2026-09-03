import SearchAndCategory from './../../components/Home/SearchAndCategory/SearchAndCategory';
import WhyChooseUs from './../../components/Home/WhyUs/WhyChooseUs';
import HowItWorks from './../../components/Home/HowItWorks/HowItWorks';
import Testimonials from './../../components/Home/Testimonials/Testimonials';
import SafetyAndGallery from './../../components/Home/SafetyAndGallery/SafetyAndGallery';
import EarnCTA from './../../components/Home/EarnCTA/EarnCTA';
import AchievementCounter from './../../components/Home/AchivmentCounter/AchivmentCounter';
import AppPromotion from './../../components/Home/AppPromotion/AppPromotion';
import Banner from '../../components/Home/Banner/Banner';



const Home = () => {
  return (
    <div>
      <Banner />
      <SearchAndCategory />
      <WhyChooseUs />
      <HowItWorks />
      {/* <TrendingServices /> */}
      <Testimonials />
      <SafetyAndGallery />
      <EarnCTA />
      <AchievementCounter />
      <AppPromotion />
      
    </div>
  );
};

export default Home;