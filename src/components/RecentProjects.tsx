import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Github, Calendar } from 'lucide-react';

const RecentProjects = () => {
  const recentProjects = [
    {
      id: '1',
      title: 'AI-Powered Race Strategy System',
      description: 'Machine learning model for optimal pit stop timing and tire strategy.',
      date: '2024-01',
      status: 'Completed',
      tags: ['Python', 'TensorFlow', 'Racing'],
      image: '/api/placeholder/300/200',
      github: 'https://github.com',
      demo: 'https://demo.com'
    },
    {
      id: '2',
      title: 'Vehicle ECU Exploit Framework',
      description: 'Comprehensive testing suite for automotive Electronic Control Units.',
      date: '2023-12',
      status: 'In Progress',
      tags: ['C++', 'Security', 'Automotive'],
      image: '/api/placeholder/300/200',
      github: 'https://github.com'
    },
    {
      id: '3',
      title: 'Wireless Charging Pad IoT',
      description: 'Smart charging station with usage analytics and remote monitoring.',
      date: '2023-11',
      status: 'Completed',
      tags: ['IoT', 'Hardware', 'Analytics'],
      image: '/api/placeholder/300/200',
      github: 'https://github.com',
      demo: 'https://demo.com'
    },
    {
      id: '4',
      title: 'Blockchain-Based Parts Tracking',
      description: 'Immutable supply chain tracking for racing components.',
      date: '2023-10',
      status: 'Prototype',
      tags: ['Blockchain', 'Supply Chain', 'Web3'],
      image: '/api/placeholder/300/200',
      github: 'https://github.com'
    },
    {
      id: '5',
      title: 'Drone Fleet Management',
      description: 'Autonomous drone coordination for track surveillance and safety.',
      date: '2023-09',
      status: 'Testing',
      tags: ['Drones', 'Computer Vision', 'Safety'],
      image: '/api/placeholder/300/200',
      github: 'https://github.com'
    },
    {
      id: '6',
      title: 'Predictive Maintenance AI',
      description: 'ML system for predicting component failures in racing vehicles.',
      date: '2023-08',
      status: 'Completed',
      tags: ['Machine Learning', 'Sensors', 'Predictive'],
      image: '/api/placeholder/300/200',
      github: 'https://github.com',
      demo: 'https://demo.com'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-secondary text-secondary-foreground';
      case 'In Progress': return 'bg-primary text-primary-foreground';
      case 'Testing': return 'bg-accent text-accent-foreground';
      case 'Prototype': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <section id="recent" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="section-header mb-6">Recent Work</h2>
          <div className="w-24 h-1 bg-gradient-secondary mx-auto mb-8"></div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Latest projects showcasing cutting-edge technology and innovative solutions
          </p>
        </div>

        {/* Recent Projects Gallery */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {recentProjects.map((project, index) => (
            <Card 
              key={project.id}
              className="project-card overflow-hidden"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Project Image */}
              <div className="aspect-video bg-muted bg-cover bg-center relative group-hover:scale-105 transition-transform duration-300">
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
                <div className="absolute top-4 right-4">
                  <Badge className={getStatusColor(project.status)}>
                    {project.status}
                  </Badge>
                </div>
                <div className="absolute bottom-4 left-4 flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2" />
                  {new Date(project.date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short' 
                  })}
                </div>
              </div>

              {/* Project Content */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {project.description}
                </p>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {project.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {project.tags.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{project.tags.length - 2}
                    </Badge>
                  )}
                </div>
                
                {/* Action Buttons */}
                <div className="flex space-x-2">
                  {project.github && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1 text-xs hover:border-primary hover:text-primary"
                    >
                      <Github className="h-3 w-3 mr-1" />
                      Code
                    </Button>
                  )}
                  {project.demo && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="flex-1 text-xs hover:border-secondary hover:text-secondary"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Demo
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Button size="lg" className="btn-hero px-8 py-3">
            <span className="relative z-10">View All Projects</span>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default RecentProjects;