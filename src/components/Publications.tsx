import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  BookOpen,
  Calendar,
  Users,
  ExternalLink,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface Publication {
  id: string;
  title: string;
  authors: string;
  conference: string;
  year: string;
  status: 'published' | 'under-review' | 'in-progress';
  abstract?: string;
  link?: string;
}

import { useState } from 'react';

const Publications = () => {
  const [mobileSection, setMobileSection] = useState<'published' | 'under'>('published');
  const published: Publication[] = [
    {
      id: 'ffnn-ga-beam-selection-2025',
      title: 'A Hybrid FeedForward Neural Network-Genetic Algorithm Approach for Beam Selection Optimization in 5G Massive MIMO Systems',
      authors: 'Lujain Almomani, Mohammad Abbasi, Ayesha Wasim Qureshi, Kiyan Afsari, Mohd Fareq Abd Malek',
      conference: 'ICCCE 2025',
      year: '2025',
      status: 'published'
    },
    {
      id: 'fuzzy-antenna-classification-2025',
      title: 'Beyond Manual Labelling: Enhancing Antenna Classification and Performance with Fuzzy Clustering and Machine Learning',
      authors: 'Lujain Almomani, Obada Alkhatib, Joud Almomani, Abeer Elkhouly',
      conference: 'FICTA-2025',
      year: '2025',
      status: 'published'
    },
    {
      id: 'vanet-ml-dl-comparison-2025',
      title: 'Intrusion Detection in VANETs: A Comparative Study of Machine Learning and Deep Learning Models',
      authors: 'Mohammad Abbasi, Lujain Almomani, Obada Alkhatib',
      conference: 'ISDIA-2025',
      year: '2025',
      status: 'published'
    }
  ];

  const underReview: Publication[] = [
    {
      id: 'vanet-iov-security-review-2025',
      title: 'A Comprehensive Review of Security Mechanisms in VANETs and IoV',
      authors: 'Lujain Almomani, Obada Al-Khatib, Ghalia Nassreddine, Mohamad Nassereddine, Abeer Elkhouly',
      conference: 'Target Journal',
      year: '-',
      status: 'under-review'
    },
    {
      id: 'real-time-vanet-ids-mqtt-2025',
      title: 'Real-Time Intrusion Detection in VANETs Using Lightweight Machine Learning and MQTT',
      authors: 'Mohammad Abbasi, Lujain Almomani, Obada Alkhatib',
      conference: 'Under Review',
      year: '-',
      status: 'under-review'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'under-review':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'under-review':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      default:
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    }
  };

  const PublicationCard = ({ publication, index }: { publication: Publication; index: number }) => (
    <Card
      className="project-card overflow-hidden group p-4 sm:p-6 hover:border-border-hover hover:shadow-card transform hover:scale-[1.02] cursor-pointer"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 gap-2">
        <div className="flex items-center gap-2">
          {getStatusIcon(publication.status)}
          <Badge className={`text-xs ${getStatusColor(publication.status)}`}>
            {publication.status === 'published' ? 'Published' :
             publication.status === 'under-review' ? 'Under Review' : 'In Progress'}
          </Badge>
        </div>
        <span className="text-sm text-muted-foreground">{publication.year}</span>
      </div>

      <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 group-hover:text-primary transition-colors leading-tight">
        {publication.title}
      </h3>

      <div className="space-y-2 sm:space-y-3 mb-4">
        <div className="flex items-start gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span className="break-words leading-relaxed">{publication.authors}</span>
        </div>

        <div className="flex items-start gap-2 text-sm text-muted-foreground">
          <BookOpen className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span className="break-words">{publication.conference}</span>
        </div>
      </div>

      {publication.link && (
        <Button
          size="sm"
          className="btn-hero px-4 py-2 text-sm w-full"
          onClick={() => window.open(publication.link, '_blank')}
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">View Publication</span>
          <span className="sm:hidden">View</span>
        </Button>
      )}
    </Card>
  );

  return (
    <>
    <section id="publications" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 sm:mb-16 animate-fade-in">
          <h2 className="section-header mb-4 sm:mb-6 text-3xl sm:text-4xl md:text-5xl">Publications</h2>
          <div className="w-24 h-1 bg-gradient-primary mx-auto mb-6 sm:mb-8"></div>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
            Research contributions in telecommunications, machine learning, and cybersecurity
          </p>
        </div>

        {/* Mobile: Collapsible two sections */}
        <div className="lg:hidden space-y-4">
          <button
            className="w-full flex items-center justify-between p-4 bg-card/60 rounded-lg border border-border"
            onClick={() => setMobileSection(mobileSection === 'published' ? 'under' : 'published')}
            aria-expanded={mobileSection === 'published'}
            aria-controls="pub-published"
          >
            <span className="text-left text-xl font-bold text-foreground">Published Research</span>
            {mobileSection === 'published' ? <ChevronUp className="h-6 w-6 text-primary"/> : <ChevronDown className="h-6 w-6 text-primary"/>}
          </button>
          {mobileSection === 'published' && (
            <div id="pub-published" className="space-y-4">
              {published.map((publication, index) => (
                <PublicationCard key={publication.id} publication={publication} index={index} />
              ))}
            </div>
          )}

          <button
            className="mt-6 w-full flex items-center justify-between p-4 bg-card/60 rounded-lg border border-border"
            onClick={() => setMobileSection(mobileSection === 'under' ? 'published' : 'under')}
            aria-expanded={mobileSection === 'under'}
            aria-controls="pub-under"
          >
            <span className="text-left text-xl font-bold text-foreground">Under Review & In Progress</span>
            {mobileSection === 'under' ? <ChevronUp className="h-6 w-6 text-primary"/> : <ChevronDown className="h-6 w-6 text-primary"/>}
          </button>
          {mobileSection === 'under' && (
            <div id="pub-under" className="space-y-4">
              {underReview.map((publication, index) => (
                <PublicationCard key={publication.id} publication={publication} index={index} />
              ))}
            </div>
          )}
        </div>

        {/* Desktop / Large screens: Side-by-side */}
        <div className="hidden lg:grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          {/* Published Section */}
          <div className="animate-fade-in">
            <div className="flex items-center gap-3 mb-6 sm:mb-8">
              <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-500 flex-shrink-0" />
              <h3 className="text-xl sm:text-2xl font-bold text-foreground">Published Research</h3>
            </div>

            <div className="space-y-4 sm:space-y-6">
              {published.map((publication, index) => (
                <PublicationCard
                  key={publication.id}
                  publication={publication}
                  index={index}
                />
              ))}
            </div>
          </div>

          {/* Under Review/Work in Progress Section */}
          <div className="animate-fade-in">
            <div className="flex items-center gap-3 mb-6 sm:mb-8">
              <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500 flex-shrink-0" />
              <h3 className="text-xl sm:text-2xl font-bold text-foreground">Under Review & In Progress</h3>
            </div>

            <div className="space-y-4 sm:space-y-6">
              {underReview.map((publication, index) => (
                <PublicationCard
                  key={publication.id}
                  publication={publication}
                  index={index}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="mt-12 sm:mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 animate-fade-in">
          <div className="text-center p-4 sm:p-6 bg-card/50 rounded-lg border border-border">
            <div className="text-2xl sm:text-3xl font-bold text-primary mb-1 sm:mb-2">{published.length}</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Published Papers</div>
          </div>

          <div className="text-center p-4 sm:p-6 bg-card/50 rounded-lg border border-border">
            <div className="text-2xl sm:text-3xl font-bold text-yellow-500 mb-1 sm:mb-2">{underReview.length}</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Under Review</div>
          </div>

          <div className="text-center p-4 sm:p-6 bg-card/50 rounded-lg border border-border">
            <div className="text-2xl sm:text-3xl font-bold text-secondary mb-1 sm:mb-2">5</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Co-authors</div>
          </div>

          <div className="text-center p-4 sm:p-6 bg-card/50 rounded-lg border border-border">
            <div className="text-2xl sm:text-3xl font-bold text-accent mb-1 sm:mb-2">2025</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Latest Year</div>
          </div>
        </div>
      </div>
    </section>
    {/* Professional Experience (Mini Section) */}
    <section id="experience" className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h3 className="text-2xl sm:text-3xl font-bold text-foreground">Professional Experience</h3>
          <div className="w-24 h-1 bg-gradient-secondary mx-auto mt-4"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <Card className="p-6 border border-border">
            <h4 className="text-lg font-semibold text-foreground">Research Intern</h4>
            <div className="text-sm text-muted-foreground mb-2">University of Wollongong (UOWD) • Sept 2024 – Present</div>
            <ul className="list-disc list-inside space-y-2 text-foreground">
              <li>Developed ML-based VANET IDS; published on VANET security.</li>
              <li>Optimized real-time detection for constrained hardware.</li>
            </ul>
          </Card>

          <Card className="p-6 border border-border">
            <h4 className="text-lg font-semibold text-foreground">Clubs Director – Student Government</h4>
            <div className="text-sm text-muted-foreground mb-2">Rochester Institute of Technology (RIT) • Apr 2023 – Sept 2023</div>
            <ul className="list-disc list-inside space-y-2 text-foreground">
              <li>Led clubs, organized events; earned Best Leadership & Best Club.</li>
              <li>Facilitated collaboration across students, faculty, and staff.</li>
            </ul>
          </Card>

          <Card className="p-6 border border-border">
            <h4 className="text-lg font-semibold text-foreground">Business Intelligence Intern</h4>
            <div className="text-sm text-muted-foreground mb-2">Jordan Payments & Clearance Company (JOPACC) • Jul 2023 – Aug 2023</div>
            <ul className="list-disc list-inside space-y-2 text-foreground">
              <li>Built presentation & quarterly report for decision-making.</li>
              <li>Explored ETL processes; created Power BI visualizations.</li>
            </ul>
          </Card>
        </div>
      </div>
    </section>
    </>
  );
};

export default Publications;
