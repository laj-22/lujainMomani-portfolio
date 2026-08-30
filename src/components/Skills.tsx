import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { skills } from '@/lib/content';
import { getIcon, getColorBoxClass } from '@/lib/icons';

const Skills = () => {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const { categories: skillCategories, relatedProjects } = skills;

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

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
                <div className={`p-2 rounded-lg ${getColorBoxClass(category.color)}`}>
                  {getIcon(category.icon, 'h-6 w-6') ?? getIcon('Cpu', 'h-6 w-6')}
                </div>
                <h3 className="text-xl font-semibold text-foreground">{category.title}</h3>
              </div>

              <div className="space-y-4">
                {category.skills.map((skill, skillIndex) => (
                  <div
                    key={skill.name}
                    className="flex items-center justify-between group hover:translate-x-2 transition-all duration-300 cursor-pointer p-2 rounded-lg hover:bg-muted/30"
                    style={{ animationDelay: `${categoryIndex * 0.2 + skillIndex * 0.1}s` }}
                    onMouseEnter={() => setHoveredSkill(skill.name)}
                    onMouseLeave={() => setHoveredSkill(null)}
                    onClick={() => setSelectedSkill(selectedSkill === skill.name ? null : skill.name)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-muted-foreground group-hover:text-primary transition-colors">
                        {getIcon(skill.icon, 'h-5 w-5')}
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
            </Card>
          ))}
        </div>

        {selectedSkill && relatedProjects[selectedSkill] && (
          <div className="mt-12 animate-fade-in">
            <Card className="p-6 border border-primary/20">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Projects related to {selectedSkill}
              </h3>
              <div className="flex flex-wrap gap-2">
                {relatedProjects[selectedSkill].map((projectTitle) => (
                  <Badge
                    key={projectTitle}
                    variant="outline"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                    onClick={() => scrollToSection('projects')}
                  >
                    {projectTitle}
                  </Badge>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </section>
  );
};

export default Skills;
