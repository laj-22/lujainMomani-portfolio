import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Github, ExternalLink, Calendar, Award } from 'lucide-react';
import projectTelemetry from '@/assets/project-telemetry.jpg';

const ProjectOfTheMonth = () => {
  const [showDetails, setShowDetails] = useState(false);
  
  const featuredProject = {
    id: 'featured-1',
    title: 'IoT Vehicle Telemetry System',
    description: 'Advanced real-time racing data collection and visualization platform with wireless transmission capabilities.',
    longDescription: 'A comprehensive telemetry system designed specifically for motorsport applications. This system features real-time data acquisition from multiple sensors including temperature, pressure, acceleration, and GPS tracking with sub-second latency. The wireless transmission system uses LoRa technology for reliable pit-to-car communication even at high speeds. The dashboard provides advanced analytics including lap time optimization, tire degradation analysis, and predictive maintenance alerts.',
    image: projectTelemetry,
    tags: ['Arduino', 'LoRa', 'Real-time', 'Dashboard', 'Motorsport'],
    github: 'https://github.com',
    demo: 'https://demo.com',
    achievements: [
      'Reduced lap time analysis from hours to minutes',
      'Implemented in 3 racing teams',
      '99.9% data transmission reliability',
      'Featured in Motorsport Engineering Magazine'
    ],
    tech: [
      { name: 'Arduino Nano 33 IoT', role: 'Main Controller' },
      { name: 'LoRa RFM95W', role: 'Wireless Communication' },
      { name: 'React Dashboard', role: 'Data Visualization' },
      { name: 'Python Backend', role: 'Data Processing' }
    ]
  };

  return (
    <section id="featured" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Award className="h-8 w-8 text-primary" />
            <h2 className="section-header">Project of the Month</h2>
            <Star className="h-8 w-8 text-secondary fill-secondary" />
          </div>
          <div className="w-24 h-1 bg-gradient-primary mx-auto mb-8"></div>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            Showcasing the most innovative and impactful project from my portfolio
          </p>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="overflow-hidden border-2 border-primary/20 hover:border-primary/40 transition-all duration-500 bg-gradient-card">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* Project Image */}
              <div className="relative aspect-[4/3] lg:aspect-auto w-full">
                <img 
                  src={featuredProject.image} 
                  alt={featuredProject.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-background/60 to-transparent lg:hidden" />
                <div className="absolute top-6 left-6">
                  <Badge className="bg-primary text-primary-foreground font-semibold text-sm px-3 py-1">
                    <Calendar className="h-4 w-4 mr-2" />
                    August 2024
                  </Badge>
                </div>
              </div>

              {/* Project Content */}
              <div className="p-4 sm:p-8 lg:p-12 flex flex-col justify-center">
                <div className="mb-6">
                  <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
                    {featuredProject.title}
                  </h3>
                  <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                    {featuredProject.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {featuredProject.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-sm">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 mb-6">
                  <Button className="btn-hero flex-1 sm:flex-none">
                    <Github className="h-5 w-5 mr-2" />
                    <span className="relative z-10">View Code</span>
                  </Button>
                  <Button variant="outline" className="btn-cyber flex-1 sm:flex-none">
                    <ExternalLink className="h-5 w-5 mr-2" />
                    <span className="relative z-10">Live Demo</span>
                  </Button>
                </div>

                <Button 
                  variant="ghost" 
                  onClick={() => setShowDetails(!showDetails)}
                  className="text-primary hover:text-primary-glow self-start"
                >
                  {showDetails ? 'Hide Details' : 'Show Technical Details'}
                </Button>
              </div>
            </div>

            {/* Expandable Details */}
            {showDetails && (
              <div className="border-t border-border bg-muted/10 p-8 lg:p-12 animate-fade-in">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-xl font-semibold text-foreground mb-4">Technical Overview</h4>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      {featuredProject.longDescription}
                    </p>
                    
                    <h5 className="text-lg font-semibold text-foreground mb-3">Key Achievements</h5>
                    <ul className="space-y-2">
                      {featuredProject.achievements.map((achievement, index) => (
                        <li key={index} className="flex items-start gap-2 text-muted-foreground">
                          <Star className="h-4 w-4 text-secondary mt-1 flex-shrink-0" />
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h5 className="text-lg font-semibold text-foreground mb-3">Technology Stack</h5>
                    <div className="space-y-3">
                      {featuredProject.tech.map((tech, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-card rounded-lg border border-border">
                          <span className="font-medium text-foreground">{tech.name}</span>
                          <span className="text-sm text-muted-foreground">{tech.role}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ProjectOfTheMonth;