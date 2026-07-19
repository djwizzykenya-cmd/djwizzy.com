'use client';

import { useState, useMemo, useEffect } from 'react';

type Track = {
  id: string;
  title: string;
  artist: string;
  bpm?: number;
  genre: string;
  duration?: string;
  src: string;
};

const sampleTracks: Track[] = [
  // Reggae
  { id: 'r1', title: 'Island Vibes', artist: 'Reggae Roots', bpm: 72, genre: 'Reggae', duration: '3:45', src: '/audio/reggae/Island-Vibes.mp3' },
  { id: 'r2', title: 'Dub Horizon', artist: 'Roots Echo', bpm: 68, genre: 'Reggae', duration: '4:05', src: '/audio/reggae/Dub-Horizon.mp3' },
  { id: 'r3', title: 'Rasta Sunset', artist: 'OneLove', bpm: 75, genre: 'Reggae', duration: '3:58', src: '/audio/reggae/Rasta-Sunset.mp3' },

  // Hip-Hop
  { id: 'h1', title: 'Street Poetry', artist: 'MC Flow', bpm: 90, genre: 'Hip-Hop', duration: '2:58', src: '/audio/hiphop/Street-Poetry.mp3' },
  { id: 'h2', title: 'Beats & Bars', artist: 'Lyricist', bpm: 92, genre: 'Hip-Hop', duration: '3:20', src: '/audio/hiphop/Beats-and-Bars.mp3' },
  { id: 'h3', title: 'Concrete Jungle', artist: 'BlockKid', bpm: 88, genre: 'Hip-Hop', duration: '3:45', src: '/audio/hiphop/Concrete-Jungle.mp3' },

  // Trap
  { id: 't1', title: 'Trap Nights', artist: '808 King', bpm: 140, genre: 'Trap', duration: '3:12', src: '/audio/trap/Trap-Nights.mp3' },
  { id: 't2', title: 'Gold Chains', artist: 'SkrtLord', bpm: 150, genre: 'Trap', duration: '3:30', src: '/audio/trap/Gold-Chains.mp3' },

  // House / Tech House
  { id: 'ho1', title: 'Sunset Groove', artist: 'DJ Wizzy', bpm: 120, genre: 'House', duration: '4:32', src: '/audio/house/Sunset-Groove.mp3' },
  { id: 'ho2', title: 'Warmth', artist: 'DeepWave', bpm: 122, genre: 'House', duration: '5:00', src: '/audio/house/Warmth.mp3' },
  { id: 'th1', title: 'Midnight Bass', artist: 'Luna', bpm: 128, genre: 'Tech House', duration: '6:12', src: '/audio/tech-house/Midnight-Bass.mp3' },
  { id: 'th2', title: 'Groove Machine', artist: 'Electron', bpm: 126, genre: 'Tech House', duration: '5:40', src: '/audio/tech-house/Groove-Machine.mp3' },

  // Chill / Ambient
  { id: 'c1', title: 'City Lights', artist: 'Nocturne', bpm: 115, genre: 'Chill', duration: '5:03', src: '/audio/chill/City-Lights.mp3' },
  { id: 'c2', title: 'Late Night', artist: 'SoftKeys', bpm: 70, genre: 'Chill', duration: '4:20', src: '/audio/chill/Late-Night.mp3' },

  // Additional genres
  { id: 'd1', title: 'Wobble Drop', artist: 'BassLord', bpm: 140, genre: 'Dubstep', duration: '3:50', src: '/audio/dubstep/Wobble-Drop.mp3' },
  { id: 'p1', title: 'Neon Pop', artist: 'Starlet', bpm: 105, genre: 'Pop', duration: '3:10', src: '/audio/pop/Neon-Pop.mp3' },
  { id: 'j1', title: 'Blue Note', artist: 'Mr. Sax', bpm: 85, genre: 'Jazz', duration: '6:00', src: '/audio/jazz/Blue-Note.mp3' },
  { id: 'l1', title: 'Salsa Heat', artist: 'La Rumba', bpm: 100, genre: 'Latin', duration: '4:15', src: '/audio/latin/Salsa-Heat.mp3' },
];

const GENRES = ['All', 'Reggae', 'Hip-Hop', 'Trap', 'House', 'Tech House', 'Chill', 'Dubstep', 'Pop', 'Jazz', 'Latin'];

export default function MusicPool() {
  const [query, setQuery] = useState('');
  const [activeGenre, setActiveGenre] = useState('All');
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const tracks = useMemo(() => sampleTracks, []);
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    fetch('/api/admin/page?slug=music-pool').then((r)=>r.ok? r.json().then(j=>setContent(j)) : null).catch(()=>{});
  }, []);
  const [available, setAvailable] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let mounted = true;
    async function check() {
      const results: Record<string, boolean> = {};
      await Promise.all(
        tracks.map(async (t) => {
          try {
            const res = await fetch(t.src, { method: 'HEAD' });
            results[t.id] = res.ok;
          } catch (e) {
            results[t.id] = false;
          }
        })
      );
      if (mounted) setAvailable(results);
    }
    check();
    return () => {
      mounted = false;
    };
  }, [tracks]);

  const visible = tracks.filter((t) => {
    if (activeGenre !== 'All' && t.genre !== activeGenre) return false;
    if (!query) return true;
    return (
      t.title.toLowerCase().includes(query.toLowerCase()) ||
      t.artist.toLowerCase().includes(query.toLowerCase()) ||
      t.genre.toLowerCase().includes(query.toLowerCase())
    );
  });

  const grouped = useMemo(() => {
    return visible.reduce<Record<string, Track[]>>((acc, t) => {
      acc[t.genre] = acc[t.genre] || [];
      acc[t.genre].push(t);
      return acc;
    }, {});
  }, [visible]);

  function togglePlay(id: string) {
    const audio = document.getElementById(`audio-${id}`) as HTMLAudioElement | null;
    if (!audio) return;
    if (playingId === id) {
      audio.pause();
      setPlayingId(null);
    } else {
      if (playingId) {
        const prev = document.getElementById(`audio-${playingId}`) as HTMLAudioElement | null;
        prev?.pause();
        if (prev) prev.currentTime = 0;
      }
      audio.play();
      setPlayingId(id);
    }
  }

  function toggleCollapse(genre: string) {
    setCollapsed((s) => ({ ...s, [genre]: !s[genre] }));
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-24" role="main">
      <h1 className="text-4xl font-bold mb-2">{content?.title || 'Music Pool'}</h1>
      <p className="text-gray-400 mb-6">{content?.description || 'Browse tracks organized by genre (like folders) — preview, download, or filter.'}</p>

      <div className="flex gap-6 mb-8">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title, artist, or genre..."
          className="flex-1 px-4 py-2 bg-black/50 border border-purple-500/40 rounded-lg text-white"
        />

        <div className="hidden md:flex gap-2" role="toolbar" aria-label="Genre filters">
          {GENRES.map((g) => (
            <button
              key={g}
              onClick={() => setActiveGenre(g)}
              className={`px-3 py-2 rounded ${activeGenre === g ? 'bg-purple-600 text-white' : 'bg-black/40 text-gray-200'}`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      <div className="md:flex md:items-start gap-6">
        <aside className="w-full md:w-56 bg-black/40 p-4 rounded-lg hidden md:block" role="navigation" aria-label="Genres">
          <h4 className="font-semibold mb-3">Genres</h4>
          <ul className="space-y-2 text-sm">
            {GENRES.map((g) => (
              <li key={g}>
                <button
                  onClick={() => setActiveGenre(g)}
                  className={`w-full text-left px-2 py-1 rounded ${activeGenre === g ? 'bg-purple-600 text-white' : 'hover:bg-purple-600/20 text-gray-200'}`}
                >
                  {g}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <main className="flex-1" role="main">
          {Object.keys(grouped).length === 0 && <p className="text-gray-400">No tracks found.</p>}

          {Object.entries(grouped).map(([g, list]) => (
            <section key={g} className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-bold">{g}</h2>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-400">{list.length} track{list.length > 1 ? 's' : ''}</span>
                  <button onClick={() => toggleCollapse(g)} className="text-sm text-purple-300">{collapsed[g] ? 'Expand' : 'Collapse'}</button>
                </div>
              </div>

              {!collapsed[g] && (
                <div className="grid md:grid-cols-2 gap-4">
                  {list.map((t) => (
                    <div key={t.id} className="p-4 rounded-lg bg-gradient-to-br from-purple-600/10 to-pink-600/5 border border-purple-500/10">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-black/40 rounded flex items-center justify-center">
                          <svg className="w-6 h-6 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 3v18l8-4V7l-8-4z" />
                          </svg>
                        </div>

                        <div className="flex-1">
                          <div className="flex items-baseline justify-between">
                            <h3 className="font-semibold">{t.title}</h3>
                            <span className="text-sm text-gray-400">{t.duration}</span>
                          </div>
                          <p className="text-sm text-gray-400">{t.artist} • {t.bpm ? `${t.bpm} BPM` : ''}</p>

                          <div className="mt-3 flex items-center gap-3">
                            {available[t.id] ? (
                              <>
                                <button onClick={() => togglePlay(t.id)} className="px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded text-white">{playingId === t.id ? 'Pause' : 'Play'}</button>
                                <a href={t.src} download className="px-3 py-2 border border-purple-500/40 rounded text-sm text-purple-300">Download</a>
                              </>
                            ) : (
                              <button disabled className="px-3 py-2 bg-gray-700 rounded text-gray-400">Unavailable</button>
                            )}
                            <audio id={`audio-${t.id}`} src={t.src} onEnded={() => setPlayingId(null)} />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          ))}
        </main>
      </div>
    </div>
  );
}
