import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { 
  Mail, 
  MapPin, 
  Linkedin, 
  Send
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const web3formsKey = (import.meta.env.VITE_WEB3FORMS_KEY as string | undefined) ?? '27fd6a80-d2fb-4f48-b53c-08ef083a04d0';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!web3formsKey) {
      toast({
        title: 'Email service not configured',
        description: 'Add VITE_WEB3FORMS_KEY to your .env to enable sending.',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: web3formsKey,
          from_name: formData.name,
          from_email: formData.email,
          subject: formData.subject,
          message: formData.message,
          reply_to: formData.email
        })
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: 'Message Sent!',
          description: "Thanks for reaching out. I'll get back to you soon.",
        });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        toast({
          title: 'Failed to send',
          description: result.message || 'Please try again later.'
        });
      }
    } catch (error) {
      toast({
        title: 'Network error',
        description: 'Unable to send your message right now.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const contactInfo = [
    {
      icon: <Mail className="h-5 w-5" />,
      title: 'Email',
      value: 'lujain.momani@hotmail.com',
      link: 'mailto:lujain.momani@hotmail.com'
    },
    {
      icon: <MapPin className="h-5 w-5" />,
      title: 'Location',
      value: 'Dubai, UAE • Available for online work',
      link: null
    }
  ];

  const socialLinks = [
    {
      icon: <Linkedin className="h-6 w-6" />,
      label: 'LinkedIn',
      url: 'https://www.linkedin.com/in/lujainn',
      color: 'hover:text-accent'
    }
  ];

  return (
    <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="section-header mb-6">Let's Connect</h2>
          <div
            className="w-24 h-1 mx-auto mb-8"
            style={{ backgroundImage: 'var(--gradient-forest)' }}
          ></div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Let's talk innovation, security, and resilient systems. I'm always looking for the next challenge.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-2 space-y-8 animate-fade-in-up">
            <div>
              <h3 className="text-2xl font-semibold text-foreground mb-6">Get in Touch</h3>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Ready to collaborate on your next project? I'm always excited to discuss innovative solutions that push the boundaries of technology.
              </p>
            </div>

            {/* Contact Details */}
            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="text-primary p-3 rounded-lg bg-primary/10">
                    {info.icon}
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">{info.title}</div>
                    {info.link ? (
                      <a 
                        href={info.link}
                        className="text-foreground hover:text-primary transition-colors"
                      >
                        {info.value}
                      </a>
                    ) : (
                      <div className="text-foreground">{info.value}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Social Links */}
            <div>
              <h4 className="text-lg font-semibold text-foreground mb-4">Connect on Social</h4>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-3 rounded-lg bg-muted text-muted-foreground transition-all duration-300 ${social.color} hover:transform hover:scale-110`}
                    aria-label={social.label}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3 animate-slide-in-right">
            <Card className="p-8 shadow-card">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                      Name *
                    </label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="bg-input border-border focus:border-primary focus:ring-primary"
                      placeholder="Your full name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                      Email *
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="bg-input border-border focus:border-primary focus:ring-primary"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                    Subject *
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="bg-input border-border focus:border-primary focus:ring-primary"
                    placeholder="What's this about?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                    Message *
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className="bg-input border-border focus:border-primary focus:ring-primary resize-none"
                    placeholder="Tell me about your project or idea..."
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full btn-hero py-3"
                >
                  <Send className="h-5 w-5 mr-2" />
                  <span className="relative z-10">
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </span>
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;