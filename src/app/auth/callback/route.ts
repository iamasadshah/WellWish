import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    try {
      // Exchange the code for a session
      await supabase.auth.exchangeCodeForSession(code);

      // Get the user session
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        console.log('Auth callback triggered');
        console.log('Session:', session);

        // Check if user has a profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        console.log('Profile:', profile);
        console.log('Profile error:', profileError);

        // If there was an error or no profile exists, create a basic one
        if (profileError || !profile) {
          console.log('Creating new profile for user:', session.user.id);

          const { error: insertError } = await supabase.from('profiles').insert({
            id: session.user.id,
            email: session.user.email,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            onboarding_completed: false,
            role: null
          });

          if (insertError) {
            console.error('Error creating profile:', insertError);
            throw insertError;
          }

          // Redirect to role selection after signup
          return NextResponse.redirect(`${requestUrl.origin}/onboarding/role-selection`);
        }

        // If profile exists but onboarding not completed
        if (!profile.onboarding_completed) {
          // If role is selected but onboarding not completed
          if (profile.role) {
            return NextResponse.redirect(
              `${requestUrl.origin}/onboarding/${profile.role === 'caregiver' ? 'caregiver' : 'careseeker'}`
            );
          }

          // If role not selected
          return NextResponse.redirect(`${requestUrl.origin}/onboarding/role-selection`);
        }

        // If onboarding is completed, redirect to dashboard
        return NextResponse.redirect(`${requestUrl.origin}/dashboard`);
      }
    } catch (error) {
      console.error('Error in auth callback:', error);
      // If any error occurs, redirect to role selection as a fallback
      return NextResponse.redirect(`${requestUrl.origin}/onboarding/role-selection`);
    }
  }

  // Default fallback redirect
  return NextResponse.redirect(`${requestUrl.origin}`);
}


