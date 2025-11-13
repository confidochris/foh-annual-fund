import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
import AdminDonations from './components/AdminDonations';

function HomePage() {
  return (
    <>
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
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin/donations" element={<AdminDonations />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
