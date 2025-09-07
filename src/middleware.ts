import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  
  try {
    // Get user session
    const { data: { session } } = await supabase.auth.getSession();
    
    // Get the pathname from the URL
    const path = req.nextUrl.pathname;
    
    // Auth routes that don't require authentication
    const isAuthRoute = path.startsWith('/auth');
    
    // Routes that require authentication
    const isProtectedRoute = 
      path.startsWith('/dashboard') || 
      path.startsWith('/onboarding') || 
      path.startsWith('/profile');
    
    // If the user is not authenticated and trying to access a protected route
    if (!session && isProtectedRoute) {
      const redirectUrl = new URL('/', req.url);
      return NextResponse.redirect(redirectUrl);
    }
    
    // If the user is authenticated and trying to access an auth route
    if (session && isAuthRoute && !path.includes('/callback')) {
      // Check if the user has completed onboarding
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role, onboarding_completed')
        .eq('id', session.user.id)
        .single();
      
      // If there's an error or no profile, redirect to role selection
      if (error || !profile) {
        const redirectUrl = new URL('/onboarding/role-selection', req.url);
        return NextResponse.redirect(redirectUrl);
      }
      
      // If profile exists but onboarding not completed
      if (!profile.onboarding_completed) {
        // If they have selected a role
        if (profile.role) {
          const redirectUrl = new URL(`/onboarding/${profile.role === 'caregiver' ? 'caregiver' : 'careseeker'}`, req.url);
          return NextResponse.redirect(redirectUrl);
        }
        
        // If they haven't selected a role
        const redirectUrl = new URL('/onboarding/role-selection', req.url);
        return NextResponse.redirect(redirectUrl);
      }
      
      // If onboarding is completed, redirect to dashboard
      const redirectUrl = new URL('/dashboard', req.url);
      return NextResponse.redirect(redirectUrl);
    }
    
    // If the user is authenticated, check if they've completed onboarding
    if (session && path !== '/auth/callback') {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role, onboarding_completed')
        .eq('id', session.user.id)
        .single();
      
      // Handle case where profile doesn't exist or there's an error
      if (error || !profile) {
        // Only redirect if trying to access dashboard or profile
        if (path.startsWith('/dashboard') || path.startsWith('/profile')) {
          const redirectUrl = new URL('/onboarding/role-selection', req.url);
          return NextResponse.redirect(redirectUrl);
        }
      } else if (!profile.onboarding_completed) {
        // If the user has a profile but hasn't completed onboarding
        // If they're trying to access the dashboard or profile
        if (path.startsWith('/dashboard') || path.startsWith('/profile')) {
          // If they have selected a role, redirect to the appropriate onboarding flow
          if (profile.role) {
            const redirectUrl = new URL(`/onboarding/${profile.role === 'caregiver' ? 'caregiver' : 'careseeker'}`, req.url);
            return NextResponse.redirect(redirectUrl);
          }
          
          // If they haven't selected a role, redirect to role selection
          const redirectUrl = new URL('/onboarding/role-selection', req.url);
          return NextResponse.redirect(redirectUrl);
        }
      } else if (profile.onboarding_completed && path.startsWith('/onboarding')) {
        // If the user is authenticated and has completed onboarding but is trying to access onboarding routes
        const redirectUrl = new URL('/dashboard', req.url);
        return NextResponse.redirect(redirectUrl);
      }
    }
  } catch (error) {
    console.error('Error in middleware:', error);
  }
  
  return res;
}