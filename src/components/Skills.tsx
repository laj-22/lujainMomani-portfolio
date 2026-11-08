import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { skills } from '@/lib/content';
import { getIcon, getColorBoxClass } from '@/lib/icons';

const Skills = () => {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const { categories: skillCategories, relatedProjects } = skills;

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="skills" className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="section-header mb-6">Skills & Expertise</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore core skills across hardware, software, and tools.
          </p>
          <p className="text-sm text-muted-foreground max-w-3xl mx-auto mt-3">
            Skills with a number link to related projects. Select one to list them.
          </p>
        </div>

        <div className="mobile-rail gap-4 sm:columns-2 md:columns-3">
          {skillCategories.map((category) => (
            <Card key={category.title} className="mb-4 break-inside-avoid rounded-xl border border-border bg-card p-5 sm:p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className={`rounded-lg p-2 ${getColorBoxClass(category.color)}`}>
                  {getIcon(category.icon, 'h-5 w-5') ?? getIcon('Cpu', 'h-5 w-5')}
                </div>
                <h3 className="text-lg font-semibold text-foreground">{category.title}</h3>
              </div>

              <ul className="flex flex-wrap gap-2">
                {category.skills.map((skill) => {
                  const count = relatedProjects[skill.name]?.length ?? 0;
                  const active = selectedSkill === skill.name;
                  return (
                    <li key={skill.name}>
                      <button
                        type="button"
                        disabled={count === 0}
                        aria-pressed={active}
                        title={count ? `${count} related project${count > 1 ? 's' : ''}` : undefined}
                        onClick={() => setSelectedSkill(active ? null : skill.name)}
                        className={`rounded-md border px-2.5 py-1 text-sm transition-colors ${
                          active
                            ? 'border-primary bg-primary text-primary-foreground'
                            : count
                              ? 'border-border bg-background text-foreground hover:border-primary hover:text-primary'
                              : 'cursor-default border-border bg-background text-foreground'
                        }`}
                      >
                        {skill.name}
                        {count > 0 && (
                          <span className={`ml-1.5 font-mono text-[11px] ${active ? 'opacity-80' : 'text-muted-foreground'}`}>
                            {count}
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
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
