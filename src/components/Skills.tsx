import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Cpu, 
  Wifi, 
  Shield, 
  Code, 
  Wrench, 
  Activity,
  Radio,
  Terminal,
  Cog,
  Gauge
} from 'lucide-react';

const Skills = () => {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Related projects mapped to current portfolio titles
  const relatedProjects: Record<string, string[]> = {
    // Hardware
    'Raspberry Pi & IoT Hardware': [
      'Hardware-Accelerated Intrusion Detection System for VANETs',
      'Smart Agricultural Monitoring System'
    ],
    'ESP32 & Edge Control': [
      'Smart IoT Parking Management System (SmartSpot)'
    ],
    'Sensors & Actuators': [
      'Intelligent Robotic Arm Sorting System',
      'Autonomous Robot Navigation System'
    ],
    'Digital Logic Design': [
      'Digital Currency Exchange Calculator'
    ],
    'Robotics Platforms': [
      'Autonomous Robot Navigation System',
      'Intelligent Robotic Arm Sorting System'
    ],
    // Software & Cybersecurity
    'Machine Learning': [
      'Traffic Sign Recognition System',
      'Smart Audio Denoising & Speech Restoration',
      'A Hybrid Machine Learning Framework for Antenna Design Optimization',
      'A Hybrid Deep Learning-Genetic Algorithm Approach for 5G Beam Selection',
      'Machine Learning Framework for VANET Intrusion Detection',
      'Hardware-Accelerated Intrusion Detection System for VANETs'
    ],
    'Computer Vision': [
      'Traffic Sign Recognition System',
      'Intelligent Robotic Arm Sorting System',
      'Smart IoT Parking Management System (SmartSpot)'
    ],
    'Network Security & IDS': [
      'Machine Learning Framework for VANET Intrusion Detection',
      'Hardware-Accelerated Intrusion Detection System for VANETs'
    ],
    'Network Design & Cisco IOS': [
      'Multi-Site Enterprise Network Design & Implementation'
    ],
    'Signal Processing': [
      'Smart Audio Denoising & Speech Restoration',
      'Parallel Image Processing Performance Analysis'
    ],
    // Tools & Tech
    'MATLAB': [
      'Traffic Sign Recognition System',
      'Smart Audio Denoising & Speech Restoration',
      'A Hybrid Deep Learning-Genetic Algorithm Approach for 5G Beam Selection',
      'Smart Agricultural Monitoring System'
    ],
    'Python': [
      'Hardware-Accelerated Intrusion Detection System for VANETs',
      'Intelligent Robotic Arm Sorting System'
    ],
    'Java': [
      'Parallel Image Processing Performance Analysis',
      'Fault-Tolerant Data Processing & Resilient Logging System'
    ],
    'Arduino & ThingSpeak': [
      'Smart Agricultural Monitoring System'
    ],
    'ROS': [
      'Autonomous Waste Collection Robot (ERC 2025)'
    ]
  };

  const skillCategories = [
    {
      title: "Hardware",
      icon: <Gauge className="h-6 w-6" />,
      color: "primary",
      skills: [
        { name: 'Raspberry Pi & IoT Hardware', icon: <Wifi className="h-5 w-5" /> },
        { name: 'ESP32 & Edge Control', icon: <Wifi className="h-5 w-5" /> },
        { name: 'Sensors & Actuators', icon: <Activity className="h-5 w-5" /> },
        { name: 'Digital Logic Design', icon: <Cpu className="h-5 w-5" /> },
        { name: 'Robotics Platforms', icon: <Gauge className="h-5 w-5" /> }
      ]
    },
    {
      title: "Software & Cybersecurity",
      icon: <Shield className="h-6 w-6" />,
      color: "secondary",
      skills: [
        { name: 'Machine Learning', icon: <Code className="h-5 w-5" /> },
        { name: 'Computer Vision', icon: <Code className="h-5 w-5" /> },
        { name: 'Network Security & IDS', icon: <Shield className="h-5 w-5" /> },
        { name: 'Signal Processing', icon: <Activity className="h-5 w-5" /> }
      ]
    },
    {
      title: "Tools & Technologies",
      icon: <Wrench className="h-6 w-6" />,
      color: "accent",
      skills: [
        { name: 'MATLAB', icon: <Terminal className="h-5 w-5" /> },
        { name: 'Python', icon: <Terminal className="h-5 w-5" /> },
        { name: 'Java', icon: <Terminal className="h-5 w-5" /> },
        { name: 'Arduino & ThingSpeak', icon: <Wifi className="h-5 w-5" /> },
        { name: 'ROS', icon: <Cog className="h-5 w-5" /> },
        { name: 'Network Design & Cisco IOS', icon: <Terminal className="h-5 w-5" /> }
      ]
    }
  ];

  return (
    <section id="skills" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="section-header mb-6">Skills & Expertise</h2>
          <div className="w-24 h-1 bg-gradient-secondary mx-auto mb-8"></div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore core skills across hardware, software, and tools.
          </p>
          <p className="text-sm text-muted-foreground max-w-3xl mx-auto mb-8">
            Hover to see related project counts. Click a skill to jump to those projects.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-4 sm:gap-8">
          {skillCategories.map((category, categoryIndex) => (
            <Card 
              key={category.title} 
              className="project-card p-8 relative"
              style={{ animationDelay: `${categoryIndex * 0.2}s` }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className={`text-${category.color} p-2 rounded-lg bg-${category.color}/10`}>
                  {category.icon}
                </div>
                <h3 className="text-xl font-semibold text-foreground">
                  {category.title}
                </h3>
              </div>

              <div className="space-y-4">
                {category.skills.map((skill, skillIndex) => (
                  <div 
                    key={skill.name}
                    className="flex items-center justify-between group hover:translate-x-2 transition-all duration-300 cursor-pointer p-2 rounded-lg hover:bg-muted/30"
                    style={{ animationDelay: `${(categoryIndex * 0.2) + (skillIndex * 0.1)}s` }}
                    onMouseEnter={() => setHoveredSkill(skill.name)}
                    onMouseLeave={() => setHoveredSkill(null)}
                    onClick={() => setSelectedSkill(selectedSkill === skill.name ? null : skill.name)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-muted-foreground group-hover:text-primary transition-colors">
                        {skill.icon}
                      </div>
                      <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                        {skill.name}
                      </span>
                    </div>
                    
                    {hoveredSkill === skill.name && relatedProjects[skill.name] && (
                      <span className="text-xs text-primary font-medium">
                        {relatedProjects[skill.name].length} projects
                      </span>
                    )}
                  </div>
                ))}
              </div>
              {/* Expanded Projects for clicked skill */}
              {selectedSkill && relatedProjects[selectedSkill] && category.skills.some(s => s.name === selectedSkill) && (
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {relatedProjects[selectedSkill].map((project, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        const el = document.querySelector(`[data-title="${project}"]`);
                        if (el) {
                          (el as HTMLElement).click();
                        }
                      }}
                      className="text-left w-full p-2 bg-muted/20 rounded hover:bg-muted/40 transition-colors"
                    >
                      {project}
                    </button>
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;