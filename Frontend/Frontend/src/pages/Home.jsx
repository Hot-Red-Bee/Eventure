
import Hero from '../components/Hero';
import About from '../components/About';
import Features from '../components/Features';

const Home = () => (
  <div className="bg-[var(--color-background)]">
    <Hero />
    <About />
    <Features />
  </div>
);

export default Home;