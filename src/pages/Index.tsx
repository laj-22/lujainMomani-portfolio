import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Skills from '@/components/Skills';
import Projects from '@/components/Projects';
import RecentProjects from '@/components/RecentProjects';
import Contact from '@/components/Contact';
import { useActiveSection } from '@/hooks/useActiveSection';

const Index = () => {
  const activeSection = useActiveSection();

  return (
    <div className="min-h-screen bg-background">
      <Navigation activeSection={activeSection} />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <RecentProjects />
        <Contact />
      </main>
      
      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-muted-foreground">
            © 2024 Ali Saeed. Built with passion for motorsport and cybersecurity.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
