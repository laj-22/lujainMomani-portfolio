import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Skills from '@/components/Skills';
import ProjectOfTheMonth from '@/components/ProjectOfTheMonth';
import Projects from '@/components/Projects';
import Activities from '@/components/Activities';
import Contact from '@/components/Contact';
import { useActiveSection } from '@/hooks/useActiveSection';

const Index = () => {
  const activeSection = useActiveSection();

  return (
    <div className="min-h-screen bg-background">
      <Navigation activeSection={activeSection} />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Hero />
        <About />
        <Skills />
        <ProjectOfTheMonth />
        <Projects />
        <Activities />
        <Contact />
      </main>
      
      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-muted-foreground">
            © 2024 Lujain Almomani. Built with passion for motorsport and cybersecurity.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
