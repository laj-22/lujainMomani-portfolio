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

  // Related projects data for skill filtering
  const relatedProjects = {
    'Arduino & Raspberry Pi': ['IoT Vehicle Telemetry System', 'Smart Pit Stop Assistant', 'Wireless Sensor Network'],
    'Sensors & Actuators': ['IoT Vehicle Telemetry System', 'Autonomous Track Robot', 'Wireless Sensor Network'],
    'CAN Bus Systems': ['CAN Bus Security Scanner', 'IoT Vehicle Telemetry System'],
    'Telemetry Systems': ['IoT Vehicle Telemetry System', 'Smart Pit Stop Assistant'],
    'PCB Design': ['Wireless Sensor Network', 'Embedded Firewall System'],
    '3D Printing & CAD': ['Autonomous Track Robot', 'Smart Pit Stop Assistant'],
    'Python & MATLAB': ['CAN Bus Security Scanner', 'Embedded Firewall System', 'Autonomous Track Robot'],
    'Penetration Testing': ['CAN Bus Security Scanner', 'Embedded Firewall System'],
    'Network Security': ['CAN Bus Security Scanner', 'Embedded Firewall System', 'Wireless Sensor Network'],
    'Wireshark Analysis': ['CAN Bus Security Scanner', 'Wireless Sensor Network'],
    'Embedded C/C++': ['Autonomous Track Robot', 'Embedded Firewall System', 'IoT Vehicle Telemetry System'],
    'IoT Security': ['Embedded Firewall System', 'Wireless Sensor Network'],
    'SolidWorks': ['Autonomous Track Robot', 'Smart Pit Stop Assistant'],
    'Git & Version Control': ['All Projects'],
    'Linux Systems': ['CAN Bus Security Scanner', 'Embedded Firewall System'],
    'Network Simulators': ['Wireless Sensor Network', 'Embedded Firewall System'],
    'Oscilloscopes': ['IoT Vehicle Telemetry System', 'Autonomous Track Robot'],
    'Logic Analyzers': ['CAN Bus Security Scanner', 'Embedded Firewall System']
  };

  const skillCategories = [
    {
      title: "Hardware & Motorsport Tech",
      icon: <Gauge className="h-6 w-6" />,
      color: "primary",
      skills: [
        { name: "Arduino & Raspberry Pi", icon: <Cpu className="h-5 w-5" /> },
        { name: "Sensors & Actuators", icon: <Activity className="h-5 w-5" /> },
        { name: "CAN Bus Systems", icon: <Radio className="h-5 w-5" /> },
        { name: "Telemetry Systems", icon: <Gauge className="h-5 w-5" /> },
        { name: "PCB Design", icon: <Cpu className="h-5 w-5" /> },
        { name: "3D Printing & CAD", icon: <Cog className="h-5 w-5" /> }
      ]
    },
    {
      title: "Software & Cybersecurity",
      icon: <Shield className="h-6 w-6" />,
      color: "secondary",
      skills: [
        { name: "Python & MATLAB", icon: <Code className="h-5 w-5" /> },
        { name: "Penetration Testing", icon: <Shield className="h-5 w-5" /> },
        { name: "Network Security", icon: <Wifi className="h-5 w-5" /> },
        { name: "Wireshark Analysis", icon: <Terminal className="h-5 w-5" /> },
        { name: "Embedded C/C++", icon: <Code className="h-5 w-5" /> },
        { name: "IoT Security", icon: <Wifi className="h-5 w-5" /> }
      ]
    },
    {
      title: "Tools & Technologies",
      icon: <Wrench className="h-6 w-6" />,
      color: "accent",
      skills: [
        { name: "SolidWorks", icon: <Cog className="h-5 w-5" /> },
        { name: "Git & Version Control", icon: <Terminal className="h-5 w-5" /> },
        { name: "Linux Systems", icon: <Terminal className="h-5 w-5" /> },
        { name: "Network Simulators", icon: <Wifi className="h-5 w-5" /> },
        { name: "Oscilloscopes", icon: <Activity className="h-5 w-5" /> },
        { name: "Logic Analyzers", icon: <Activity className="h-5 w-5" /> }
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
            A comprehensive toolkit spanning hardware design, software development, and cybersecurity
          </p>
          <p className="text-sm text-muted-foreground max-w-3xl mx-auto mb-8">
            Hover over a skill to view the number of related projects
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
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