import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Trophy, 
  Award, 
  Users, 
  Calendar,
  MapPin,
  Star,
  Medal,
  BookOpen,
  Zap
} from 'lucide-react';

const Activities = () => {
  const activities = [
    {
      category: 'Competitions',
      icon: <Trophy className="h-6 w-6" />,
      color: 'primary',
      items: [
        {
          title: 'Nexus 2.0 Research Competition – First Place, Computational Intelligence & Secure Systems',
          role: 'Inter‑University Student Research Competition',
          date: '2024',
          location: 'UAE',
          achievement: 'First Place',
          description: 'Won first place in the Computational Intelligence & Secure Systems track for research on ML/DL‑based VANET intrusion detection.',
          tags: ['Competition', 'Research', 'Cybersecurity'],
          link: 'https://www.linkedin.com/posts/university-of-wollongong-in-dubai_uowd-engineering-cybersecurity-activity-7309847882658938880-nX6E?utm_source=share&utm_medium=member_desktop&rcm=ACoAADj4RqYBCO44hq9YVmaIFI7z-1BhJyoMmmE'
        },
        {
          title: 'Youth Sustainability Conference – First Place, YouthHub×GE',
          role: 'Sustainability Innovation Challenge',
          date: '2023',
          location: 'UAE',
          achievement: 'First Place',
          description: 'Awarded for proposing innovative energy solutions to increase power production using limited resources.',
          tags: ['Sustainability', 'Energy', 'Innovation'],
          link: 'https://www.linkedin.com/posts/lujainn_generalelectric-cop28uae-sustainability-activity-7059578121179602944-1Z8q?utm_source=share&utm_medium=member_desktop&rcm=ACoAADj4RqYBCO44hq9YVmaIFI7z-1BhJyoMmmE'
        },
        {
          title: 'Engineering Robotics Challenge (ERC 2025) – Best Poster/Design Award',
          role: 'American University of Sharjah',
          date: '2025',
          location: 'UAE',
          achievement: 'Best Poster/Design',
          description: 'Recognized for the Autonomous Waste Collection Robot featuring ROS navigation and a custom lifting mechanism.',
          tags: ['Robotics', 'ROS', 'Design'],
          link: 'https://www.linkedin.com/posts/joud-almomani_erc2025-roboticsinnovation-sustainability-ugcPost-7315373789771395074-wU8G?utm_source=share&utm_medium=member_desktop&rcm=ACoAADj4RqYBCO44hq9YVmaIFI7z-1BhJyoMmmE'
        }
      ]
    },
    {
      category: 'Certifications & Programs',
      icon: <Award className="h-6 w-6" />,
      color: 'secondary',
      items: [
        {
          title: 'PwC Elevate Me Program',
          role: 'PwC Academy Middle East',
          date: '2025',
          location: 'Online',
          achievement: 'Completed',
          description: 'Mentorship initiative focused on workflow dynamics, industry exposure, and career path validation.',
          tags: ['Program', 'Mentorship', 'Online'],
          link: 'https://www.linkedin.com/posts/lujainn_i-am-delighted-to-share-that-i-have-recently-activity-7305508240568545280-W5wx?utm_source=share&utm_medium=member_desktop&rcm=ACoAADj4RqYBCO44hq9YVmaIFI7z-1BhJyoMmmE'
        },
        {
          title: 'McKinsey Forward Learners Program',
          role: 'McKinsey & Company',
          date: '2024',
          location: 'Online',
          achievement: 'Completed',
          description: 'Early‑career program developing problem solving, communication, and leadership skills for impact.',
          tags: ['Program', 'Leadership', 'Online'],
          link: 'https://www.linkedin.com/posts/lujainn_growth-leadership-itookastepforward-activity-7223989562048487425-A70u?utm_source=share&utm_medium=member_desktop&rcm=ACoAADj4RqYBCO44hq9YVmaIFI7z-1BhJyoMmmE'
        },
        {
          title: 'Agile Software Development Nanodegree',
          role: 'Abdullah Al Ghurair Foundation × Udacity',
          date: '2023',
          location: 'Online',
          achievement: 'Nanodegree',
          description: 'Agile practices with Scrum, Kanban, and iterative delivery fundamentals applied to software projects.',
          tags: ['Agile', 'Scrum', 'Program', 'Online'],
          link: 'https://www.udacity.com/certificate/e/ef946478-4c8a-11ee-a172-bf447b3103e6'
        }
      ]
    },
    {
      category: 'Involvements',
      icon: <Medal className="h-6 w-6" />,
      color: 'accent',
      items: [
        {
          title: 'ZainTECH – RIT Data Challenge',
          role: 'Hackathon Participant',
          date: '2025-03',
          location: 'RIT Dubai',
          achievement: 'Participant Credential',
          description: 'Analyzed, modeled, and optimized public transport data; applied AI-driven analytics and teamwork to improve efficiency and routing.',
          tags: ['Hackathon', 'Data Science', 'AI', 'Analytics'],
          link: 'https://www.linkedin.com/posts/lujainn_check-out-lujain-almomanis-zaintech-rit-activity-7292131432192212992-KE3L?utm_source=share&utm_medium=member_desktop&rcm=ACoAADj4RqYBCO44hq9YVmaIFI7z-1BhJyoMmmE'
        },
        {
          title: 'URC at BITS (InterSys2025)',
          role: 'Research Competitor / Presenter',
          date: '2025',
          location: 'UAE',
          achievement: 'Participation',
          description: 'University research competition hosted by Microsoft Tech Club at BITS during InterSys2025.',
          tags: ['Research', 'Competition', 'Fair'],
          link: 'https://www.linkedin.com/posts/mamad_intersys2025-ugcPost-7334919535205969920-qECJ?utm_source=share&utm_medium=member_desktop&rcm=ACoAADj4RqYBCO44hq9YVmaIFI7z-1BhJyoMmmE'
        },
        {
          title: 'URIC at Abu Dhabi University',
          role: 'Research Competitor / Presenter',
          date: '2025',
          location: 'UAE',
          achievement: 'Participation',
          description: 'University Research & Innovation Competition showcasing applied engineering and cybersecurity projects.',
          tags: ['Research', 'Competition', 'Fair'],
          link: 'https://www.linkedin.com/posts/mamad_intersys2025-ugcPost-7334919535205969920-qECJ?utm_source=share&utm_medium=member_desktop&rcm=ACoAADj4RqYBCO44hq9YVmaIFI7z-1BhJyoMmmE'
        },
        {
          title: '19th IEEE UAE Section Student Day – University of Dubai',
          role: 'Research Competitor / Presenter',
          date: '2025',
          location: 'UAE',
          achievement: 'Participation',
          description: 'Inter‑University Student Research Competition Nexus 2.0 organized by the IEEE Student Branch.',
          tags: ['IEEE', 'Research', 'Competition'],
          link: 'https://www.linkedin.com/posts/mamad_intersys2025-ugcPost-7334919535205969920-qECJ?utm_source=share&utm_medium=member_desktop&rcm=ACoAADj4RqYBCO44hq9YVmaIFI7z-1BhJyoMmmE'
        }
      ]
    },
    {
      category: 'Extracurricular',
      icon: <Users className="h-6 w-6" />,
      color: 'primary',
      items: [
        {
          title: 'Clubs Director – Student Government',
          role: 'Rochester Institute of Technology (RIT) Dubai',
          date: '2023',
          location: 'RIT Dubai',
          achievement: 'Leadership Nominations',
          description: 'Led university clubs and organized campus events; received Best Leadership and Best Club nominations. Facilitated collaboration among students, faculty, and staff to strengthen community engagement.',
          tags: ['Leadership', 'Student Government', 'Events']
        },
        {
          title: 'Founder – The Levant Club',
          role: 'Rochester Institute of Technology (RIT) Dubai',
          date: '2022',
          location: 'RIT Dubai',
          achievement: 'Club Founder',
          description: 'Established a cultural community club celebrating Levant heritage; delivered inclusive events and collaborations across campus.',
          tags: ['Founder', 'Culture', 'Community']
        }
      ]
    },
    {
      category: 'Academic Involvement',
      icon: <BookOpen className="h-6 w-6" />,
      color: 'secondary',
      items: [
        {
          title: 'IEEE Member',
          role: 'Institute of Electrical and Electronics Engineers',
          date: 'Present',
          location: 'UAE',
          achievement: 'Professional Membership',
          description: 'Active member participating in technical communities and student research activities.',
          tags: ['IEEE', 'Membership', 'Academic']
        },
        {
          title: 'Engineers Australia Member',
          role: 'Engineers Australia',
          date: 'Present',
          location: 'Australia',
          achievement: 'Professional Membership',
          description: 'Member of the national engineering body supporting standards, ethics, and professional development.',
          tags: ['Engineers Australia', 'Membership', 'Academic']
        }
      ]
    }
  ];

  return (
    <section id="activities" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="section-header mb-6">Activities & Achievements</h2>
          <div className="w-24 h-1 bg-gradient-secondary mx-auto mb-8"></div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Leadership roles, competitions, certifications, and community contributions that shape my journey
          </p>
        </div>

        <div className="space-y-16">
          {activities.map((category, categoryIndex) => (
            <div key={category.category} className="animate-fade-in" style={{ animationDelay: `${categoryIndex * 0.2}s` }}>
              {/* Category Header */}
              <div className="flex items-center gap-4 mb-8">
                <div className={`text-${category.color} p-3 rounded-full bg-${category.color}/10 border border-${category.color}/20`}>
                  {category.icon}
                </div>
                <h3 className="text-3xl font-bold text-foreground">{category.category}</h3>
                <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent"></div>
              </div>

              {/* Category Items */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-6 xl:gap-6">
                {category.items.map((item, itemIndex) => (
                  <Card 
                    key={item.title}
                    className="project-card group p-6"
                    style={{ animationDelay: `${(categoryIndex * 0.2) + (itemIndex * 0.1)}s` }}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                          {item.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">{item.role}</p>
                      </div>
                      <Badge variant="secondary" className="ml-2">
                        <Star className="h-3 w-3 mr-1" />
                        {item.achievement}
                      </Badge>
                    </div>

                    {/* Meta Info */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {item.date}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {item.location}
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                      {item.description}
                    </p>
                    {('link' in item) && (item as any).link && (
                      <a
                        href={(item as any).link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary text-xs underline"
                      >
                        View credential
                      </a>
                    )}

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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Activities;