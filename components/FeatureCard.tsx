'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { useState } from 'react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  index: number;
}

export default function FeatureCard({ icon: Icon, title, description, index }: FeatureCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative group"
    >
      <div className="holographic-card p-8 rounded-lg border border-border/50 relative overflow-hidden">
        {/* Glassmorphic overlay on hover */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="absolute inset-0 bg-gradient-to-br from-accent-blue/5 to-accent-cyan/5 backdrop-blur-xl"
        />

        {/* Animated border glow */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="absolute inset-0 rounded-lg"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(14, 165, 233, 0.3), transparent)',
            backgroundSize: '200% 100%',
          }}
        />

        <div className="relative z-10">
          {/* Icon */}
          <motion.div
            animate={{
              scale: isHovered ? 1.1 : 1,
              rotate: isHovered ? 5 : 0,
            }}
            className="w-12 h-12 bg-accent-blue/10 rounded-lg flex items-center justify-center mb-6 relative"
          >
            <Icon className="w-6 h-6 text-accent-blue" />
            {isHovered && (
              <motion.div
                initial={{ scale: 1, opacity: 0.5 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="absolute inset-0 bg-accent-blue/30 rounded-lg"
              />
            )}
          </motion.div>

          <h3 className="text-xl font-semibold mb-3">{title}</h3>
          <p className="text-zinc-400 leading-relaxed">{description}</p>
        </div>

        {/* Corner accent */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: isHovered ? 0.3 : 0, scale: isHovered ? 1 : 0 }}
          className="absolute top-0 right-0 w-20 h-20 bg-accent-cyan blur-3xl rounded-full"
        />
      </div>
    </motion.div>
  );
}
