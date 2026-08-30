import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronRight,
  X,
  Calendar,
  Users,
  Target
} from 'lucide-react';
import { getDisplayProjects, getDerivedCategories, type Project } from '@/lib/content';
import { getCategoryIcon } from '@/lib/icons';
import { getTitleBases, resolveProjectImageSrc } from '@/lib/images';
import { resolveLinks } from '@/lib/links';
import { LinkButtons, LinkIconButtons } from '@/components/LinkButtons';
import RichText, { toRichHtml } from '@/components/RichText';

const Projects = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [visibleProjects, setVisibleProjects] = useState(6);

  const publicBase = (import.meta.env.BASE_URL || '/');
  const projects = getDisplayProjects().map((project) => ({
    ...project,
    image: resolveProjectImageSrc(project.title, project.image),
  }));
  const categories = getDerivedCategories().map((category) => ({
    ...category,
    icon: getCategoryIcon(category.icon, 'h-4 w-4'),
  }));


  const filteredProjects = 
    activeCategory === 'all' 
    ? projects 
      : activeCategory === 'featured'
        ? projects.filter(project => project.featured)
    : projects.filter(project => project.category === activeCategory);

  // Featured projects first, then newest by date
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (Boolean(a.featured) !== Boolean(b.featured)) {
      return a.featured ? -1 : 1;
    }
    const aDate = new Date(a.endDate || a.startDate || '1970-01-01').getTime();
    const bDate = new Date(b.endDate || b.startDate || '1970-01-01').getTime();
    return bDate - aDate;
  });

  return (
    <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="section-header mb-6">Projects</h2>
          <div className="w-24 h-1 bg-gradient-primary mx-auto mb-8"></div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Innovative solutions across engineering, robotics, cybersecurity, and signal processing
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

        {/* Projects Grid or Empty State */}
        {sortedProjects.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <Card className="p-10 text-center border-dashed">
              <h3 className="text-xl font-semibold text-foreground mb-2">Projects coming soon</h3>
              <p className="text-muted-foreground">We’re setting things up. Check back shortly.</p>
            </Card>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Mobile: horizontal carousel */}
            <div className="sm:hidden overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2 scroll-smooth">
              <div className="flex gap-4 w-[100%] pr-4 pl-4">
                {sortedProjects.slice(0, visibleProjects).map((project, index) => (
                  <div key={project.id} className="min-w-[92%] snap-start mr-2">
                    <Card
                      id={project.id}
                      data-title={project.title}
                      className="project-card overflow-hidden"
                      style={{ animationDelay: `${index * 0.1}s` }}
                      onClick={() => setSelectedProject(project)}
                    >
                      <div className="aspect-video bg-muted bg-cover bg-center relative overflow-hidden">
                        <img
                          src={project.image || ''}
                          alt={project.title}
                          className="w-full h-full object-cover"
                          data-variants={getTitleBases(project.title, project.image).join('|')}
                          data-vidx="0"
                          data-eidx="0"
                          onError={(e) => {
                            const img = e.currentTarget as HTMLImageElement;
                            const variants = (img.getAttribute('data-variants') || '').split('|').filter(Boolean);
                            const exts = ['.jpg', '.jpeg', '.png', '.webp'];
                            let vIdx = Number(img.getAttribute('data-vidx') || '0');
                            let eIdx = Number(img.getAttribute('data-eidx') || '0');
                            eIdx += 1;
                            if (eIdx >= exts.length) {
                              eIdx = 0;
                              vIdx += 1;
                            }
                            if (vIdx < variants.length) {
                              img.setAttribute('data-vidx', String(vIdx));
                              img.setAttribute('data-eidx', String(eIdx));
                              img.src = `${variants[vIdx]}${exts[eIdx]}`;
                              return;
                            }
                            img.style.display = 'none';
                            const parent = img.parentElement;
                            if (parent) {
                              const fallback = document.createElement('div');
                              fallback.className = 'w-full h-full flex items-center justify-center text-muted-foreground text-sm';
                              fallback.textContent = 'No image provided';
                              parent.appendChild(fallback);
                            }
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-foreground mb-2 leading-tight">{project.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{project.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {project.tags.slice(0, 2).map((t) => (
                            <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
                          ))}
                        </div>
                      </div>
                    </Card>
                  </div>
                ))}
                {/* Peek of next card to indicate swipe */}
                <div className="min-w-[8%] opacity-70 flex items-center justify-center">
                  <ChevronRight className="h-6 w-6 text-muted-foreground" />
                </div>
              </div>
              <div className="text-center text-xs text-muted-foreground mt-2">Swipe to see more</div>
            </div>

            {/* Desktop grid */}
            <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-6 lg:gap-8">
              {sortedProjects.slice(0, visibleProjects).map((project, index) => (
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
                      src={project.image || ''}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      data-variants={getTitleBases(project.title, project.image).join('|')}
                      data-vidx="0"
                      data-eidx="0"
                      onError={(e) => {
                        const img = e.currentTarget as HTMLImageElement;
                        const variants = (img.getAttribute('data-variants') || '').split('|').filter(Boolean);
                        const exts = ['.jpg', '.jpeg', '.png', '.webp'];
                        let vIdx = Number(img.getAttribute('data-vidx') || '0');
                        let eIdx = Number(img.getAttribute('data-eidx') || '0');
                        eIdx += 1;
                        if (eIdx >= exts.length) {
                          eIdx = 0;
                          vIdx += 1;
                        }
                        if (vIdx < variants.length) {
                          img.setAttribute('data-vidx', String(vIdx));
                          img.setAttribute('data-eidx', String(eIdx));
                          img.src = `${variants[vIdx]}${exts[eIdx]}`;
                          return;
                        }
                        img.style.display = 'none';
                        const parent = img.parentElement;
                        if (parent) {
                          const fallback = document.createElement('div');
                          fallback.className = 'w-full h-full flex items-center justify-center text-muted-foreground text-sm';
                          fallback.textContent = 'No image provided';
                          parent.appendChild(fallback);
                        }
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                    {project.featured && (
                      <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
                        Featured
                      </Badge>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors leading-tight">
                      {project.title}
                    </h3>

                    <p className="text-muted-foreground mb-4 line-clamp-3 leading-relaxed">
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
                      <LinkIconButtons links={resolveLinks(project)} />

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

            {/* Load More Button */}
            {sortedProjects.length > visibleProjects && (
              <div className="flex justify-center">
                <Button
                  onClick={() => setVisibleProjects(prev => prev + 6)}
                  className="btn-hero px-8 py-3 text-lg"
                  size="lg"
                >
                  Load More Projects
                  <ChevronRight className="h-5 w-5 ml-2" />
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Enhanced Project Detail Modal */}
        {selectedProject && (
          <div
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
            onClick={() => setSelectedProject(null)}
          >
            <Card
              className="max-w-6xl w-full max-h-[95vh] overflow-y-auto border-2 border-border shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                {/* Header */}
                <div className="p-8 border-b border-border">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex-1">
                      <h3 className="text-4xl font-bold text-foreground mb-3 leading-tight">
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
                      src={selectedProject.image || ''} 
                      alt={selectedProject.title}
                      className="w-full h-full object-cover"
                      data-variants={getTitleBases(selectedProject.title, selectedProject.image).join('|')}
                      data-vidx="0"
                      data-eidx="0"
                      onError={(e) => {
                        const img = e.currentTarget as HTMLImageElement;
                        const variants = (img.getAttribute('data-variants') || '').split('|').filter(Boolean);
                        const exts = ['.jpg', '.jpeg', '.png', '.webp'];
                        let vIdx = Number(img.getAttribute('data-vidx') || '0');
                        let eIdx = Number(img.getAttribute('data-eidx') || '0');
                        eIdx += 1;
                        if (eIdx >= exts.length) {
                          eIdx = 0;
                          vIdx += 1;
                        }
                        if (vIdx < variants.length) {
                          img.setAttribute('data-vidx', String(vIdx));
                          img.setAttribute('data-eidx', String(eIdx));
                          img.src = `${variants[vIdx]}${exts[eIdx]}`;
                          return;
                        }
                        img.style.display = 'none';
                        const parent = img.parentElement;
                        if (parent) {
                          const fallback = document.createElement('div');
                          fallback.className = 'w-full h-full flex items-center justify-center text-muted-foreground';
                          fallback.textContent = 'No image provided';
                          parent.appendChild(fallback);
                        }
                      }}
                    />
                  </div>
                  
                  {/* Description and Impact */}
                  <div className="grid lg:grid-cols-2 gap-8 mb-8">
                    <div>
                      <h4 className="text-xl font-semibold text-foreground mb-4">Project Overview</h4>
                      <RichText
                        html={toRichHtml(selectedProject.longDescription)}
                        className="text-lg text-foreground leading-relaxed"
                      />
                    </div>
                    
                    <div>
                      <h4 className="text-xl font-semibold text-foreground mb-4">Key Impact</h4>
                      <div className="space-y-3">
                        {selectedProject.impact.map((item, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-foreground">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <LinkButtons links={resolveLinks(selectedProject)} />
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