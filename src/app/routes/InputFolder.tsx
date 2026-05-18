import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setMangaPages, MangaPage } from '../mangaStore';

const supportedExtensions = new Set(['webp', 'jpg', 'jpeg', 'png']);

type DirectoryFile = File & {
  webkitRelativePath?: string;
};

const sortPages = (a: MangaPage, b: MangaPage) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });

const InputFolder: React.FC = () => {
  const navigate = useNavigate();
  const fallbackInputRef = useRef<HTMLInputElement>(null);
  const [folderName, setFolderName] = useState<string>('');
  const [totalPages, setTotalPages] = useState<number>(0);
  const [error, setError] = useState<string>('');

  const fileToMangaPage = (file: File, name: string): MangaPage => ({
    name,
    url: URL.createObjectURL(file),
  });

  const commitPages = (pages: MangaPage[], selectedFolderName: string) => {
    const sortedPages = pages.sort(sortPages);
    if (!sortedPages.length) {
      setError('No supported images found in that folder.');
      return;
    }

    setMangaPages(sortedPages);
    setFolderName(selectedFolderName);
    setTotalPages(sortedPages.length);
    setError('');
    navigate('/reader');
  };

  const handlePickFolder = async () => {
    setError('');

    const picker = (window as unknown as { showDirectoryPicker?: () => Promise<unknown> }).showDirectoryPicker;
    if (!picker) {
      fallbackInputRef.current?.click();
      return;
    }

    try {
      const directoryHandle = await picker();
      const pages: MangaPage[] = [];

      for await (const entry of (directoryHandle as any).values()) {
        if (entry?.kind !== 'file') continue;

        const file = await entry.getFile();
        const extension = file.name.split('.').pop()?.toLowerCase() || '';
        if (!supportedExtensions.has(extension)) continue;

        pages.push(fileToMangaPage(file, file.name));
      }

      commitPages(pages, (directoryHandle as any).name || 'Selected Folder');
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        return;
      }
      setError('Unable to read that folder. Try selecting again.');
    }
  };

  const handleFallbackSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []) as DirectoryFile[];
    const pages: MangaPage[] = [];

    for (const file of files) {
      const extension = file.name.split('.').pop()?.toLowerCase() || '';
      if (!supportedExtensions.has(extension)) continue;

      const relativeName = file.webkitRelativePath || file.name;
      pages.push(fileToMangaPage(file, relativeName));
    }

    const first = files[0];
    const selectedFolderName = first?.webkitRelativePath?.split('/')[0] || 'Selected Folder';
    commitPages(pages, selectedFolderName);

    event.target.value = '';
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <section className="w-full max-w-xl rounded-xl border border-zinc-800 bg-zinc-950 p-6">
        <h1 className="text-2xl font-semibold">Input folder</h1>
        <p className="mt-2 text-sm text-zinc-400">Pick a folder containing manga images (`webp`, `jpg`, `png`).</p>

        <button
          type="button"
          onClick={handlePickFolder}
          className="mt-6 w-full rounded-lg bg-white px-4 py-3 font-medium text-black hover:bg-zinc-200"
        >
          Choose folder
        </button>

        <input
          ref={fallbackInputRef}
          type="file"
          multiple
          accept=".webp,.jpg,.jpeg,.png,image/webp,image/jpeg,image/png"
          onChange={handleFallbackSelection}
          className="hidden"
          {...({ webkitdirectory: '', directory: '' } as unknown as Record<string, string>)}
        />

        {!!folderName && (
          <p className="mt-4 text-sm text-zinc-300">
            Ready: <span className="font-medium">{folderName}</span> ({totalPages} pages)
          </p>
        )}

        {!!error && <p className="mt-4 text-sm text-red-400">{error}</p>}
      </section>
    </main>
  );
};

export default InputFolder;
