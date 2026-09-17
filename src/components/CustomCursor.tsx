import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

export const CustomCursor: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hoverText, setHoverText] = useState<string | null>(null);

  // Smooth mouse coordinates with physics spring
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { damping: 28, stiffness: 350, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Only activate cursor on devices that support hover (non-touch/fine pointer)
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!hasFinePointer) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    const handlePointerOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Check if element or ancestor is clickable / interactive
      const interactiveEl = target.closest(
        'button, a, input, select, textarea, [role="button"], [data-cursor], .cursor-pointer'
      ) as HTMLElement | null;

      if (interactiveEl) {
        setIsHovered(true);
        const customText = interactiveEl.getAttribute('data-cursor');
        if (customText) {
          setHoverText(customText);
        } else if (
          interactiveEl.tagName === 'BUTTON' &&
          (interactiveEl.textContent?.includes('ACHETER') ||
            interactiveEl.textContent?.includes('COMMANDER'))
        ) {
          setHoverText('BUY');
        } else if (interactiveEl.getAttribute('data-testid')?.includes('panel')) {
          setHoverText('OPEN');
        } else {
          setHoverText(null);
        }
      } else {
        setIsHovered(false);
        setHoverText(null);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseover', handlePointerOver, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseover', handlePointerOver);
    };
  }, [isVisible, mouseX, mouseY]);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[99999] overflow-hidden">
      {/* Outer reactive ring / bracket box */}
      <motion.div
        className="absolute -left-6 -top-6 flex items-center justify-center rounded-full border border-[#F5F5F0]/40 backdrop-blur-[1px] transition-[border-color,background-color] duration-200"
        style={{
          x: smoothX,
          y: smoothY,
          width: isHovered ? (hoverText ? 76 : 58) : 26,
          height: isHovered ? (hoverText ? 76 : 58) : 26,
          transform: 'translate(-50%, -50%)',
          borderColor: isHovered ? '#D4FF00' : 'rgba(245, 245, 240, 0.4)',
          backgroundColor: isHovered ? 'rgba(212, 255, 0, 0.08)' : 'transparent',
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      >
        {/* Subtle Tech Corner Ticks on hover */}
        {isHovered && !hoverText && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="h-1.5 w-1.5 rounded-full bg-[#D4FF00] shadow-[0_0_8px_#D4FF00]" />
          </div>
        )}

        {/* Dynamic Contextual Text Label */}
        {hoverText && (
          <span className="font-ui text-[9px] font-bold uppercase tracking-[.24em] text-[#D4FF00] select-none">
            {hoverText}
          </span>
        )}
      </motion.div>

      {/* Center precise pinpoint dot */}
      <motion.div
        className="absolute h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D4FF00] shadow-[0_0_10px_#D4FF00]"
        style={{
          x: mouseX,
          y: mouseY,
          opacity: isHovered && hoverText ? 0 : 1,
        }}
        transition={{ duration: 0.1 }}
      />
    </div>
  );
};
