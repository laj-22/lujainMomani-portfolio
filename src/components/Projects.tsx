import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ExternalLink, 
  Github, 
  ChevronRight,
  Cpu, 
  Shield, 
  Wifi, 
  Gauge, 
  Bot,
  Wrench
} from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  category: string;
  tags: string[];
  image: string;
  github?: string;
  demo?: string;
  featured: boolean;
}

const Projects = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const categories = [
    { id: 'all', label: 'All Projects', icon: <Cpu className="h-4 w-4" /> },
    { id: 'embedded', label: 'Embedded Systems', icon: <Cpu className="h-4 w-4" /> },
    { id: 'motorsport', label: 'Motorsport Tech', icon: <Gauge className="h-4 w-4" /> },
    { id: 'iot', label: 'IoT & Wireless', icon: <Wifi className="h-4 w-4" /> },
    { id: 'security', label: 'Cybersecurity', icon: <Shield className="h-4 w-4" /> },
    { id: 'robotics', label: 'Robotics', icon: <Bot className="h-4 w-4" /> },
    { id: 'tools', label: 'Tools & Utilities', icon: <Wrench className="h-4 w-4" /> }
  ];

  const projects: Project[] = [
    {
      id: '1',
      title: 'IoT Vehicle Telemetry System',
      description: 'Real-time racing data collection and visualization platform with wireless transmission.',
      longDescription: 'A comprehensive telemetry system designed for motorsport applications. Features real-time data acquisition from multiple sensors, wireless transmission to pit crew, and advanced analytics dashboard. Includes temperature, pressure, acceleration, and GPS tracking with sub-second latency.',
      category: 'motorsport',
      tags: ['Arduino', 'LoRa', 'Real-time', 'Dashboard'],
      image: '/api/placeholder/400/250',
      github: 'https://github.com',
      demo: 'https://demo.com',
      featured: true
    },
    {
      id: '2',
      title: 'CAN Bus Security Scanner',
      description: 'Portable penetration testing tool for automotive network vulnerability assessment.',
      longDescription: 'A specialized security tool for testing CAN bus networks in modern vehicles. Capable of message injection, replay attacks, and protocol fuzzing. Built with custom hardware and Python-based analysis software.',
      category: 'security',
      tags: ['CAN Bus', 'Python', 'Security', 'Hardware'],
      image: '/api/placeholder/400/250',
      github: 'https://github.com',
      featured: true
    },
    {
      id: '3',
      title: 'Autonomous Track Robot',
      description: 'High-speed line-following robot optimized for competitive lap times.',
      longDescription: 'An autonomous robot designed for track racing competitions. Features advanced computer vision, PID control systems, and optimized mechanical design. Achieved top-3 finishes in multiple competitions.',
      category: 'robotics',
      tags: ['Computer Vision', 'PID Control', 'Racing', 'Sensors'],
      image: '/api/placeholder/400/250',
      github: 'https://github.com',
      demo: 'https://youtube.com',
      featured: true
    },
    {
      id: '4',
      title: 'Smart Pit Stop Assistant',
      description: 'Automated tool inventory and status monitoring system for racing teams.',
      longDescription: 'An intelligent system that tracks tool usage, monitors equipment status, and optimizes pit stop workflows. Reduces pit stop times by 15% through predictive maintenance and automated inventory management.',
      category: 'motorsport',
      tags: ['IoT', 'RFID', 'Automation', 'Analytics'],
      image: '/api/placeholder/400/250',
      github: 'https://github.com',
      featured: false
    },
    {
      id: '5',
      title: 'Wireless Sensor Network',
      description: 'Multi-node environmental monitoring system with mesh networking.',
      longDescription: 'A scalable wireless sensor network for environmental monitoring. Features self-healing mesh topology, low-power operation, and cloud integration. Deployed in smart agriculture and industrial monitoring applications.',
      category: 'iot',
      tags: ['Mesh Network', 'LoRa', 'Cloud', 'Sensors'],
      image: '/api/placeholder/400/250',
      github: 'https://github.com',
      featured: false
    },
    {
      id: '6',
      title: 'Embedded Firewall System',
      description: 'Custom firewall solution for IoT devices with real-time threat detection.',
      longDescription: 'A lightweight firewall system designed for resource-constrained IoT devices. Implements machine learning-based anomaly detection and provides real-time threat mitigation without significant performance impact.',
      category: 'security',
      tags: ['Firewall', 'ML', 'IoT', 'Embedded'],
      image: '/api/placeholder/400/250',
      github: 'https://github.com',
      featured: false
    }
  ];

  const filteredProjects = activeCategory === 'all' 
    ? projects 
    : projects.filter(project => project.category === activeCategory);

  const featuredProjects = projects.filter(project => project.featured);

  return (
    <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="section-header mb-6">Featured Projects</h2>
          <div className="w-24 h-1 bg-gradient-primary mx-auto mb-8"></div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Innovative solutions spanning motorsport technology, cybersecurity, and embedded systems
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "default" : "outline"}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center space-x-2 ${
                activeCategory === category.id 
                  ? 'btn-hero' 
                  : 'hover:border-primary hover:text-primary'
              }`}
            >
              {category.icon}
              <span className="relative z-10">{category.label}</span>
            </Button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <Card 
              key={project.id} 
              className="project-card overflow-hidden"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => setSelectedProject(project)}
            >
              <div className="aspect-video bg-muted bg-cover bg-center relative">
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                {project.featured && (
                  <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
                    Featured
                  </Badge>
                )}
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                
                <p className="text-muted-foreground mb-4 line-clamp-3">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    {project.github && (
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <Github className="h-4 w-4" />
                      </Button>
                    )}
                    {project.demo && (
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  <Button 
                    size="sm" 
                    variant="ghost"
                    className="text-primary hover:text-primary-glow"
                  >
                    View Details
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Project Detail Modal */}
        {selectedProject && (
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
            <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-3xl font-bold text-foreground mb-2">
                      {selectedProject.title}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    onClick={() => setSelectedProject(null)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    ×
                  </Button>
                </div>
                
                <div className="aspect-video bg-muted rounded-lg mb-6" />
                
                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                  {selectedProject.longDescription}
                </p>
                
                <div className="flex space-x-4">
                  {selectedProject.github && (
                    <Button className="btn-hero">
                      <Github className="h-5 w-5 mr-2" />
                      <span className="relative z-10">View Code</span>
                    </Button>
                  )}
                  {selectedProject.demo && (
                    <Button variant="outline" className="btn-cyber">
                      <ExternalLink className="h-5 w-5 mr-2" />
                      <span className="relative z-10">Live Demo</span>
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;