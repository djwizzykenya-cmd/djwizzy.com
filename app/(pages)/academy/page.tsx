'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

type Course = {
  id: string;
  title: string;
  level: string;
  length: string;
  instructor: string;
  price: string;
};

type AcademyEvent = {
  id: string;
  name: string;
  date: string;
  type: string;
};

type AcademyContent = {
  title?: string;
  description?: string;
  courses?: Course[];
  events?: AcademyEvent[];
};

export default function Academy() {
  const defaultCourses: Course[] = [
    { id: 'c1', title: 'Beatmatching 101', level: 'Beginner', length: '2h', instructor: 'DJ Wizzy', price: 'Free' },
    { id: 'c2', title: 'EQ Mastery', level: 'Intermediate', length: '3h', instructor: 'Luna', price: '$19' },
    { id: 'c3', title: 'Mixing Hip-Hop', level: 'Intermediate', length: '2.5h', instructor: 'MC Flow', price: '$15' },
    { id: 'c4', title: 'Scratching Techniques', level: 'Advanced', length: '4h', instructor: 'Scratch Pro', price: '$29' },
    { id: 'c5', title: 'Production Basics', level: 'Beginner', length: '3h', instructor: 'Nocturne', price: '$12' },
    { id: 'c6', title: 'Getting Booked', level: 'All', length: '1.5h', instructor: 'Agent K', price: '$9' },
  ];

  const defaultEvents: AcademyEvent[] = [
    { id: 'e1', name: 'Live DJ Session #1', date: '2026-07-15', type: 'Live' },
    { id: 'e2', name: 'Production Masterclass', date: '2026-07-22', type: 'Workshop' },
    { id: 'e3', name: 'Club Night Showcase', date: '2026-08-05', type: 'Performance' },
  ];

  const [content, setContent] = useState<AcademyContent | null>(null);
  const courses = content?.courses ?? defaultCourses;
  const events = content?.events ?? defaultEvents;

  useEffect(() => {
    fetch('/api/admin/page?slug=academy').then((r) => r.ok ? r.json().then(j => setContent(j)) : null).catch(() => {});
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12" role="main">
      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">{content?.title || 'DJ Academy'}</h1>
        <p className="text-gray-300 max-w-3xl">{content?.description || 'Learn DJing, production, and industry tips from experienced professionals. Explore courses, workshops, and live sessions.'}</p>
      </motion.section>

      <div className="md:flex md:gap-8">
        {/* Main: Courses */}
        <main className="flex-1" role="main">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Courses & Tutorials</h2>
              <p className="text-sm text-gray-400">Structured lessons for all levels.</p>
            </div>
            <div className="flex items-center gap-3">
              <input placeholder="Search courses..." className="px-3 py-2 bg-black/40 rounded text-sm" />
              <select className="px-3 py-2 bg-black/40 rounded text-sm">
                <option>All levels</option>
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {courses.map((course) => (
              <div key={course.id} className="p-5 rounded-lg bg-gradient-to-br from-purple-600/10 to-pink-600/5 border border-purple-500/10">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold">{course.title}</h3>
                    <p className="text-sm text-gray-400">{course.instructor} • {course.level}</p>
                    <p className="text-sm text-gray-400 mt-2">Length: {course.length}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-purple-300 font-semibold">{course.price}</p>
                    <button className="mt-3 px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded text-sm">Enroll</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* Sidebar: Events + CTA */}
        <aside className="w-full md:w-96 mt-8 md:mt-0">
          <div className="p-4 rounded-lg bg-black/40 border border-purple-600/20 mb-6">
            <h3 className="font-semibold mb-3">📅 Upcoming Events</h3>
            <div className="space-y-3">
              {events.map((ev) => (
                <div key={ev.id} className="flex items-center justify-between bg-gradient-to-r from-purple-900/10 to-pink-900/5 p-3 rounded">
                  <div>
                    <p className="font-medium">{ev.name}</p>
                    <p className="text-sm text-gray-400">{ev.date}</p>
                  </div>
                  <span className="px-2 py-1 text-sm bg-purple-600/20 rounded">{ev.type}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-lg bg-gradient-to-br from-purple-600/10 to-pink-600/5 border border-purple-500/10">
            <h3 className="font-semibold mb-2">Become an Instructor</h3>
            <p className="text-sm text-gray-400 mb-4">Share your knowledge, host workshops, and earn from students.</p>
            <button className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded">Apply to Teach</button>
          </div>
        </aside>
      </div>
    </div>
  );
}