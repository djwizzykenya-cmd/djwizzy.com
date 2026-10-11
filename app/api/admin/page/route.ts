import { NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '../../../../lib/supabase-admin';
import { requireAdmin } from '../../../../lib/require-admin';

export const dynamic = 'force-dynamic';

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const noStoreHeaders = { 'Cache-Control': 'no-store, max-age=0' };

const fallbackMixes = [
  {
    title: 'Tech House Vibes Mix Vol 5',
    artist: 'DJ Wizzy',
    duration: '1h 23m',
    date: '2 weeks ago',
    videoUrl: 'https://youtu.be/4_Prw-N8pKM?si=08SzyhmLZRilwI5X',
    thumbnail: 'https://img.youtube.com/vi/4_Prw-N8pKM/hqdefault.jpg',
    links: [
      { label: 'Watch on YouTube', href: 'https://youtu.be/4_Prw-N8pKM?si=08SzyhmLZRilwI5X' },
      { label: 'Listen on SoundCloud', href: 'https://soundcloud.com/' },
      { label: 'Open Mixcloud', href: 'https://www.mixcloud.com/' },
    ],
  },
  {
    title: 'Afrobeats vs Amapiano Mix Vol 4',
    artist: 'DJ Wizzy',
    duration: '58m',
    date: '3 weeks ago',
    videoUrl: 'https://youtu.be/4_Prw-N8pKM?si=08SzyhmLZRilwI5X',
    thumbnail: 'https://img.youtube.com/vi/4_Prw-N8pKM/hqdefault.jpg',
    links: [
      { label: 'Watch on YouTube', href: 'https://youtu.be/4_Prw-N8pKM?si=08SzyhmLZRilwI5X' },
      { label: 'Stream on SoundCloud', href: 'https://soundcloud.com/' },
      { label: 'Open Mixcloud', href: 'https://www.mixcloud.com/' },
    ],
  },
  {
    title: 'Deep House Sessions Mix',
    artist: 'DJ Wizzy',
    duration: '1h 45m',
    date: '1 month ago',
    videoUrl: 'https://youtu.be/4_Prw-N8pKM?si=08SzyhmLZRilwI5X',
    thumbnail: 'https://img.youtube.com/vi/4_Prw-N8pKM/hqdefault.jpg',
    links: [
      { label: 'Watch on YouTube', href: 'https://youtu.be/4_Prw-N8pKM?si=08SzyhmLZRilwI5X' },
      { label: 'Listen on Mixcloud', href: 'https://www.mixcloud.com/' },
      { label: 'Stream on SoundCloud', href: 'https://soundcloud.com/' },
    ],
  },
];

const fallbackPages: Record<string, Record<string, unknown>> = {
  home: {
    title: 'DJ Wizzy - Your All-in-One DJ Ecosystem',
    subtitle: 'Find your perfect mix curated by DJ Wizzy - the #1 most subscribed DJ on the platform with millions of listeners worldwide.',
    cta: [
      { text: '🎵 Watch on MixHub', href: '/mixhub' },
      { text: '📥 Download Mixes', href: '/mixes' },
    ],
    stats: [
      { stat: '2M+', label: 'YouTube Subscribers' },
      { stat: '500+', label: 'Mixes Released' },
      { stat: '50M+', label: 'Total Plays' },
      { stat: '15+', label: 'Years in the Game' },
    ],
    mixes: fallbackMixes,
  },
  about: {
    title: 'About Me & Portfolio',
    description: 'Learn about my journey as a DJ, past events, and what makes me stand out in the industry.',
    bioHeading: 'My Story',
    bioText: [
      "I'm a passionate DJ with over 10 years of experience in the industry. Starting from small clubs to major festivals, I've developed a unique style that blends electronic, hip-hop, and house music.",
      'My mission is to create unforgettable experiences through music and help other DJs succeed in their careers.',
    ],
    heroImage: '/images/about-hero.svg',
    portfolioTitle: 'Past Events & Gallery',
    portfolioItems: [
      { title: 'Festival Takeover', subtitle: 'Main stage headline set', rating: '5.0/5', link: '/events/festival' },
      { title: 'Club Residency', subtitle: 'Weekly late night club sessions', rating: '4.9/5', link: '/events/club' },
      { title: 'Studio Session', subtitle: 'Exclusive production behind-the-scenes', rating: '5.0/5', link: '/events/studio' },
      { title: 'International Tour', subtitle: 'Sold-out show highlights', rating: '4.8/5', link: '/events/tour' },
      { title: 'VIP Experience', subtitle: 'Private event and VIP lounge', rating: '4.9/5', link: '/events/vip' },
      { title: 'Collab Release', subtitle: 'Featured artist collabs and drops', rating: '5.0/5', link: '/events/collab' },
    ],
  },
  mixes: { mixes: fallbackMixes },
  services: {
    title: 'My Services',
    description: "From live DJ sets to custom mixes and more. Let's create something amazing together.",
    cards: [
      {
        title: 'Live DJing',
        desc: 'Book me for weddings, parties, clubs, and corporate events.',
        price: '$500+',
        href: '/services/live-djing',
        buttonText: 'Learn',
      },
      {
        title: 'Custom Mixing',
        desc: 'Get a personalized mix tailored to your event or mood.',
        price: '$100+',
        href: '/services/custom-mixing',
        buttonText: 'Learn',
      },
      {
        title: 'Website Creation',
        desc: 'I build professional DJ websites for other creators.',
        price: '$500+',
        href: '/services/website-creation',
        buttonText: 'Learn',
      },
      {
        title: 'Training & Consultation',
        desc: 'Learn DJing techniques and industry tips from me.',
        price: '$200+',
        href: '/services/training-consultation',
        buttonText: 'Learn',
      },
      {
        title: 'Music Production',
        desc: 'Get original tracks and remixes created for you.',
        price: '$300+',
        href: '/services/music-production',
        buttonText: 'Learn',
      },
      {
        title: 'Event Planning',
        desc: 'Let me plan the perfect music experience for your event.',
        price: 'Quote',
        href: '/services/event-planning',
        buttonText: 'Book',
      },
    ],
    contactTitle: 'Ready to Book?',
    contactDescription: "Tell me about your event and I'll get back to you with a custom quote.",
    contactFields: [
      { type: 'text', placeholder: 'Your Name' },
      { type: 'email', placeholder: 'Your Email' },
      { type: 'text', placeholder: 'Event Date & Type' },
      { type: 'textarea', placeholder: 'Tell me about your event...' },
    ],
    contactButtonText: 'Send Booking Request',
  },
  marketplace: {
    title: 'Marketplace',
    description: 'Buy and sell DJ accessories. Explore premium content and accessories.',
    saleTitle: 'For Sale',
    rentTitle: 'For Rent',
    noRentText: 'No items available for rent right now.',
    items: [
      { name: 'CDJ-3000', price: '$3,500', type: 'Equipment', rent: true, description: 'Professional performance media player.' },
      { name: 'Pioneer DDJ-1000', price: '$899', type: 'Controller', rent: false, description: 'Club-standard DJ controller with jog wheels.' },
      { name: 'Technics 1200', price: '$1,200', type: 'Turntable', rent: true, description: 'Iconic analog turntable for vinyl performances.' },
    ],
  },
};

function getFallbackPageContent(slug: string): Record<string, unknown> {
  return fallbackPages[slug] ?? {
    title: slug.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()),
    description: 'Content is unavailable right now. Add your Supabase configuration to manage this page.',
  };
}

export async function GET(request: Request) {
  const slug = new URL(request.url).searchParams.get('slug');
  if (!slug || !slugPattern.test(slug)) {
    return NextResponse.json({ error: 'A valid slug is required.' }, { status: 400, headers: noStoreHeaders });
  }

  try {
    const { data, error } = await getSupabaseAdminClient()
      .from('pages')
      .select('content')
      .eq('slug', slug)
      .maybeSingle();

    if (error) {
      console.error('Supabase page read failed:', error.message);
      return NextResponse.json(getFallbackPageContent(slug), { headers: noStoreHeaders });
    }

    if (!data) {
      return NextResponse.json(getFallbackPageContent(slug), { headers: noStoreHeaders });
    }

    return NextResponse.json(data.content, { headers: noStoreHeaders });
  } catch (error) {
    console.error('Page read configuration or runtime failure:', error);
    return NextResponse.json(getFallbackPageContent(slug), { headers: noStoreHeaders });
  }
}

export async function POST(request: Request) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;

  try {
    const body: unknown = await request.json();
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return NextResponse.json({ error: 'A JSON object is required.' }, { status: 400 });
    }

    const { slug, content } = body as { slug?: unknown; content?: unknown };
    if (typeof slug !== 'string' || !slugPattern.test(slug)) {
      return NextResponse.json({ error: 'A valid slug is required.' }, { status: 400 });
    }
    if (!content || typeof content !== 'object' || Array.isArray(content)) {
      return NextResponse.json({ error: 'Content must be a JSON object.' }, { status: 400 });
    }

    const { data, error } = await getSupabaseAdminClient()
      .from('pages')
      .upsert({ slug, content, updated_at: new Date().toISOString() }, { onConflict: 'slug' })
      .select('id, slug, updated_at')
      .single();

    if (error) {
      console.error('Supabase page save failed:', error.message);
      return NextResponse.json({ error: 'Could not save page content.' }, { status: 500 });
    }

    return NextResponse.json({ ok: true, page: data }, { headers: noStoreHeaders });
  } catch (error) {
    console.error('Page save failed:', error);
    return NextResponse.json({ error: 'Invalid request or page storage failure.' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;

  const slug = new URL(request.url).searchParams.get('slug');
  if (!slug || !slugPattern.test(slug)) {
    return NextResponse.json({ error: 'A valid slug is required.' }, { status: 400 });
  }

  try {
    const { error, count } = await getSupabaseAdminClient()
      .from('pages')
      .delete({ count: 'exact' })
      .eq('slug', slug);

    if (error) {
      console.error('Supabase page delete failed:', error.message);
      return NextResponse.json({ error: 'Could not delete page content.' }, { status: 500 });
    }
    if (count === 0) {
      return NextResponse.json({ error: 'Page not found.' }, { status: 404 });
    }

    return NextResponse.json({ ok: true }, { headers: noStoreHeaders });
  } catch (error) {
    console.error('Page delete failed:', error);
    return NextResponse.json({ error: 'Page storage failure.' }, { status: 500 });
  }
}
