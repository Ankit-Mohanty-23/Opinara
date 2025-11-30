import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { MessageSquare, Users, TrendingUp, Sparkles, CheckCircle, MapPin, Vote, Shield, Brain, ArrowRight, Menu, X, AlertCircle, Zap, Heart, Bell, Star } from 'lucide-react';

export default function OpinaraLanding() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: "Report Local Problems Instantly",
      desc: "Post about any issue affecting your area — electricity cuts, water supply, potholes, safety issues, and more.",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Collective Voice = Stronger Impact",
      desc: "When many people upvote the same complaint, it becomes a priority issue for your locality.",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Organized by Locality with Waves",
      desc: "Each Wave represents one place. Only issues that belong to your area. No random mix of posts.",
      color: "from-green-500 to-green-600"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Verified Users Only",
      desc: "Every user is verified to prevent spam, fake accounts, and irrelevant complaints.",
      color: "from-orange-500 to-orange-600"
    }
  ];

  const steps = [
    { num: "1", title: "Sign Up & Verify", desc: "Create an account and get verified", icon: <Shield className="w-5 h-5" /> },
    { num: "2", title: "Join a Wave", desc: "Find or create your locality's Wave", icon: <MapPin className="w-5 h-5" /> },
    { num: "3", title: "Post Issues", desc: "Share problems with your community", icon: <MessageSquare className="w-5 h-5" /> },
    { num: "4", title: "Vote Together", desc: "Upvote important issues", icon: <Vote className="w-5 h-5" /> },
    { num: "5", title: "AI Analysis", desc: "Get smart summaries", icon: <Brain className="w-5 h-5" /> },
    { num: "6", title: "Track Progress", desc: "See issues getting resolved", icon: <TrendingUp className="w-5 h-5" /> }
  ];

  const useCases = [
    { title: "Electricity blackouts", icon: "⚡", severity: "critical" },
    { title: "Road damage", icon: "🚧", severity: "high" },
    { title: "Water shortage", icon: "💧", severity: "critical" },
    { title: "Garbage overflow", icon: "🗑️", severity: "medium" },
    { title: "Streetlight issues", icon: "💡", severity: "medium" },
    { title: "Safety concerns", icon: "🚨", severity: "high" },
    { title: "Stray animals", icon: "🐕", severity: "low" },
    { title: "Drainage problems", icon: "🌊", severity: "high" }
  ];

  const testimonials = [
    { name: "Priya Sharma", location: "Mumbai", quote: "Finally got our streetlight fixed after 6 months!", votes: 234 },
    { name: "Rajesh Kumar", location: "Delhi", quote: "The AI summary helped us prioritize real issues", votes: 189 },
    { name: "Anjali Patel", location: "Bangalore", quote: "Our community is more connected than ever", votes: 156 }
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Header */}
      <header className={`fixed w-full top-0 z-50 transition-all duration-500 ${scrolled ? 'bg-white shadow-lg' : 'bg-white/95 backdrop-blur'}`}>
        <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#007BFF] to-[#0056D2] rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-[#212529]">
              Opinara<span className="text-[#007BFF]">.</span>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-[#212529] hover:text-[#007BFF] transition font-medium">Features</a>
            <a href="#how-it-works" className="text-[#212529] hover:text-[#007BFF] transition font-medium">How It Works</a>
            <a href="#waves" className="text-[#212529] hover:text-[#007BFF] transition font-medium">Waves</a>
            <a href="#testimonials" className="text-[#212529] hover:text-[#007BFF] transition font-medium">Stories</a>
            <button onClick={() => navigate("/login")} className="bg-gradient-to-r from-[#007BFF] to-[#0056D2] hover:shadow-lg text-white px-6 py-2.5 rounded-lg font-semibold transition transform hover:scale-105">
              Get Started →
            </button>
          </div>

          <button className="md:hidden text-[#212529]" onClick={() => setMobileMenu(!mobileMenu)}>
            {mobileMenu ? <X /> : <Menu />}
          </button>
        </nav>

        {mobileMenu && (
          <div className="md:hidden bg-white border-t px-6 py-4 shadow-lg">
            <a href="#features" className="block text-[#212529] py-3 hover:text-[#007BFF] font-medium">Features</a>
            <a href="#how-it-works" className="block text-[#212529] py-3 hover:text-[#007BFF] font-medium">How It Works</a>
            <a href="#waves" className="block text-[#212529] py-3 hover:text-[#007BFF] font-medium">Waves</a>
            <a href="#testimonials" className="block text-[#212529] py-3 hover:text-[#007BFF] font-medium">Stories</a>
            <button onClick={() => navigate("/login")} className="mt-3 w-full bg-gradient-to-r from-[#007BFF] to-[#0056D2] text-white px-6 py-3 rounded-lg font-semibold">
              Get Started →
            </button>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-br from-[#007BFF] via-[#0056D2] to-[#003d99] text-white overflow-hidden relative">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#FFC107] rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur text-white px-4 py-2 rounded-full text-sm font-semibold border border-white/30">
                <Zap className="w-4 h-4 text-[#FFC107]" />
                AI-Powered Community Platform
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Give a Voice to Your <span className="text-[#FFC107] inline-block animate-pulse">Locality</span>
              </h1>
              
              <p className="text-xl text-white/90 leading-relaxed">
                Join thousands of residents making their communities better. Report issues, vote together, and watch your locality transform.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <button onClick={() => navigate("/login")} className="bg-white hover:bg-[#F8F9FA] text-[#007BFF] px-8 py-4 rounded-lg font-bold text-lg transition transform hover:scale-105 shadow-2xl flex items-center gap-2">
                  Join Your Wave <ArrowRight className="w-5 h-5" />
                </button>
                <button className="border-2 border-white hover:bg-white/10 text-white px-8 py-4 rounded-lg font-bold text-lg transition backdrop-blur">
                  Watch Demo
                </button>
              </div>
              
              <div className="grid grid-cols-3 gap-6 pt-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-[#FFC107] mb-1">10K+</div>
                  <div className="text-white/80 text-sm">Active Users</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-[#FFC107] mb-1">500+</div>
                  <div className="text-white/80 text-sm">Waves Created</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-[#FFC107] mb-1">25K+</div>
                  <div className="text-white/80 text-sm">Issues Resolved</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white rounded-2xl p-6 shadow-2xl transform hover:scale-105 transition duration-500">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#007BFF] to-[#0056D2] rounded-xl flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-[#212529]">Delhi Wave</div>
                      <div className="text-sm text-gray-500">1,234 members · Active now</div>
                    </div>
                  </div>
                  <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                    Live
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-[#F8F9FA] to-gray-100 rounded-xl p-4 mb-4">
                  <div className="text-[#212529] font-semibold mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#007BFF]" />
                    Trending Issues This Week
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-red-200 hover:border-red-400 transition cursor-pointer">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-[#212529] flex-1 text-sm font-medium">Power outage - Main Street</span>
                      <span className="text-[#007BFF] font-bold text-sm flex items-center gap-1">
                        <ArrowRight className="w-3 h-3 rotate-[-45deg]" />
                        234
                      </span>
                    </div>
                    <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-orange-200 hover:border-orange-400 transition cursor-pointer">
                      <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                      <span className="text-[#212529] flex-1 text-sm font-medium">Water supply disruption</span>
                      <span className="text-[#007BFF] font-bold text-sm flex items-center gap-1">
                        <ArrowRight className="w-3 h-3 rotate-[-45deg]" />
                        189
                      </span>
                    </div>
                    <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-yellow-200 hover:border-yellow-400 transition cursor-pointer">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                      <span className="text-[#212529] flex-1 text-sm font-medium">Pothole near school</span>
                      <span className="text-[#007BFF] font-bold text-sm flex items-center gap-1">
                        <ArrowRight className="w-3 h-3 rotate-[-45deg]" />
                        156
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-[#007BFF] to-[#0056D2] text-white rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="w-5 h-5" />
                    <span className="font-bold">AI Smart Summary</span>
                    <span className="ml-auto bg-white/20 px-2 py-0.5 rounded text-xs">Updated 2m ago</span>
                  </div>
                  <p className="text-sm opacity-95 leading-relaxed">
                    Your locality is facing critical power and water issues. 423 residents have reported problems this week. Priority action needed on electricity infrastructure.
                  </p>
                </div>
              </div>
              
              <div className="absolute -top-4 -right-4 bg-[#FFC107] text-[#212529] px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-bounce">
                🔥 Trending
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block bg-blue-100 text-[#007BFF] px-4 py-2 rounded-full text-sm font-semibold mb-4">
              ⭐ Why Choose Opinara
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#212529] mb-4">Everything You Need to Amplify Your Voice</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to make community collaboration effortless
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="group relative bg-gradient-to-br from-[#F8F9FA] to-white p-8 rounded-2xl border border-gray-200 hover:border-[#007BFF] transition-all duration-300 hover:shadow-xl">
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-[#212529] mb-3">{feature.title}</h3>
                <p className="text-gray-700 leading-relaxed">{feature.desc}</p>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight className="w-5 h-5 text-[#007BFF]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              🚀 Simple Process
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#212529] mb-4">Get Started in 6 Easy Steps</h2>
            <p className="text-xl text-gray-600">
              From signup to impact in minutes
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((step, idx) => (
              <div key={idx} className="relative">
                <div className="bg-white p-6 rounded-xl border-2 border-gray-200 hover:border-[#007BFF] transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#007BFF] to-[#0056D2] rounded-full flex items-center justify-center text-white text-xl font-bold">
                      {step.num}
                    </div>
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-[#007BFF]">
                      {step.icon}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-[#212529] mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm">{step.desc}</p>
                </div>
                
                {idx < steps.length - 1 && idx % 3 !== 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                    <div className="w-6 h-6 bg-[#007BFF] rounded-full flex items-center justify-center">
                      <ArrowRight className="w-4 h-4 text-white" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Waves Explanation */}
      <section id="waves" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <div className="inline-block bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                🌊 Core Feature
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-[#212529] mb-6">What Is a Wave?</h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                A Wave is your locality's dedicated community space — think of it as a subreddit for your neighborhood where real change happens.
              </p>
              
              <div className="space-y-4 mb-8">
                {[
                  "Create and discuss local issue posts",
                  "Vote on what matters most",
                  "Share updates with neighbors",
                  "Track issue resolution in real-time",
                  "Get AI-powered community insights"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 group">
                    <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-green-500 transition">
                      <CheckCircle className="w-4 h-4 text-green-600 group-hover:text-white transition" />
                    </div>
                    <span className="text-gray-700 font-medium">{item}</span>
                  </div>
                ))}
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border-l-4 border-[#007BFF]">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-5 h-5 text-[#FFC107]" />
                  <span className="font-bold text-[#212529]">Example Wave</span>
                </div>
                <p className="text-gray-700">
                  <span className="font-bold text-[#007BFF]">Delhi Wave</span> → A dedicated space for all Delhi residents to collaborate and solve local issues together
                </p>
              </div>
            </div>
            
            <div className="order-1 md:order-2">
              <div className="relative">
                <div className="bg-gradient-to-br from-[#F8F9FA] to-white rounded-2xl p-8 border-2 border-gray-200 shadow-xl">
                  <div className="bg-gradient-to-r from-[#007BFF] to-[#0056D2] text-white rounded-xl p-6 mb-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-lg flex items-center justify-center">
                        <Brain className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="font-bold text-lg">AI Wave Summary</div>
                        <div className="text-xs opacity-80">Generated in real-time</div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="bg-white/10 backdrop-blur rounded-lg p-3 border border-white/20">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-sm">Electricity Issues</span>
                          <span className="bg-red-500 text-white px-2 py-0.5 rounded text-xs">Critical</span>
                        </div>
                        <div className="text-xs opacity-90">45 posts · 234 upvotes</div>
                      </div>
                      
                      <div className="bg-white/10 backdrop-blur rounded-lg p-3 border border-white/20">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-sm">Water Supply</span>
                          <span className="bg-orange-500 text-white px-2 py-0.5 rounded text-xs">High</span>
                        </div>
                        <div className="text-xs opacity-90">38 posts · 189 upvotes</div>
                      </div>
                      
                      <div className="bg-white/10 backdrop-blur rounded-lg p-3 border border-white/20">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-sm">Road Maintenance</span>
                          <span className="bg-yellow-500 text-white px-2 py-0.5 rounded text-xs">Medium</span>
                        </div>
                        <div className="text-xs opacity-90">29 posts · 156 upvotes</div>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-white/20 text-xs opacity-90">
                      📊 Analyzed 112 posts from 423 residents over 7 days
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm text-gray-600 font-medium">
                      AI instantly shows you what your entire community is talking about
                    </p>
                  </div>
                </div>
                
                <div className="absolute -top-4 -left-4 bg-[#FFC107] text-[#212529] px-4 py-2 rounded-lg text-sm font-bold shadow-lg">
                  ⚡ Live Updates
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 px-6 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              💡 Real Problems
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#212529] mb-4">What Can You Report?</h2>
            <p className="text-xl text-gray-600">
              If it affects your locality, raise it on Opinara
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            {useCases.map((useCase, idx) => (
              <div key={idx} className="group bg-white p-6 rounded-xl border-2 border-gray-200 hover:border-[#007BFF] transition-all duration-300 hover:shadow-lg text-center cursor-pointer">
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {useCase.icon}
                </div>
                <div className="font-semibold text-[#212529] mb-2">{useCase.title}</div>
                <div className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                  useCase.severity === 'critical' ? 'bg-red-100 text-red-700' :
                  useCase.severity === 'high' ? 'bg-orange-100 text-orange-700' :
                  useCase.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {useCase.severity}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block bg-pink-100 text-pink-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              ❤️ Community Stories
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#212529] mb-4">Real People, Real Impact</h2>
            <p className="text-xl text-gray-600">
              See how communities are transforming with Opinara
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="bg-gradient-to-br from-[#F8F9FA] to-white p-6 rounded-xl border border-gray-200 hover:border-[#007BFF] transition hover:shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#007BFF] to-[#0056D2] rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-[#212529]">{testimonial.name}</div>
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {testimonial.location}
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.quote}"</p>
                <div className="flex items-center gap-2 text-sm">
                  <div className="flex items-center gap-1 bg-blue-100 text-[#007BFF] px-3 py-1 rounded-full font-semibold">
                    <ArrowRight className="w-3 h-3 rotate-[-45deg]" />
                    {testimonial.votes}
                  </div>
                  <span className="text-gray-500">community upvotes</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-[#007BFF] via-[#0056D2] to-[#003d99] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-72 h-72 bg-[#FFC107] rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-block bg-white/20 backdrop-blur text-white px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-white/30">
            🚀 Join the Movement
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Give Your Locality a Voice?
          </h2>
          <p className="text-xl text-white/90 mb-10 leading-relaxed">
            Join thousands of residents making their communities better, one Wave at a time. Your voice matters. Your community needs you.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <button onClick={() => navigate("/login")} className="bg-white hover:bg-[#F8F9FA] text-[#007BFF] px-10 py-5 rounded-lg font-bold text-lg transition transform hover:scale-105 shadow-2xl flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Join Your Wave Today
            </button>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-[#FFC107]" />
              <span>Free to use</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-[#FFC107]" />
              <span>Verified community</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-[#FFC107]" />
              <span>AI-powered insights</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-[#FFC107]" />
              <span>Real impact</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#212529] text-gray-400 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-[#007BFF] to-[#0056D2] rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-white">
                  Opinara<span className="text-[#007BFF]">.</span>
                </div>
              </div>
              <p className="text-sm leading-relaxed mb-4">
                AI-powered community platform for your locality. Rise Together. Fix Together.
              </p>
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-gray-700 hover:bg-[#007BFF] rounded-lg flex items-center justify-center cursor-pointer transition">
                  <span className="text-xs font-bold">f</span>
                </div>
                <div className="w-8 h-8 bg-gray-700 hover:bg-[#007BFF] rounded-lg flex items-center justify-center cursor-pointer transition">
                  <span className="text-xs font-bold">t</span>
                </div>
                <div className="w-8 h-8 bg-gray-700 hover:bg-[#007BFF] rounded-lg flex items-center justify-center cursor-pointer transition">
                  <span className="text-xs font-bold">in</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-4">Product</h4>
              <div className="space-y-3 text-sm">
                <div className="hover:text-[#007BFF] cursor-pointer transition">Features</div>
                <div className="hover:text-[#007BFF] cursor-pointer transition">How It Works</div>
                <div className="hover:text-[#007BFF] cursor-pointer transition">Waves</div>
                <div className="hover:text-[#007BFF] cursor-pointer transition">Pricing</div>
                <div className="hover:text-[#007BFF] cursor-pointer transition">Mobile App</div>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-4">Company</h4>
              <div className="space-y-3 text-sm">
                <div className="hover:text-[#007BFF] cursor-pointer transition">About Us</div>
                <div className="hover:text-[#007BFF] cursor-pointer transition">Careers</div>
                <div className="hover:text-[#007BFF] cursor-pointer transition">Blog</div>
                <div className="hover:text-[#007BFF] cursor-pointer transition">Press Kit</div>
                <div className="hover:text-[#007BFF] cursor-pointer transition">Contact</div>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-4">Legal</h4>
              <div className="space-y-3 text-sm">
                <div className="hover:text-[#007BFF] cursor-pointer transition">Privacy Policy</div>
                <div className="hover:text-[#007BFF] cursor-pointer transition">Terms of Service</div>
                <div className="hover:text-[#007BFF] cursor-pointer transition">Cookie Policy</div>
                <div className="hover:text-[#007BFF] cursor-pointer transition">Community Guidelines</div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
              <p>© 2025 Opinara. All rights reserved.</p>
              <p className="text-gray-500">One Wave. One Community. One Voice.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}