import type { ElementType, ComponentPropsWithoutRef, ReactNode } from 'react';

import { cn } from '@/lib/cn';

type GlassOwnProps<E extends ElementType> = {
  as?: E;
  /** The specular rim that gives the lens thickness. */
  edge?: boolean;
  /** Dispersive colour fringe — used sparingly, on hero surfaces only. */
  prism?: boolean;
  className?: string;
  children?: ReactNode;
};

export type GlassProps<E extends ElementType> = GlassOwnProps<E> &
  Omit<ComponentPropsWithoutRef<E>, keyof GlassOwnProps<E>>;

export function Glass<E extends ElementType = 'div'>({
  as,
  edge = true,
  prism = false,
  className,
  children,
  ...rest
}: GlassProps<E>) {
  const Component = (as ?? 'div') as ElementType;

  return (
    <Component
      className={cn(
        'glass relative rounded-glass',
        edge && 'glass-edge',
        prism && 'prism',
        className,
      )}
      {...rest}
    >
      {children}
    </Component>
  );
}
