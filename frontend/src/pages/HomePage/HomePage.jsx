import HeroSection from "./HeroSection";
import FeaturedEvents from "./FeaturedEvents";
import StepSection from "./StepSection";
import FeedbackSection from "./FeedbackSection";
import CategoriesSection from "./CategoriesSection";

function HomePage() {
    return <main>
        <HeroSection />
        <CategoriesSection />
        {/* <FeaturedEvents /> */}
        <StepSection />
        <FeedbackSection />
    </main>;
}

export default HomePage;