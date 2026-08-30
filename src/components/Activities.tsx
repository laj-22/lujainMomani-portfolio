import { useState } from 'react';
import { activities as activitiesData } from '@/lib/content';
import { getIcon, getColorRingClass } from '@/lib/icons';
import { resolveLinks } from '@/lib/links';
import { LinkButtons, LinkPill } from '@/components/LinkButtons';
import RichText, { toRichHtml } from '@/components/RichText';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  MapPin,
  Star,
  Zap,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const Activities = () => {
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['Competitions']));

  const toggleCategory = (categoryName: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryName)) {
      newExpanded.delete(categoryName);
    } else {
      newExpanded.add(categoryName);
    }
    setExpandedCategories(newExpanded);
  };

  const activities = activitiesData.map((category) => ({
    ...category,
    icon: getIcon(category.icon, 'h-6 w-6') ?? getIcon('Trophy', 'h-6 w-6'),
  }));

  return (
    <section id="activities" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="section-header mb-6">Activities & Achievements</h2>
          <div className="w-24 h-1 bg-gradient-secondary mx-auto mb-8"></div>
          <p className="text-xl text-foreground max-w-3xl mx-auto">
            Leadership roles, competitions, certifications, and community contributions that shape my journey
          </p>
        </div>

        <div className="space-y-6">
          {activities.map((category, categoryIndex) => {
            const isExpanded = expandedCategories.has(category.category);

            return (
              <div key={`${category.category}-${categoryIndex}`} className="animate-fade-in" style={{ animationDelay: `${categoryIndex * 0.2}s` }}>
                {/* Collapsible Category Header */}
                <button
                  onClick={() => toggleCategory(category.category)}
                  className="w-full flex items-center justify-between p-4 bg-card/50 rounded-lg border border-border hover:bg-card transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full border transition-colors ${getColorRingClass(category.color)}`}>
                      {category.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {category.category}
                    </h3>
                  </div>
                  <div className="text-muted-foreground group-hover:text-foreground transition-colors">
                    {isExpanded ? <ChevronUp className="h-6 w-6" /> : <ChevronDown className="h-6 w-6" />}
                  </div>
                </button>

                {/* Category Items */}
                {isExpanded && (
                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-6 xl:gap-6">
                    {category.items.map((item, itemIndex) => (
                      <Card
                        key={item.title}
                        className="project-card group p-6 cursor-pointer"
                        style={{ animationDelay: `${(categoryIndex * 0.2) + (itemIndex * 0.1)}s` }}
                        onClick={() => setSelectedActivity(item)}
                      >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors leading-tight">
                          {item.title}
                        </h4>
                        <p className="text-sm text-foreground">{item.role}</p>
                      </div>
                      <Badge variant="secondary" className="ml-2">
                        <Star className="h-3 w-3 mr-1" />
                        {item.achievement}
                      </Badge>
                    </div>

                    {/* Meta Info */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-foreground">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span>{item.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-foreground">
                        <MapPin className="h-4 w-4 text-secondary" />
                        <span>{item.location}</span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-foreground leading-relaxed mb-2">
                      <RichText
                        html={toRichHtml(String(item.description || ''))}
                        className="text-muted-foreground text-sm"
                        as="p"
                      />
                    </p>
                    {resolveLinks(item as { link?: string; links?: Array<{ type: string; url: string; label?: string }> }).map((link, linkIndex) => (
                      <LinkPill
                        key={`${link.type}-${link.url}-${linkIndex}`}
                        link={link}
                        className="text-xs"
                      />
                    ))}

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {item.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Hover Effect Icon */}
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Zap className="h-5 w-5 text-primary" />
                    </div>
                  </Card>
                ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Activity Detail Modal */}
        {selectedActivity && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
            <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto border-2 border-border shadow-2xl">
              <div className="relative">
                {/* Header */}
                <div className="p-8 border-b border-border">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex-1">
                      <h3 className="text-3xl font-bold text-foreground mb-3 leading-tight">
                        {selectedActivity.title}
                      </h3>
                      <p className="text-lg text-muted-foreground mb-4">
                        {selectedActivity.role}
                      </p>

                      {/* Meta Info */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <Calendar className="h-5 w-5 text-primary" />
                          <span>{selectedActivity.date}</span>
                        </div>
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <MapPin className="h-5 w-5 text-secondary" />
                          <span>{selectedActivity.location}</span>
                        </div>
                      </div>

                      <Badge className="bg-primary/10 text-primary border-primary/20">
                        <Star className="h-4 w-4 mr-1" />
                        {selectedActivity.achievement}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedActivity(null)}
                      className="text-muted-foreground hover:text-foreground ml-4"
                    >
                      <X className="h-6 w-6" />
                    </Button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  {/* Description */}
                    <div className="mb-8">
                    <h4 className="text-xl font-semibold text-foreground mb-4">Overview</h4>
                    <RichText
                      html={toRichHtml(String(selectedActivity.description || ''))}
                      className="text-lg text-foreground leading-relaxed mb-6"
                      as="p"
                    />
                  </div>

                  {/* Tags */}
                  <div className="mb-8">
                    <h4 className="text-xl font-semibold text-foreground mb-4">Categories</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedActivity.tags.map((tag: string) => (
                        <Badge key={tag} variant="secondary" className="text-sm">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Link */}
                  <LinkButtons links={resolveLinks(selectedActivity as { link?: string; links?: Array<{ type: string; url: string; label?: string }> })} />
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </section>
  );
};

export default Activities;