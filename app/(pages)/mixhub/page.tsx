'use client';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

type Video = {
  id: string;
  title: string;
  dj: string;
  duration: string;
  views: string;
  src: string;
  thumb: string;
  genre?: string;
};

type MixHubContent = {
  title?: string;
  description?: string;
  videos?: Video[];
};

const sampleVideos: Video[] = [
  { id: 'v1', title: 'Deep House Sunset Mix', dj: 'DJ Wizzy', duration: '1:20:15', views: '120K', src: '/videos/sample1.mp4', thumb: '/images/thumb1.svg', genre: 'House' },
  { id: 'v2', title: 'Late Night Tech House', dj: 'Luna', duration: '58:12', views: '84K', src: '/videos/sample2.mp4', thumb: '/images/thumb2.svg', genre: 'Tech House' },
  { id: 'v3', title: 'Hip-Hop Essentials', dj: 'MC Flow', duration: '45:03', views: '56K', src: '/videos/sample3.mp4', thumb: '/images/thumb3.svg', genre: 'Hip-Hop' },
  { id: 'v4', title: 'Trap Bangers Vol.1', dj: '808 King', duration: '35:20', views: '98K', src: '/videos/sample4.mp4', thumb: '/images/thumb4.svg', genre: 'Trap' },
  { id: 'v5', title: 'Chillout Lounge', dj: 'Nocturne', duration: '1:02:10', views: '34K', src: '/videos/sample5.mp4', thumb: '/images/thumb5.svg', genre: 'Chill' },
];

export default function MixHub() {
  const [content, setContent] = useState<MixHubContent | null>(null);
  const videoList: Video[] = content?.videos?.length ? content.videos : sampleVideos;
  const [selected, setSelected] = useState<Video>(sampleVideos[0]);

  useEffect(() => {
    fetch('/api/admin/page?slug=mixhub').then((r)=>r.ok? r.json().then(j=>setContent(j)) : null).catch(()=>{});
  }, []);

  useEffect(() => {
    if (content?.videos?.length) {
      setSelected(content.videos[0]);
    }
  }, [content]);

  const [videoAvailable, setVideoAvailable] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function check() {
      try {
        const res = await fetch(selected.src, { method: 'HEAD' });
        if (mounted) setVideoAvailable(res.ok);
      } catch (e) {
        if (mounted) setVideoAvailable(false);
      }
    }
    check();
    return () => {
      mounted = false;
    };
  }, [selected]);

  const pageTitle = content?.title || 'MixHub';
  const pageDescription = content?.description || 'Discover community mixes — player, info, and suggested videos.';

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.header initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold">{pageTitle}</h1>
        <p className="text-sm text-gray-400">{pageDescription}</p>
      </motion.header>

      <div className="md:flex md:gap-6" role="main">
        {/* Main player area */}
        <main className="flex-1">
            <div className="bg-black/80 rounded-lg overflow-hidden relative" role="region" aria-label="Video player">
            <video key={selected.id} controls src={selected.src} className="w-full h-[480px] bg-black object-cover" aria-label={`Player for ${selected.title}`} />
            {!videoAvailable && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-center p-4">
                <div>
                  <p className="text-white font-semibold">Video file missing</p>
                  <p className="text-sm text-gray-300">This is a placeholder entry. Add the video file to /public/videos/ to enable playback.</p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 flex items-start gap-4">
            <div className="flex-1">
              <h2 className="text-xl font-semibold">{selected.title}</h2>
              <div className="mt-2 flex items-center gap-3 text-sm text-gray-400">
                <span>{selected.dj}</span>
                <span>•</span>
                <span>{selected.views} views</span>
                <span>•</span>
                <span>{selected.duration}</span>
              </div>
              <div className="mt-3 flex items-center gap-3">
                <button className="px-3 py-2 bg-purple-600 rounded text-white">👍 12K</button>
                <button className="px-3 py-2 bg-black/40 border border-purple-600 rounded text-white">💬 Comment</button>
                <button className="px-3 py-2 bg-black/40 border border-purple-600 rounded text-white">Share</button>
              </div>

              <div className="mt-6 p-4 bg-black/40 rounded" role="region" aria-label="Video description">
                <p className="text-sm text-gray-300">Description: Community mix showcasing vibes from around the world. Tracklist and timestamps in the comments.</p>
              </div>

              <div className="mt-6">
                <h3 className="font-semibold mb-2">Comments</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-black/40 rounded">
                    <p className="text-sm"><strong>FanOne</strong> — Love this set!</p>
                  </div>
                  <div className="p-3 bg-black/40 rounded">
                    <p className="text-sm"><strong>Listener42</strong> — Perfect for late nights.</p>
                  </div>
                </div>
                <div className="mt-3">
                  <textarea placeholder="Add a public comment..." className="w-full p-3 bg-black/50 rounded text-sm" rows={3}></textarea>
                  <div className="mt-2 text-right">
                    <button className="px-3 py-2 bg-purple-600 rounded text-white">Comment</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Suggested videos */}
            <aside className="w-80 hidden md:block" role="complementary" aria-label="Suggested videos">
              <h4 className="font-semibold mb-3">Up Next</h4>
              <div className="space-y-3">
                {videoList.map((video) => (
                  <div key={video.id} onClick={() => setSelected(video)} className="flex items-center gap-3 cursor-pointer hover:bg-black/40 p-2 rounded">
                      <div className="w-36 h-20 bg-black/50 rounded overflow-hidden flex-shrink-0" aria-hidden="true">
                      <img src={video.thumb} alt={video.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{video.title}</p>
                      <p className="text-xs text-gray-400">{video.dj} • {video.views} views</p>
                    </div>
                    <span className="text-xs text-gray-400">{video.duration}</span>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}