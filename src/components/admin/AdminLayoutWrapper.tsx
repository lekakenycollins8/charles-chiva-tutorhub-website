'use client';

import { usePathname } from 'next/navigation';
import { ReactNode, useEffect } from 'react';
import SessionProviderWrapper from '../auth/SessionProviderWrapper';

export default function AdminLayoutWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');
  
  useEffect(() => {
    // Get the main site wrapper element
    const mainSiteWrapper = document.querySelector('.main-site-wrapper');
    
    if (isAdminRoute && mainSiteWrapper) {
      // Hide the main site wrapper for admin routes
      mainSiteWrapper.setAttribute('style', 'display: none;');
    } else if (mainSiteWrapper) {
      // Show the main site wrapper for non-admin routes
      mainSiteWrapper.setAttribute('style', '');
    }
  }, [isAdminRoute]);
  
  return (
    <>
      {isAdminRoute && (
        <SessionProviderWrapper>
          <div className="admin-root">
            {children}
          </div>
        </SessionProviderWrapper>
      )}
      {!isAdminRoute && null}
    </>
  );
}
