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
          title: 'Formula Student Competition',
          role: 'Electronics Team Lead',
          date: '2024',
          location: 'Silverstone, UK',
          achievement: '3rd Place Overall',
          description: 'Led the electronics and telemetry systems for our formula racing car, managing a team of 8 engineers.',
          tags: ['Leadership', 'Motorsport', 'Electronics']
        },
        {
          title: 'CyberSecurity CTF Championship',
          role: 'Team Captain',
          date: '2024',
          location: 'London, UK',
          achievement: '1st Place',
          description: 'Captured flags in penetration testing, reverse engineering, and network security challenges.',
          tags: ['Security', 'CTF', 'Penetration Testing']
        },
        {
          title: 'Robotics Competition',
          role: 'Lead Developer',
          date: '2023',
          location: 'Birmingham, UK',
          achievement: '2nd Place',
          description: 'Developed autonomous navigation and control systems for high-speed racing robots.',
          tags: ['Robotics', 'AI', 'Competition']
        }
      ]
    },
    {
      category: 'Certifications',
      icon: <Award className="h-6 w-6" />,
      color: 'secondary',
      items: [
        {
          title: 'Certified Ethical Hacker (CEH)',
          role: 'EC-Council',
          date: '2024',
          location: 'Online',
          achievement: 'Certified',
          description: 'Advanced certification in ethical hacking, penetration testing, and cybersecurity practices.',
          tags: ['Certification', 'Security', 'Ethical Hacking']
        },
        {
          title: 'AWS Solutions Architect',
          role: 'Amazon Web Services',
          date: '2023',
          location: 'Online',
          achievement: 'Associate Level',
          description: 'Cloud architecture and IoT integration expertise for scalable embedded systems.',
          tags: ['AWS', 'Cloud', 'IoT']
        },
        {
          title: 'CompTIA Security+',
          role: 'CompTIA',
          date: '2023',
          location: 'Online',
          achievement: 'Certified',
          description: 'Foundational cybersecurity principles and network security fundamentals.',
          tags: ['Security', 'Networking', 'Compliance']
        }
      ]
    },
    {
      category: 'Speaking & Teaching',
      icon: <BookOpen className="h-6 w-6" />,
      color: 'accent',
      items: [
        {
          title: 'Motorsport Technology Conference',
          role: 'Keynote Speaker',
          date: '2024',
          location: 'Monaco',
          achievement: '300+ Attendees',
          description: 'Presented IoT telemetry innovations in Formula racing to industry professionals.',
          tags: ['Speaking', 'Motorsport', 'IoT']
        },
        {
          title: 'University Guest Lecturer',
          role: 'Cybersecurity in Automotive',
          date: '2024',
          location: 'Imperial College London',
          achievement: 'High Student Ratings',
          description: 'Taught advanced course on automotive cybersecurity and CAN bus vulnerabilities.',
          tags: ['Teaching', 'University', 'Automotive Security']
        },
        {
          title: 'DEF CON Workshop',
          role: 'Workshop Leader',
          date: '2023',
          location: 'Las Vegas, USA',
          achievement: '50+ Participants',
          description: 'Led hands-on workshop on automotive penetration testing and CAN bus security.',
          tags: ['Workshop', 'DEF CON', 'Automotive']
        }
      ]
    },
    {
      category: 'Community Involvement',
      icon: <Users className="h-6 w-6" />,
      color: 'primary',
      items: [
        {
          title: 'Engineering Society President',
          role: 'University Engineering Club',
          date: '2023-2024',
          location: 'University Campus',
          achievement: '200% Membership Growth',
          description: 'Organized technical workshops, industry visits, and mentorship programs for 500+ students.',
          tags: ['Leadership', 'Community', 'Mentorship']
        },
        {
          title: 'STEM Outreach Program',
          role: 'Volunteer Mentor',
          date: '2022-2024',
          location: 'Local Schools',
          achievement: '100+ Students Mentored',
          description: 'Teaching robotics and programming to high school students in underserved communities.',
          tags: ['Outreach', 'Education', 'Volunteering']
        },
        {
          title: 'Open Source Contributor',
          role: 'Various Projects',
          date: '2022-Present',
          location: 'Global',
          achievement: '50+ PRs Merged',
          description: 'Active contributor to cybersecurity tools and embedded systems libraries on GitHub.',
          tags: ['Open Source', 'GitHub', 'Community']
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
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                      {item.description}
                    </p>

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