import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download, Trophy, Shield, Cpu } from 'lucide-react';

const About = () => {
  const highlights = [
    {
      icon: <Cpu className="h-8 w-8" />,
      title: "Network Engineering",
      description: "Routing, switching, and resilient system architecture"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Cybersecurity",
      description: "ML‑enabled IDS, secure design, and threat‑aware systems"
    },
    {
      icon: <Cpu className="h-8 w-8" />,
      title: "IoT Systems",
      description: "Edge hardware, sensors, and cloud-connected platforms"
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
              I am a Telecommunications & IoT engineering graduate with a strong interest in <strong className="text-primary">cybersecurity</strong> and <strong className="text-secondary">network engineering</strong>. My work bridges hardware and software—building reliable networks, intelligent edge devices, and secure connected systems.
            </p>
            
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Recent projects span autonomous robotics (ROS), IoT telemetry platforms, ML‑driven intrusion detection, signal processing, and enterprise networking. For a detailed view of my professional experience and roles, please refer to my CV.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="btn-hero">
                <Download className="h-5 w-5 mr-2" />
                <span className="relative z-10">Download CV</span>
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