import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Star,
  ExternalLink,
  Github,
  ChevronRight,
  Cpu, 
  Shield, 
  Wifi, 
  Gauge, 
  Bot,
  Wrench,
  X,
  Calendar,
  Users,
  Target
} from 'lucide-react';
import projectTelemetry from '@/assets/project-telemetry.jpg';
import projectSecurity from '@/assets/project-security.jpg';
import projectRobot from '@/assets/project-robot.jpg';
import projectPitStop from '@/assets/project-pitstop.jpg';
import projectWireless from '@/assets/project-wireless.jpg';
import projectFirewall from '@/assets/project-firewall.jpg';

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
  timeline: string;
  team: string;
  impact: string[];
  gallery: string[];
}

const Projects = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const categories = [
    { id: 'all', label: 'All Projects', icon: <Cpu className="h-4 w-4" /> },
    { id: 'featured', label: 'Featured', icon: <Star className="h-4 w-4" /> },
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
      longDescription: 'A comprehensive telemetry system designed for motorsport applications. Features real-time data acquisition from multiple sensors, wireless transmission to pit crew, and advanced analytics dashboard. Includes temperature, pressure, acceleration, and GPS tracking with sub-second latency. The system has been successfully deployed in competitive racing environments and has proven to reduce lap analysis time by 80%.',
      category: 'motorsport',
      tags: ['Arduino', 'LoRa', 'Real-time', 'Dashboard'],
      image: projectTelemetry,
      github: 'https://github.com',
      demo: 'https://demo.com',
      featured: true,
      timeline: '6 months',
      team: 'Solo Project',
      impact: ['Reduced analysis time by 80%', 'Deployed in 3 racing teams', '99.9% uptime achieved'],
      gallery: [projectTelemetry, projectTelemetry, projectTelemetry]
    },
    {
      id: '2',
      title: 'CAN Bus Security Scanner',
      description: 'Portable penetration testing tool for automotive network vulnerability assessment.',
      longDescription: 'A specialized security tool for testing CAN bus networks in modern vehicles. Capable of message injection, replay attacks, and protocol fuzzing. Built with custom hardware and Python-based analysis software. The tool has identified critical vulnerabilities in multiple vehicle models and has been recognized by automotive security researchers.',
      category: 'security',
      tags: ['CAN Bus', 'Python', 'Security', 'Hardware'],
      image: projectSecurity,
      github: 'https://github.com',
      featured: true,
      timeline: '4 months',
      team: '2 members',
      impact: ['Identified 15 vulnerabilities', 'Presented at DefCon', 'Adopted by security firms'],
      gallery: [projectSecurity, projectSecurity, projectSecurity]
    },
    {
      id: '3',
      title: 'Autonomous Track Robot',
      description: 'High-speed line-following robot optimized for competitive lap times.',
      longDescription: 'An autonomous robot designed for track racing competitions. Features advanced computer vision, PID control systems, and optimized mechanical design. Achieved top-3 finishes in multiple competitions. The robot uses custom-designed algorithms for path optimization and real-time obstacle detection.',
      category: 'robotics',
      tags: ['Computer Vision', 'PID Control', 'Racing', 'Sensors'],
      image: projectRobot,
      github: 'https://github.com',
      demo: 'https://youtube.com',
      featured: true,
      timeline: '8 months',
      team: '3 members',
      impact: ['Top 3 in 5 competitions', 'Best lap time: 12.3s', '95% consistency rate'],
      gallery: [projectRobot, projectRobot, projectRobot]
    },
    {
      id: '4',
      title: 'Smart Pit Stop Assistant',
      description: 'Automated tool inventory and status monitoring system for racing teams.',
      longDescription: 'An intelligent system that tracks tool usage, monitors equipment status, and optimizes pit stop workflows. Reduces pit stop times by 15% through predictive maintenance and automated inventory management. Features real-time RFID tracking and predictive analytics.',
      category: 'motorsport',
      tags: ['IoT', 'RFID', 'Automation', 'Analytics'],
      image: projectPitStop,
      github: 'https://github.com',
      featured: false,
      timeline: '3 months',
      team: 'Solo Project',
      impact: ['15% faster pit stops', 'Zero tool losses', '40% inventory efficiency'],
      gallery: [projectPitStop, projectPitStop, projectPitStop]
    },
    {
      id: '5',
      title: 'Wireless Sensor Network',
      description: 'Multi-node environmental monitoring system with mesh networking.',
      longDescription: 'A scalable wireless sensor network for environmental monitoring. Features self-healing mesh topology, low-power operation, and cloud integration. Deployed in smart agriculture and industrial monitoring applications with 99% uptime and battery life exceeding 2 years.',
      category: 'iot',
      tags: ['Mesh Network', 'LoRa', 'Cloud', 'Sensors'],
      image: projectWireless,
      github: 'https://github.com',
      featured: false,
      timeline: '5 months',
      team: '4 members',
      impact: ['50 nodes deployed', '2+ year battery life', '99% network uptime'],
      gallery: [projectWireless, projectWireless, projectWireless]
    },
    {
      id: '6',
      title: 'Embedded Firewall System',
      description: 'Custom firewall solution for IoT devices with real-time threat detection.',
      longDescription: 'A lightweight firewall system designed for resource-constrained IoT devices. Implements machine learning-based anomaly detection and provides real-time threat mitigation without significant performance impact. Successfully blocks 99.7% of threats with minimal resource usage.',
      category: 'security',
      tags: ['Firewall', 'ML', 'IoT', 'Embedded'],
      image: projectFirewall,
      github: 'https://github.com',
      featured: false,
      timeline: '6 months',
      team: '2 members',
      impact: ['99.7% threat detection', '<5% CPU usage', '1000+ devices protected'],
      gallery: [projectFirewall, projectFirewall, projectFirewall]
    }
  ];

  const filteredProjects = 
    activeCategory === 'all' 
      ? projects 
      : activeCategory === 'featured'
        ? projects.filter(project => project.featured)
        : projects.filter(project => project.category === activeCategory);

  const featuredProjects = projects.filter(project => project.featured);

  return (
    <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="section-header mb-6">Projects</h2>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-6 lg:gap-8">
          {filteredProjects.map((project, index) => (
            <Card
              id={project.id}
              data-title={project.title}
              key={project.id} 
              className="project-card overflow-hidden group"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => setSelectedProject(project)}
            >
              <div className="aspect-video bg-muted bg-cover bg-center relative overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
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
                    className="btn-hero px-4 py-2 text-sm"
                  >
                    View Details
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Enhanced Project Detail Modal */}
        {selectedProject && (
          <div className="fixed inset-0 z-50 bg-background/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
            <Card className="max-w-6xl w-full max-h-[95vh] overflow-y-auto border-2 border-primary/20">
              <div className="relative">
                {/* Header */}
                <div className="p-8 border-b border-border">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex-1">
                      <h3 className="text-4xl font-bold text-foreground mb-3">
                        {selectedProject.title}
                      </h3>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {selectedProject.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-sm">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setSelectedProject(null)}
                      className="text-muted-foreground hover:text-foreground ml-4"
                    >
                      <X className="h-6 w-6" />
                    </Button>
                  </div>
                  
                  {/* Project Stats */}
                  <div className="grid grid-cols-3 gap-6 mb-6">
                    <div className="text-center">
                      <Calendar className="h-5 w-5 text-primary mx-auto mb-2" />
                      <div className="text-sm text-muted-foreground">Timeline</div>
                      <div className="font-semibold text-foreground">{selectedProject.timeline}</div>
                    </div>
                    <div className="text-center">
                      <Users className="h-5 w-5 text-secondary mx-auto mb-2" />
                      <div className="text-sm text-muted-foreground">Team</div>
                      <div className="font-semibold text-foreground">{selectedProject.team}</div>
                    </div>
                    <div className="text-center">
                      <Target className="h-5 w-5 text-accent mx-auto mb-2" />
                      <div className="text-sm text-muted-foreground">Category</div>
                      <div className="font-semibold text-foreground capitalize">{selectedProject.category}</div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  {/* Main Image */}
                  <div className="aspect-video bg-muted rounded-lg mb-8 overflow-hidden">
                    <img 
                      src={selectedProject.image} 
                      alt={selectedProject.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Description and Impact */}
                  <div className="grid lg:grid-cols-2 gap-8 mb-8">
                    <div>
                      <h4 className="text-xl font-semibold text-foreground mb-4">Project Overview</h4>
                      <p className="text-lg text-muted-foreground leading-relaxed">
                        {selectedProject.longDescription}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="text-xl font-semibold text-foreground mb-4">Key Impact</h4>
                      <div className="space-y-3">
                        {selectedProject.impact.map((item, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-muted-foreground">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-4 justify-center">
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
              </div>
            </Card>
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;