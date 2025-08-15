import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download, Trophy, Shield, Cpu } from 'lucide-react';

const About = () => {
  const highlights = [
    {
      icon: <Cpu className="h-8 w-8" />,
      title: "Engineering Excellence",
      description: "Hardware & software integration specialist"
    },
    {
      icon: <Trophy className="h-8 w-8" />,
      title: "Motorsport Technology",
      description: "Performance-driven automotive solutions"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Cybersecurity Focus",
      description: "Security-first embedded systems design"
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
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              I am an engineering graduate with a passion for <strong className="text-primary">motorsport technology</strong> and <strong className="text-secondary">cybersecurity</strong>. My work bridges the gap between hardware and software, focusing on innovative solutions for automotive systems, connected devices, and secure embedded platforms.
            </p>
            
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              From designing IoT-enabled prototypes to exploring vulnerabilities in vehicle networks, I thrive at the intersection of performance and protection. Every project is an opportunity to push the boundaries of what's possible in engineering.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="btn-hero">
                <Download className="h-5 w-5 mr-2" />
                <span className="relative z-10">Download CV</span>
              </Button>
              
              <Button size="lg" variant="outline" className="btn-cyber">
                <span className="relative z-10">View Portfolio</span>
              </Button>
            </div>
          </div>

          {/* Highlights Cards */}
          <div className="grid gap-6 animate-slide-in-right">
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