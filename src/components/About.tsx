import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download, Trophy, Shield, Cpu } from 'lucide-react';

const highlights = [
  {
    icon: <Cpu className="h-8 w-8" />,
    title: "Network Engineering",
    description: "Routing, switching, and resilient system architecture"
  },
  {
    icon: <Shield className="h-8 w-8" />,
    title: "Cybersecurity",
    description: "ML-enabled IDS, secure design, and threat-aware systems"
  },
  {
    icon: <Wifi className="h-8 w-8" />,
    title: "IoT & Embedded Systems",
    description: "Edge hardware, sensors, microcontrollers, and cloud-connected platforms"
  },
  {
    icon: <Code className="h-8 w-8" />,
    title: "Software & Research",
    description: "Python, data analysis, ML applications, and published academic work"
  }
];

  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="section-header mb-6">About Me</h2>
          <div className="w-24 h-1 bg-gradient-primary mx-auto mb-8"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="animate-fade-in-up">
           <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-6 sm:mb-8">
  I am a Telecommunications/Computer & IoT Engineering graduate with a strong foundation across <strong className="text-primary">cybersecurity</strong>, <strong className="text-secondary">network engineering</strong>, embedded systems, and connected infrastructure. I actively apply my knowledge through continuous learning, research publication, and hands-on project development — bridging theoretical concepts with practical, real-world implementations.
</p>
<p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-6 sm:mb-8">
  Whether it's securing networks, building IoT solutions, analyzing systems, or exploring machine learning applications for intrusion detection — I bring an engineering mindset to wherever the problem is. I combine academic research with practical engineering to develop robust solutions that address current industry challenges across connected systems, threat mitigation, and beyond.
</p>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-6 sm:mb-8">
              On mobile, tap sections to expand; on desktop, everything is visible. For a complete overview of experience and projects, download my CV.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a href={`${import.meta.env.BASE_URL || '/'}LujainCV.pdf`} download="LujainCV.pdf">
              <Button size="lg" className="btn-hero">
                <Download className="h-5 w-5 mr-2" />
                <span className="relative z-10">Download CV</span>
              </Button>
              </a>
            </div>
          </div>

          {/* Highlights Cards */}
          <div className="grid gap-4 sm:gap-6 animate-slide-in-right">
            {highlights.map((highlight, index) => (
              <Card 
                key={index} 
                className="project-card p-6 border-l-4 border-l-primary"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="flex items-center space-x-4">
                  <div className="text-primary">
                    {highlight.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {highlight.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {highlight.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;