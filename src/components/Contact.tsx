import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PORTFOLIO_LINKS } from '../data/portfolio';
import { MagneticButton } from './MagneticButton';
import { prefersReducedMotion } from '../lib/motion';
import {
  Mail,
  Phone,
  MessageSquare,
  ArrowUpRight,
  Copy,
  Send,
  Check,
  Instagram,
  Linkedin,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface ContactProps {
  onShowToast: (text: string, type?: 'success' | 'info' | 'error') => void;
}

export const Contact: React.FC<ContactProps> = ({ onShowToast }) => {
  const containerRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const underlineSvgRef = useRef<SVGPathElement>(null);

  const [copied, setCopied] = useState(false);
  const [lahoreTime, setLahoreTime] = useState<string>('');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: 'Branding',
    budget: '$500 – $1,500',
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [shakeFields, setShakeFields] = useState<Record<string, boolean>>({});

  // Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setLahoreTime(
        now.toLocaleTimeString('en-US', {
          timeZone: 'Asia/Karachi',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // Animate underline and headline
  useEffect(() => {
    if (prefersReducedMotion() || !underlineSvgRef.current) return;

    const path = underlineSvgRef.current;
    const length = path.getTotalLength();
    path.style.strokeDasharray = `${length}`;
    path.style.strokeDashoffset = `${length}`;

    gsap.to(path, {
      strokeDashoffset: 0,
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: headlineRef.current,
        start: 'top 75%',
        once: true,
      },
    });
  }, []);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PORTFOLIO_LINKS.emailAddress);
      setCopied(true);
      onShowToast('Email copied to clipboard ✓', 'success');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      onShowToast('Could not copy email', 'error');
    }
  };

  const handleInputChange = (field: string, val: string) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    const newShakes: Record<string, boolean> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Please provide your name';
      newShakes.name = true;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      newErrors.email = 'Please provide a valid email address';
      newShakes.email = true;
    }
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      newErrors.message = 'Please share a brief message (min 10 characters)';
      newShakes.message = true;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setShakeFields(newShakes);
      setTimeout(() => setShakeFields({}), 600);
      onShowToast('Please fill all required fields correctly', 'error');
      return;
    }

    // Build URL-encoded mailto
    const subject = encodeURIComponent(
      `Project Inquiry — ${formData.projectType} from ${formData.name}`
    );
    const bodyContent = `Name: ${formData.name}
Email: ${formData.email}
Project Type: ${formData.projectType}
Budget: ${formData.budget}

Project Brief:
${formData.message}`;

    const mailtoUrl = `mailto:${PORTFOLIO_LINKS.emailAddress}?subject=${subject}&body=${encodeURIComponent(
      bodyContent
    )}`;

    onShowToast('Opening your email app…', 'info');
    window.location.href = mailtoUrl;
  };

  const contactChannels = [
    {
      label: 'Email',
      value: 'abrehmn02@gmail.com',
      href: PORTFOLIO_LINKS.email,
      icon: Mail,
      isExternal: false,
    },
    {
      label: 'Phone',
      value: '(+92) 302 9206760',
      href: PORTFOLIO_LINKS.phone,
      icon: Phone,
      isExternal: false,
    },
    {
      label: 'WhatsApp',
      value: '+92 302 9206760',
      href: PORTFOLIO_LINKS.whatsapp,
      icon: MessageSquare,
      isExternal: true,
    },
    {
      label: 'Behance',
      value: 'behance.net/abdullife',
      href: PORTFOLIO_LINKS.behance,
      icon: ArrowUpRight,
      isExternal: true,
    },
    {
      label: 'Instagram',
      value: '@kagenoink',
      href: PORTFOLIO_LINKS.instagram,
      icon: Instagram,
      isExternal: true,
    },
    {
      label: 'LinkedIn',
      value: 'Abdul Rehman',
      href: PORTFOLIO_LINKS.linkedin,
      icon: Linkedin,
      isExternal: true,
    },
  ];

  return (
    <section
      id="contact"
      ref={containerRef}
      className="relative py-28 px-6 md:px-12 bg-[#161616] text-[#F5F5F5] border-t border-[#2A2A2A]"
    >
      <div className="max-w-[1440px] mx-auto">
        {/* Section Label */}
        <div className="flex items-center gap-3 text-xs tracking-[0.2em] font-medium text-[#7B5CFF] uppercase mb-4">
          <span>(07) — CONTACT</span>
          <div className="h-[1px] w-12 bg-[#7B5CFF]/40" />
        </div>

        {/* Giant Headline with Animated SVG Underline */}
        <div className="mb-16">
          <h2
            ref={headlineRef}
            className="font-display font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl uppercase tracking-tight text-[#F5F5F5] select-none leading-[0.95]"
          >
            <div>LET&apos;S CREATE</div>
            <div className="relative inline-block text-[#7B5CFF]">
              SOMETHING BOLD.
              {/* Hand-drawn SVG underline */}
              <svg
                className="absolute -bottom-4 sm:-bottom-6 left-0 w-full h-4 sm:h-6 pointer-events-none overflow-visible"
                viewBox="0 0 500 24"
                fill="none"
              >
                <path
                  ref={underlineSvgRef}
                  d="M4 14C120 4 360 2 496 18C380 12 180 8 20 22"
                  stroke="#7B5CFF"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </h2>
        </div>

        {/* Email Hero Banner with Copy Button */}
        <div className="mb-20 p-8 sm:p-12 rounded-3xl bg-[#1F1F1F] border border-[#2A2A2A] flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-[#9A9A9A] font-semibold block mb-2">
              PRIMARY DIRECT INBOX
            </span>
            <a
              href={PORTFOLIO_LINKS.email}
              className="group font-display font-extrabold text-2xl sm:text-4xl md:text-5xl text-[#F5F5F5] hover:text-[#7B5CFF] transition-colors inline-flex items-center gap-3 break-all"
            >
              <span>{PORTFOLIO_LINKS.emailAddress}</span>
              <ArrowUpRight className="w-6 h-6 md:w-8 md:h-8 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </a>
          </div>

          <MagneticButton
            onClick={handleCopyEmail}
            variant="secondary"
            className="px-6 py-3.5 text-xs font-mono uppercase tracking-wider shrink-0"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>COPIED!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-[#7B5CFF]" />
                <span>COPY EMAIL</span>
              </>
            )}
          </MagneticButton>
        </div>

        {/* Main Grid: Contact Channels (5 cols) & Contact Form (7 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          {/* Channels Grid (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <h3 className="font-display font-bold text-xl uppercase tracking-wider text-white mb-6">
                GET IN TOUCH
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                {contactChannels.map((channel) => {
                  const Icon = channel.icon;
                  return (
                    <a
                      key={channel.label}
                      href={channel.href}
                      target={channel.isExternal ? '_blank' : undefined}
                      rel={channel.isExternal ? 'noopener noreferrer' : undefined}
                      className="group flex items-center justify-between p-4 rounded-2xl bg-[#1F1F1F] border border-[#2A2A2A] hover:border-[#7B5CFF] hover:-translate-y-1 transition-all duration-300 select-none"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2.5 rounded-xl bg-[#161616] border border-[#2A2A2A] text-[#7B5CFF] group-hover:rotate-12 transition-transform duration-300">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-xs font-mono text-[#9A9A9A] uppercase tracking-wider">
                            {channel.label}
                          </div>
                          <div className="text-sm font-medium text-white group-hover:text-[#7B5CFF] transition-colors">
                            {channel.value}
                          </div>
                        </div>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-[#5C5C5C] group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Location & Time Indicator */}
            <div className="mt-8 p-6 rounded-2xl bg-[#161616] border border-[#2A2A2A]">
              <div className="flex items-center gap-2 text-xs font-mono text-[#9A9A9A] uppercase tracking-widest mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>LAHORE, PAKISTAN (UTC+5)</span>
              </div>
              <p className="text-sm text-[#F5F5F5] font-medium">
                Working with clients worldwide · Current Local Time: {lahoreTime || '14:32'}
              </p>
            </div>
          </div>

          {/* Form (7 cols) */}
          <div className="lg:col-span-7 p-8 sm:p-12 rounded-3xl bg-[#1F1F1F] border border-[#2A2A2A]">
            <h3 className="font-display font-bold text-2xl uppercase tracking-wider text-white mb-2">
              SEND A BRIEF
            </h3>
            <p className="text-sm text-[#9A9A9A] mb-8">
              Fill out the details below to generate a direct project inquiry.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {/* Name & Email Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Name */}
                <div
                  className={`flex flex-col gap-1 ${
                    shakeFields.name ? 'animate-bounce' : ''
                  }`}
                >
                  <label
                    htmlFor="name"
                    className="text-xs font-mono tracking-widest uppercase text-[#9A9A9A]"
                  >
                    YOUR NAME *
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full bg-[#161616] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#7B5CFF] transition-colors"
                  />
                  {errors.name && (
                    <span className="text-xs text-red-400 mt-1">{errors.name}</span>
                  )}
                </div>

                {/* Email */}
                <div
                  className={`flex flex-col gap-1 ${
                    shakeFields.email ? 'animate-bounce' : ''
                  }`}
                >
                  <label
                    htmlFor="email"
                    className="text-xs font-mono tracking-widest uppercase text-[#9A9A9A]"
                  >
                    YOUR EMAIL *
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="name@company.com"
                    className="w-full bg-[#161616] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#7B5CFF] transition-colors"
                  />
                  {errors.email && (
                    <span className="text-xs text-red-400 mt-1">{errors.email}</span>
                  )}
                </div>
              </div>

              {/* Project Type & Budget Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Project Type */}
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="projectType"
                    className="text-xs font-mono tracking-widest uppercase text-[#9A9A9A]"
                  >
                    PROJECT TYPE
                  </label>
                  <select
                    id="projectType"
                    value={formData.projectType}
                    onChange={(e) => handleInputChange('projectType', e.target.value)}
                    className="w-full bg-[#161616] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#7B5CFF] transition-colors select-none"
                  >
                    <option value="Branding">Branding &amp; Identity</option>
                    <option value="Social Media">Social Media Campaigns</option>
                    <option value="Ad Creatives">Ad Creatives &amp; Marketing</option>
                    <option value="Packaging">Packaging &amp; 3D Mockups</option>
                    <option value="UI/UX">UI/UX Presentations</option>
                    <option value="Video">Short-Form Video</option>
                    <option value="Other">Other Design Work</option>
                  </select>
                </div>

                {/* Budget */}
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="budget"
                    className="text-xs font-mono tracking-widest uppercase text-[#9A9A9A]"
                  >
                    ESTIMATED BUDGET
                  </label>
                  <select
                    id="budget"
                    value={formData.budget}
                    onChange={(e) => handleInputChange('budget', e.target.value)}
                    className="w-full bg-[#161616] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#7B5CFF] transition-colors select-none"
                  >
                    <option value="<$500">&lt; $500</option>
                    <option value="$500 – $1,500">$500 – $1,500</option>
                    <option value="$1,500 – $3,000">$1,500 – $3,000</option>
                    <option value="$3,000+">$3,000+</option>
                  </select>
                </div>
              </div>

              {/* Message */}
              <div
                className={`flex flex-col gap-1 ${
                  shakeFields.message ? 'animate-bounce' : ''
                }`}
              >
                <label
                  htmlFor="message"
                  className="text-xs font-mono tracking-widest uppercase text-[#9A9A9A]"
                >
                  PROJECT OVERVIEW *
                </label>
                <textarea
                  id="message"
                  rows={4}
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  placeholder="Tell me about your goals, timelines, and deliverables..."
                  className="w-full bg-[#161616] border border-[#2A2A2A] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#7B5CFF] transition-colors resize-none"
                />
                {errors.message && (
                  <span className="text-xs text-red-400 mt-1">{errors.message}</span>
                )}
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <MagneticButton
                  type="submit"
                  variant="primary"
                  className="w-full py-4 text-xs font-bold uppercase tracking-wider"
                >
                  <span>Submit Inquiry</span>
                  <Send className="w-4 h-4 ml-1" />
                </MagneticButton>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
