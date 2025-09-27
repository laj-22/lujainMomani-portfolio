import { ChevronDown, Linkedin, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroBg from '@/assets/hero-bg.jpg';
import profilePhoto from '@/assets/profile-photo.jpg';

const Hero = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 bg-background/60" />
        <div className="absolute inset-0 bg-gradient-hero" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="animate-fade-in-up">
          {/* Profile Picture */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <img 
                src={`${import.meta.env.BASE_URL || '/'}pictures/profile-photo.jpg`}
                alt="Lujain Almomani - Telecommunications & IoT Engineer"
                className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-primary/30 shadow-card hover:border-primary hover:shadow-primary transition-all duration-300"
                onError={(e) => {
                  const img = e.currentTarget as HTMLImageElement;
                  const base = (import.meta.env.BASE_URL || '/');
                  const names = [
                    'main profile pictire-place on top its my pic',
                    'main-profile-pictire-place-on-top-its-my-pic',
                    'main_profile_pictire-place_on_top_its_my_pic',
                    'profile-photo',
                    'profile',
                    'main-profile',
                    'profile_picture',
                    'main profile picture-place on top its my pic',
                    'main-profile-picture-place-on-top-its-my-pic',
                    'main_profile_picture-place_on_top_its_my_pic'
                  ];
                  const exts = ['.jpeg', '.jpg', '.png', '.webp'];
                  const candidates: string[] = [];
                  names.forEach((n) => exts.forEach((x) => candidates.push(`${base}pictures/${n}${x}`)));
                  const idx = Number(img.getAttribute('data-attempt-idx') || '0');
                  if (idx < candidates.length) {
                    img.setAttribute('data-attempt-idx', String(idx + 1));
                    img.src = candidates[idx];
                    return;
                  }
                  img.src = profilePhoto;
                }}
              />
              <div className="absolute inset-0 rounded-full bg-gradient-primary opacity-0 hover:opacity-20 transition-opacity duration-300"></div>
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6">
            <span className="block text-foreground">Lujain Almomani</span>
            <span className="block text-lg sm:text-2xl md:text-3xl font-light text-muted-foreground mt-2">
              Telecommunications & IoT Engineer
            </span>
          </h1>
          
          <p className="text-base sm:text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            <span className="text-primary font-semibold">Cybersecurity</span> • <span className="text-secondary font-semibold">Network Engineering</span> • Connected Systems
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              size="lg"
              className="btn-hero px-6 py-2 sm:px-8 sm:py-3 text-sm sm:text-lg"
              onClick={() => scrollToSection('projects')}
            >
              <span className="relative z-10">Explore My Work</span>
            </Button>
            
            <Button 
              size="lg"
              variant="outline"
              className="btn-cyber px-6 py-2 sm:px-8 sm:py-3 text-sm sm:text-lg"
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
              className="text-muted-foreground hover:text-accent transition-colors duration-300 p-2"
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
        <ChevronDown size={32} className="text-muted-foreground hover:text-primary transition-colors" />
      </button>
    </section>
  );
};

export default Hero;