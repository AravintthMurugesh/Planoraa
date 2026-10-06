import React from 'react';
import { motion } from 'motion/react';

interface RevealTextProps {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  as?: 'span' | 'h1' | 'h2' | 'h3' | 'p';
}

export const RevealText: React.FC<RevealTextProps> = ({
  text,
  className = '',
  delay = 0,
  stagger = 0.055,
  as: Tag = 'span',
}) => {
  const words = text.split(' ');

  return (
    <Tag className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom">
          <motion.span
            className="inline-block will-change-transform"
            initial={{ y: '115%', rotate: 2.5 }}
            animate={{ y: 0, rotate: 0 }}
            transition={{
              delay: delay + i * stagger,
              duration: 0.75,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {word}
            {i < words.length - 1 ? '\u00A0' : ''}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
};