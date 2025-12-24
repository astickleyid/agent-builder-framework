'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import TerminalIcon from '@/components/icons/TerminalIcon';
import GithubIcon from '@/components/icons/GithubIcon';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass-morphic shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <motion.div 
              className="flex items-center gap-2 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="relative">
                <TerminalIcon className="w-5 h-5 sm:w-6 sm:h-6 text-accent-blue" />
              </div>
              <span className="text-lg sm:text-xl font-semibold tracking-tight">stick.ai</span>
            </motion.div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            <a href="#features" className="text-sm text-zinc-400 hover:text-white transition-colors">
              Features
            </a>
            <Link href="/docs" className="text-sm text-zinc-400 hover:text-white transition-colors">
              Docs
            </Link>
            <Link href="/examples" className="text-sm text-zinc-400 hover:text-white transition-colors">
              Examples
            </Link>
            <a href="#pricing" className="text-sm text-zinc-400 hover:text-white transition-colors">
              Pricing
            </a>
            <a href="https://github.com/astickleyid/agent-builder-framework" target="_blank" rel="noopener noreferrer">
              <GithubIcon className="w-5 h-5 text-zinc-400 hover:text-white transition-colors" />
            </a>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/docs/quick-start"
                className="px-4 py-2 bg-accent-blue hover:bg-accent-blue/90 text-white rounded-md text-sm font-medium transition-all"
              >
                Get Started
              </Link>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-zinc-400 hover:text-white transition-colors"
            whileTap={{ scale: 0.95 }}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden mt-4 pb-4 border-t border-border overflow-hidden"
            >
              <div className="flex flex-col gap-4 mt-4">
                <a 
                  href="#features" 
                  className="text-zinc-400 hover:text-white transition-colors py-2"
                  onClick={() => setIsOpen(false)}
                >
                  Features
                </a>
                <Link 
                  href="/docs" 
                  className="text-zinc-400 hover:text-white transition-colors py-2"
                  onClick={() => setIsOpen(false)}
                >
                  Docs
                </Link>
                <Link 
                  href="/examples" 
                  className="text-zinc-400 hover:text-white transition-colors py-2"
                  onClick={() => setIsOpen(false)}
                >
                  Examples
                </Link>
                <a 
                  href="#pricing" 
                  className="text-zinc-400 hover:text-white transition-colors py-2"
                  onClick={() => setIsOpen(false)}
                >
                  Pricing
                </a>
                <a 
                  href="https://github.com/astickleyid/agent-builder-framework" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-zinc-400 hover:text-white transition-colors py-2 flex items-center gap-2"
                  onClick={() => setIsOpen(false)}
                >
                  <GithubIcon className="w-5 h-5" />
                  GitHub
                </a>
                <Link 
                  href="/docs/quick-start" 
                  className="px-4 py-3 bg-accent-blue hover:bg-accent-blue/90 text-white rounded-md text-sm font-medium transition-all text-center mt-2"
                  onClick={() => setIsOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
