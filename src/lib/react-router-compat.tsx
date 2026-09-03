'use client';

import React from 'react';
import NextLink from 'next/link';
import {
  useRouter,
  usePathname,
  useParams as useNextParams,
  useSearchParams as useNextSearchParams,
} from 'next/navigation';

export interface LinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'className' | 'children'> {
  to?: string;
  href?: string;
  replace?: boolean;
  state?: any;
  end?: boolean;
  className?: string | ((props: { isActive: boolean }) => string);
  children?: React.ReactNode | ((props: { isActive: boolean }) => React.ReactNode);
  [key: string]: any;
}

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ to, href, replace, end, state, className, children, ...rest }, ref) => {
    const target = to || href || '#';
    return (
      <NextLink ref={ref} href={target} replace={replace} className={className as string} {...rest}>
        {children as React.ReactNode}
      </NextLink>
    );
  }
);
Link.displayName = 'Link';

export const NavLink = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ to, href, replace, end, state, className, children, ...rest }, ref) => {
    const target = to || href || '#';
    const pathname = usePathname() || '/';
    const searchParams = useNextSearchParams();
    
    let isActive = false;
    try {
      const targetUrl = new URL(target, 'http://localhost');
      const targetPath = targetUrl.pathname;
      
      const isPathActive = end 
        ? pathname === targetPath 
        : pathname.startsWith(targetPath);
        
      isActive = isPathActive;
      
      if (isPathActive && targetUrl.search) {
        for (const [key, val] of targetUrl.searchParams.entries()) {
          if (searchParams.get(key) !== val) {
            isActive = false;
            break;
          }
        }
      }
    } catch(e) {
      isActive = end ? pathname === target : pathname.startsWith(target);
    }
      
    const resolvedClassName = typeof className === 'function' ? className({ isActive }) : className;
    const resolvedChildren = typeof children === 'function' ? children({ isActive }) : children;

    return (
      <NextLink ref={ref} href={target} replace={replace} className={resolvedClassName} {...rest}>
        {resolvedChildren}
      </NextLink>
    );
  }
);
NavLink.displayName = 'NavLink';

export function useNavigate() {
  const router = useRouter();

  return React.useCallback(
    (to: string | number, options?: { replace?: boolean; state?: any }) => {
      if (typeof to === 'number') {
        if (to === -1) router.back();
        else if (to === 1) router.forward();
        return;
      }
      if (options?.replace) {
        router.replace(to);
      } else {
        router.push(to);
      }
    },
    [router]
  );
}

export function useLocation() {
  const pathname = usePathname() || '/';
  const searchParams = useNextSearchParams();
  const search = searchParams ? `?${searchParams.toString()}` : '';

  return {
    pathname,
    search,
    hash: '',
    state: null,
    key: 'default',
  };
}

export function useParams<T extends Record<string, string | string[]> = Record<string, string>>() {
  const params = useNextParams();
  return (params || {}) as T;
}

export function useSearchParams() {
  const searchParams = useNextSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const setSearchParams = React.useCallback(
    (newParams: Record<string, string> | URLSearchParams) => {
      const params = new URLSearchParams(newParams as any);
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname]
  );

  return [searchParams, setSearchParams] as const;
}

export function Outlet({ children }: { children?: React.ReactNode }) {
  return <>{children}</>;
}

export function Navigate({ to, replace }: { to: string; replace?: boolean }) {
  const router = useRouter();
  React.useEffect(() => {
    if (replace) router.replace(to);
    else router.push(to);
  }, [to, replace, router]);
  return null;
}
