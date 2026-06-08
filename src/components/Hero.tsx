import { ChevronDown, Linkedin, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroBg from '@/assets/hero-bg.jpg';
import mypicNew from '@/assets/mypicNew.jpeg';

const Hero = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-20">
      {/* Background */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/70 dark:from-black/60 dark:via-black/60 dark:to-black/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="animate-fade-in-up">
          {/* Profile Picture */}
          <div className="mb-16 flex justify-center">
            <div className="relative">
              <img
                src={mypicNew}
                alt="Lujain Almomani - Telecommunications/Computer & IoT Engineer"
                className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full object-cover object-[50%_5%] border-4 border-white/20 shadow-lg hover:border-white/40 hover:shadow-xl transition-all duration-300"
                loading="eager"
                decoding="sync"
              />
              <div className="absolute inset-0 rounded-full bg-white/10 opacity-0 hover:opacity-30 transition-opacity duration-300 backdrop-blur-sm"></div>
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6">
            <span className="block text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)]">Lujain Almomani</span>
            <span className="block text-lg sm:text-2xl md:text-3xl font-light text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)] mt-2">
              Telecommunications/Computer  & IoT Engineer
            </span>
          </h1>

        
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button
              size="lg"
              className="px-6 py-2 sm:px-8 sm:py-3 text-sm sm:text-lg bg-primary text-primary-foreground hover:bg-primary/90 border-2 border-primary"
              onClick={() => scrollToSection('projects')}
            >
              <span className="relative z-10">Explore My Work</span>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="px-6 py-2 sm:px-8 sm:py-3 text-sm sm:text-lg bg-secondary text-secondary-foreground hover:bg-secondary/90 border-2 border-secondary"
              onClick={() => scrollToSection('contact')}
            >
              <span className="relative z-10">Let's Connect</span>
            </Button>
          </div>

          {/* Social Links */}
          <div className="flex justify-center space-x-6 mb-12">
            <a
              href="https://www.linkedin.com/in/lujainn"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/70 hover:text-white transition-colors duration-300 p-2 bg-white/10 rounded-full backdrop-blur-sm"
            >
              <Linkedin size={24} />
            </a>
          </div>
        </div>
      </div>
      {/* Scroll Indicator */}
      <button
        onClick={() => scrollToSection('about')}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce"
      >
        <ChevronDown size={32} className="text-white/70 hover:text-white transition-colors drop-shadow-md" />
      </button>
    </section>
  );
};

export default Hero;