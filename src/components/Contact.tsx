'use client';

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
  const underlineTipRef = useRef<HTMLSpanElement>(null);

  const [copied, setCopied] = useState(false);
  const [lahoreTime, setLahoreTime] = useState<string>('');

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

    const main = underlineSvgRef.current;
    const svg = main.ownerSVGElement;
    const tip = underlineTipRef.current;
    if (!svg || !tip) return;
    const glow = svg.querySelector<SVGPathElement>('.contact-underline-glow');
    const accent = svg.querySelector<SVGPathElement>('.contact-underline-accent');

    // pathLength={1} normalises each stroke; dash 1 + gap 2 with offset 1 → 0 draws it
    // left to right. The gap is longer than the path so no second dash starts exactly at
    // the path end (a zero-length dash there still paints a round-cap dot). Opacity starts
    // at 0 for the same reason at the start of the path.
    gsap.set([glow, main, accent], { strokeDasharray: '1 2', strokeDashoffset: 1, opacity: 0 });
    gsap.set(tip, { opacity: 0, scale: 0.4 });

    // Glowing marker nib that rides the leading edge of the main stroke.
    // The SVG is stretched (preserveAspectRatio="none"), so map path units to pixels.
    const totalLength = main.getTotalLength();
    const placeTip = (p: number) => {
      const pt = main.getPointAtLength(p * totalLength);
      const host = svg.parentElement!.getBoundingClientRect();
      const box = svg.getBoundingClientRect();
      gsap.set(tip, {
        x: box.left - host.left + (pt.x * box.width) / 500,
        y: box.top - host.top + (pt.y * box.height) / 24,
      });
    };
    const stroke = { p: 0 };
    placeTip(0);

    // Starts once the headline's bottom edge (where the underline sits) is near the
    // middle of the screen so the swipe is actually seen; reverses on leave and replays
    // on every return. Triggered by the <h2>, not the SVG: the SVG lives inside a line
    // that has its own rise-in transform, which would skew the measured start.
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: headlineRef.current,
        start: 'bottom 70%',
        end: 'bottom 5%',
        toggleActions: 'play reverse play reverse',
      },
    });
    // Marker swipe: quick press, fast pull across, ease off at the end
    tl.to([glow, main], { opacity: 1, duration: 0.12, ease: 'none' }, 0)
      .to(tip, { opacity: 1, scale: 1, duration: 0.15, ease: 'power2.out' }, 0)
      .to(
        stroke,
        {
          p: 1,
          duration: 0.95,
          ease: 'power3.inOut',
          onUpdate: () => {
            gsap.set([glow, main], { strokeDashoffset: 1 - stroke.p });
            placeTip(stroke.p);
          },
        },
        0
      )
      .to(tip, { opacity: 0, scale: 0.4, duration: 0.25, ease: 'power2.in' }, 0.85)
      // Second, lighter pass a beat later, like going over it again
      .to(accent, { opacity: 1, duration: 0.12, ease: 'none' }, 0.6)
      .to(accent, { strokeDashoffset: 0, duration: 0.75, ease: 'power3.inOut' }, 0.6);

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  // Section reveals + ambient motion
  useEffect(() => {
    if (prefersReducedMotion() || !containerRef.current) return;

    // Every reveal plays on enter from either direction and reverses on leave,
    // so the section re-animates each time it scrolls into view
    const replay = { start: 'top 85%', end: 'bottom 10%', toggleActions: 'play reverse play reverse' };

    const ctx = gsap.context(() => {
      // Label + headline lines rise out of their masks
      gsap
        .timeline({ defaults: { ease: 'expo.out' }, scrollTrigger: { trigger: '.contact-label', ...replay } })
        .fromTo('.contact-label', { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.8 })
        .fromTo('.contact-label-line', { scaleX: 0 }, { scaleX: 1, duration: 0.8 }, '<0.2')
        .fromTo(
          '.contact-line',
          { yPercent: 110, opacity: 0, rotate: 4 },
          { yPercent: 0, opacity: 1, rotate: 0, duration: 1.2, stagger: 0.15, transformOrigin: 'left bottom' },
          '<0.1'
        );

      // Email banner zooms up out of a blur
      gsap.fromTo(
        '.contact-banner',
        { opacity: 0, y: 70, scale: 0.94, filter: 'blur(12px)' },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: 'blur(0px)',
          duration: 1.1,
          ease: 'expo.out',
          scrollTrigger: { trigger: '.contact-banner', ...replay },
        }
      );

      // Channel cards cascade in with a 3D flip, icons spin in after them
      gsap
        .timeline({ defaults: { ease: 'expo.out' }, scrollTrigger: { trigger: '.contact-sub', ...replay } })
        .fromTo('.contact-sub', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7 })
        .fromTo(
          '.contact-card',
          { opacity: 0, y: 60, rotateX: -35, scale: 0.92, filter: 'blur(10px)', transformPerspective: 900, transformOrigin: 'center top' },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            scale: 1,
            filter: 'blur(0px)',
            duration: 1,
            stagger: { each: 0.08, grid: 'auto', from: 'start' },
          },
          '<0.1'
        )
        .fromTo(
          '.contact-icon',
          { scale: 0, rotate: -120 },
          { scale: 1, rotate: 0, duration: 0.7, ease: 'back.out(2.2)', stagger: 0.08 },
          '<0.25'
        )
        .fromTo(
          '.contact-location',
          { opacity: 0, y: 30, filter: 'blur(8px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.9 },
          '-=0.6'
        );

      // Ambient motion: icons bob out of phase, a light sweep crosses the location strip
      gsap.utils.toArray<HTMLElement>('.contact-icon-float').forEach((icon, i) => {
        gsap.to(icon, { y: -4, duration: 1.6 + (i % 3) * 0.25, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: i * 0.15 });
      });
      gsap.fromTo(
        '.contact-location-sheen',
        { xPercent: -100 },
        { xPercent: 450, duration: 3.5, ease: 'power1.inOut', repeat: -1, repeatDelay: 2 }
      );
    }, containerRef);

    return () => ctx.revert();
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
        <div className="contact-label flex items-center gap-3 text-xs tracking-[0.2em] font-medium text-[#7B5CFF] uppercase mb-4">
          <span>(07) — CONTACT</span>
          <div className="contact-label-line h-[1px] w-12 bg-[#7B5CFF]/40 origin-left" />
        </div>

        {/* Giant Headline with Animated SVG Underline */}
        <div className="mb-16">
          <h2
            ref={headlineRef}
            className="font-display font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl uppercase tracking-tight text-[#F5F5F5] select-none leading-[0.95]"
          >
            <div className="overflow-hidden pb-[0.06em]">
              <div className="contact-line">LET&apos;S CREATE</div>
            </div>
            <div className="contact-line relative inline-block text-[#7B5CFF]">
              SOMETHING BOLD.
              {/* Hand-drawn marker underline: two strokes, both drawn left → right.
                  The glow is a wide translucent stroke rather than a CSS filter, which
                  would be re-rasterised on every frame of the draw and stutter. */}
              <svg
                className="absolute -bottom-4 sm:-bottom-6 left-0 w-[260px] sm:w-[420px] md:w-[520px] lg:w-[660px] max-w-full h-4 sm:h-6 pointer-events-none overflow-visible"
                viewBox="0 0 500 24"
                preserveAspectRatio="none"
                fill="none"
              >
                <path
                  className="contact-underline-glow"
                  d="M6 15C90 9 200 7 300 8S450 9 494 6"
                  pathLength={1}
                  stroke="#7B5CFF"
                  strokeOpacity="0.25"
                  strokeWidth="20"
                  strokeLinecap="round"
                />
                <path
                  ref={underlineSvgRef}
                  className="contact-underline"
                  d="M6 15C90 9 200 7 300 8S450 9 494 6"
                  pathLength={1}
                  stroke="#7B5CFF"
                  strokeWidth="9"
                  strokeLinecap="round"
                />
                <path
                  className="contact-underline-accent"
                  d="M30 22C150 16 300 15 470 17"
                  pathLength={1}
                  stroke="#B49CFF"
                  strokeOpacity="0.75"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
              {/* Marker nib (positioned by GSAP along the main stroke) */}
              <span
                ref={underlineTipRef}
                aria-hidden="true"
                className="absolute left-0 top-0 -ml-2 -mt-2 w-4 h-4 rounded-full bg-white shadow-[0_0_14px_5px_rgba(180,156,255,0.9)] pointer-events-none opacity-0"
              />
            </div>
          </h2>
        </div>

        {/* Email Hero Banner with Copy Button */}
        <div className="contact-banner mb-20 p-8 sm:p-12 rounded-3xl bg-[#1F1F1F] border border-[#2A2A2A] flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
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

        {/* Contact Channels */}
        <div>
          <h3 className="contact-sub font-display font-bold text-xl uppercase tracking-wider text-white mb-6">
            GET IN TOUCH
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {contactChannels.map((channel) => {
              const Icon = channel.icon;
              return (
                <a
                  key={channel.label}
                  href={channel.href}
                  target={channel.isExternal ? '_blank' : undefined}
                  rel={channel.isExternal ? 'noopener noreferrer' : undefined}
                  className="contact-card group flex items-center justify-between p-5 rounded-2xl bg-gradient-to-br from-[#1F1F1F] to-[#1A1A1A] border border-[#2A2A2A] hover:border-[#7B5CFF] hover:shadow-[0_0_30px_rgba(123,92,255,0.2)] hover:-translate-y-1 transition-[translate,border-color,box-shadow] duration-300 select-none"
                >
                  <div className="flex items-center gap-4">
                    <div className="contact-icon">
                      <div className="contact-icon-float p-2.5 rounded-xl bg-[#7B5CFF]/10 border border-[#7B5CFF]/30 text-[#7B5CFF] group-hover:bg-[#7B5CFF] group-hover:text-white group-hover:rotate-12 transition-[rotate,background-color,color] duration-300">
                        <Icon className="w-5 h-5" />
                      </div>
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

          {/* Location & Time Indicator */}
          <div className="contact-location relative overflow-hidden mt-6 p-6 rounded-2xl bg-[#1A1A1A] border border-[#2A2A2A]">
            {/* Slow light sweep */}
            <div aria-hidden="true" className="contact-location-sheen absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-[#7B5CFF]/15 to-transparent pointer-events-none" />
            <div className="relative flex items-center gap-2 text-xs font-mono text-[#9A9A9A] uppercase tracking-widest mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>LAHORE, PAKISTAN (UTC+5)</span>
            </div>
            <p className="relative text-sm text-[#F5F5F5] font-medium">
              Working with clients worldwide · Current Local Time: {lahoreTime || '14:32'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
