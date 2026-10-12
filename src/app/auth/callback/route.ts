import { NextResponse } from 'next/server';
import { createClient } from '../../../lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Successfully authenticated
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Auth failed or code missing -> redirect to home with error parameter
  return NextResponse.redirect(`${origin}/?auth_error=true`);
}
