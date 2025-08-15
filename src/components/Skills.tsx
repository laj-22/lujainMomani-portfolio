import { Card } from '@/components/ui/card';
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
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {skillCategories.map((category, categoryIndex) => (
            <Card 
              key={category.title} 
              className="project-card p-8"
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
                    className="flex items-center space-x-3 group hover:transform hover:translate-x-2 transition-all duration-300"
                    style={{ animationDelay: `${(categoryIndex * 0.2) + (skillIndex * 0.1)}s` }}
                  >
                    <div className="text-muted-foreground group-hover:text-primary transition-colors">
                      {skill.icon}
                    </div>
                    <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                      {skill.name}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;