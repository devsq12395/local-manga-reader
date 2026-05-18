export type MangaPage = {
  name: string;
  url: string;
};

let pages: MangaPage[] = [];

export function setMangaPages(nextPages: MangaPage[]) {
  for (const page of pages) {
    URL.revokeObjectURL(page.url);
  }
  pages = nextPages;
}

export function getMangaPages() {
  return pages;
}
