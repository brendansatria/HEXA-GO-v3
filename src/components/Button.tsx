import React from 'react';
import { Button as ShadcnButton, type ButtonProps } from '@/components/ui/button';
import { useSound } from '@/context/SoundContext';

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ onClick, ...props }, ref) => {
    const { playClickSound } = useSound();

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      playClickSound();
      if (onClick) {
        onClick(event);
      }
    };

    return <ShadcnButton ref={ref} onClick={handleClick} {...props} />;
  }
);

Button.displayName = 'Button';

export { Button };