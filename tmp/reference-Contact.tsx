import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumb } from "@/components/Breadcrumb";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { PageBackground } from "@/components/modern/PageBackground";
import { Mail, MapPin, Clock, Send, MessageSquare } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Generate a unique ID for idempotency
      const submissionId = crypto.randomUUID();

      // Store in database
      const { error: dbError } = await supabase
        .from('contact_submissions')
        .insert({
          id: submissionId,
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          email: email.trim().toLowerCase(),
          subject: subject.trim(),
          message: message.trim(),
        });

      if (dbError) {
        console.error('DB insert error:', dbError);
      }

      // Send team notification via transactional email system
      const { error: emailError } = await supabase.functions.invoke('send-transactional-email', {
        body: {
          templateName: 'contact-notification',
          idempotencyKey: `contact-notify-${submissionId}`,
          templateData: {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim().toLowerCase(),
            subject: subject.trim(),
            message: message.trim(),
          },
        },
      });

      if (emailError) {
        console.warn('Email notification failed (non-critical):', emailError);
      }

      // Send confirmation email to the user via transactional email system
      const { error: confirmError } = await supabase.functions.invoke('send-transactional-email', {
        body: {
          templateName: 'contact-confirmation',
          recipientEmail: email.trim().toLowerCase(),
          idempotencyKey: `contact-confirm-${submissionId}`,
          templateData: {
            firstName: firstName.trim(),
            subject: subject.trim(),
          },
        },
      });

      if (confirmError) {
        console.warn('Confirmation email failed (non-critical):', confirmError);
      }

      toast({
        title: "Message Sent Successfully!",
        description: "We'll get back to you within 24 hours. Check your inbox for a confirmation email.",
      });

      // Clear form
      setFirstName('');
      setLastName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (error) {
      console.error('Contact form submission error:', error);
      toast({
        title: "Failed to send message",
        description: "Please try again or email us directly at BitcoinCalculatorToolkit@gmail.com",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact bitcoincalculator.tools</title>
        <meta name="description" content="Got a question, found a bug, or want to suggest a calculator? We read every message. Reach out and we will get back to you." />
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href="https://bitcoincalculator.tools/contact" />

        {/* Open Graph tags */}
        <meta property="og:title" content="Contact bitcoincalculator.tools" />
        <meta property="og:description" content="Got a question, found a bug, or want to suggest a calculator? We read every message. Reach out and we will get back to you." />
        <meta property="og:url" content="https://bitcoincalculator.tools/contact" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://bitcoincalculator.tools/social-preview.webp" />
        <meta property="og:image:alt" content="Contact bitcoincalculator.tools | bitcoincalculator.tools" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="bitcoincalculator.tools" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Contact bitcoincalculator.tools" />
        <meta name="twitter:description" content="Got a question or found a bug? We read every message at bitcoincalculator.tools." />
        <meta name="twitter:image" content="https://bitcoincalculator.tools/social-preview.webp" />
        <meta name="twitter:creator" content="@web3believers" />

        <meta name="twitter:site" content="@web3believers" />
        <meta name="keywords" content="contact bitcoin calculator, bitcoin calculator support, bitcoin tools feedback, cryptocurrency calculator help" />

        {/* JSON-LD Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            "name": "Contact Bitcoin Calculator Tools",
            "description": "Got a question, found a bug, or want to suggest a calculator? We read every message.",
            "url": "https://bitcoincalculator.tools/contact",
            "isPartOf": {
              "@type": "WebSite",
              "url": "https://bitcoincalculator.tools"
            },
            "publisher": {
              "@type": "Organization",
              "name": "Bitcoin Calculator Tools",
              "url": "https://bitcoincalculator.tools"
            }
          })}
        </script>
      </Helmet>

      <BreadcrumbSchema items={[
        { name: "Home", url: "https://bitcoincalculator.tools/" },
        { name: "Contact", url: "https://bitcoincalculator.tools/contact" }
      ]} />

      <PageBackground variant="clean">
        <Header />
        
        <main id="main-content" className="pt-20 relative z-10">
          {/* Breadcrumb Navigation */}
          <div className="container mx-auto px-6 pt-8">
            <Breadcrumb items={[{ label: "Contact" }]} />
          </div>
          
          {/* Hero Section */}
          <section className="py-16">
            <div className="container mx-auto px-6 max-w-4xl text-center">
              <div className="animate-fade-in">
                <h1 className="text-display-xl font-display mb-6">
                  <span className="text-gradient-premium">Get in Touch</span>
                </h1>
                <p className="text-xl text-foreground/70 max-w-2xl mx-auto leading-relaxed">
                  Have questions about our Bitcoin calculators? Need technical support? 
                  We're here to help you make the most of your Bitcoin analysis tools.
                </p>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section className="py-16">
            <div className="container mx-auto px-6 max-w-6xl">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                
                {/* Contact Form */}
                <div className="animate-fade-in-up">
                  <Card className="card-premium h-full">
                    <CardHeader>
                      <CardTitle className="text-display-sm font-heading flex items-center gap-2">
                        <MessageSquare className="w-6 h-6 text-primary" />
                        Send us a Message
                      </CardTitle>
                      <CardDescription>
                        Fill out the form below and we'll respond within 24 hours
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="firstName" className="block text-sm font-medium text-foreground mb-2">
                              First Name *
                            </label>
                            <Input 
                              id="firstName" 
                              required 
                              placeholder="John"
                              className="w-full"
                              value={firstName}
                              onChange={(e) => setFirstName(e.target.value)}
                              maxLength={100}
                            />
                          </div>
                          <div>
                            <label htmlFor="lastName" className="block text-sm font-medium text-foreground mb-2">
                              Last Name *
                            </label>
                            <Input 
                              id="lastName" 
                              required 
                              placeholder="Doe"
                              className="w-full"
                              value={lastName}
                              onChange={(e) => setLastName(e.target.value)}
                              maxLength={100}
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                            Email Address *
                          </label>
                          <Input 
                            id="email" 
                            type="email" 
                            required 
                            placeholder="john@example.com"
                            className="w-full"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            maxLength={255}
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                            Subject *
                          </label>
                          <Input 
                            id="subject" 
                            required 
                            placeholder="How can we help you?"
                            className="w-full"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            maxLength={200}
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                            Message *
                          </label>
                          <Textarea 
                            id="message" 
                            required 
                            placeholder="Tell us about your inquiry..."
                            className="w-full min-h-32 resize-y"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            maxLength={2000}
                          />
                        </div>
                        
                        <Button 
                          type="submit" 
                          disabled={isSubmitting}
                          className="btn-premium w-full text-base font-medium py-3 group"
                        >
                          {isSubmitting ? (
                            <>Sending Message...</>
                          ) : (
                            <>
                              Send Message
                              <Send className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
                            </>
                          )}
                        </Button>
                        
                        <p className="text-sm text-foreground/60 text-center">
                          By submitting this form, you agree to our{" "}
                          <Link to="/privacy" className="text-primary hover:underline">
                            Privacy Policy
                          </Link>{" "}
                          and{" "}
                          <Link to="/terms" className="text-primary hover:underline">
                            Terms of Service
                          </Link>.
                        </p>
                      </form>
                    </CardContent>
                  </Card>
                </div>

                {/* Contact Information */}
                <div className="space-y-8 animate-fade-in-up animate-stagger-2">
                  
                  {/* Contact Details */}
                  <Card className="card-premium">
                    <CardHeader>
                      <CardTitle className="text-display-sm font-heading">Contact Information</CardTitle>
                      <CardDescription>
                        Multiple ways to reach our support team
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                          <Mail className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-heading font-semibold mb-1">Email Support</h3>
                          <p className="text-foreground/70 mb-1">support@bitcoincalculator.tools</p>
                          <p className="text-sm text-foreground/60">For technical support and general inquiries</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                          <Clock className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-heading font-semibold mb-1">Response Time</h3>
                          <p className="text-foreground/70 mb-1">Within 24 hours</p>
                          <p className="text-sm text-foreground/60">Monday - Friday, 9 AM - 6 PM EST</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                          <MapPin className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-heading font-semibold mb-1">Location</h3>
                          <p className="text-foreground/70 mb-1">Bitcoin is Everywhere</p>
                          <p className="text-sm text-foreground/60">Serving Bitcoin enthusiasts worldwide</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* FAQ Quick Links */}
                  <Card className="card-premium">
                    <CardHeader>
                      <CardTitle className="text-display-sm font-heading">Quick Help</CardTitle>
                      <CardDescription>
                        Common questions and resources
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                          <h4 className="font-heading font-medium mb-2">Calculator Issues?</h4>
                          <p className="text-sm text-foreground/70">
                            Check our FAQ section for common calculator problems and solutions.
                          </p>
                        </div>
                        
                        <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                          <h4 className="font-heading font-medium mb-2">Feature Requests</h4>
                          <p className="text-sm text-foreground/70">
                            Have an idea for a new calculator? We'd love to hear from you!
                          </p>
                        </div>
                        
                        <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                          <h4 className="font-heading font-medium mb-2">Partnership Inquiries</h4>
                          <p className="text-sm text-foreground/70">
                            Interested in integrating our tools? Let's discuss opportunities.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </section>
        </main>
        
        <Footer />
      </PageBackground>
    </>
  );
};

export default Contact;
