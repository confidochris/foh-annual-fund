import TopBanner from './components/TopBanner';
import LogoBanner from './components/LogoBanner';
import StickyNav from './components/StickyNav';
import ProgressIndicator from './components/ProgressIndicator';
import Hero from './components/Hero';
import Story from './components/Story';
import About from './components/About';
import Problem from './components/Problem';
import Solution from './components/Solution';
import Research from './components/Research';
import DonationForm from './components/DonationForm';
import Closing from './components/Closing';
import FloatingCTA from './components/FloatingCTA';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <TopBanner />
      <LogoBanner />
      <StickyNav />
      <ProgressIndicator />
      <Hero />
      <Story />
      <About />
      <Problem />
      <Solution />
      <Research />
      <DonationForm />
      <Closing />
      <FloatingCTA />
      <ScrollToTop />
    </div>
  );
}

export default App;
