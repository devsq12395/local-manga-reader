import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMangaPages } from '../mangaStore';

const Reader: React.FC = () => {
  const navigate = useNavigate();
  const pages = useMemo(() => getMangaPages(), []);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!pages.length) {
      navigate('/');
    }
  }, [navigate, pages.length]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        setCurrentIndex((prev) => Math.min(prev + 1, pages.length - 1));
      }
      if (event.key === 'ArrowLeft') {
        setCurrentIndex((prev) => Math.max(prev - 1, 0));
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [pages.length]);

  if (!pages.length) {
    return null;
  }

  const currentPage = pages[currentIndex];

  const goNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, pages.length - 1));
  };

  const goPrevious = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  return (
    <main className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="mx-auto flex max-w-5xl flex-col items-center">
        <img
          src={currentPage.url}
          alt={currentPage.name}
          onClick={goNext}
          className="max-h-[150vh] w-auto max-w-full cursor-pointer select-none object-contain"
        />

        <div className="mt-6 flex items-center gap-3">
          <button
            type="button"
            onClick={goPrevious}
            disabled={currentIndex === 0}
            className="rounded-lg border border-zinc-700 px-4 py-2 disabled:opacity-40"
          >
            ← Prev
          </button>

          <div className="rounded-lg border border-zinc-800 px-4 py-2 text-sm text-zinc-300">
            {currentIndex + 1} / {pages.length}
          </div>

          <button
            type="button"
            onClick={goNext}
            disabled={currentIndex === pages.length - 1}
            className="rounded-lg border border-zinc-700 px-4 py-2 disabled:opacity-40"
          >
            Next →
          </button>
        </div>
      </div>
    </main>
  );
};

export default Reader;
