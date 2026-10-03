/**
 * Centralized Photo Configuration for Saki & Akku's Relationship Memories.
 *
 * All photos are hosted locally as static assets under /images/memories/
 * No external APIs, no compression/alteration of originals.
 */

export interface MemoryPhoto {
  id: string;
  src: string;
  person: 'saki' | 'akku' | 'both';
  title: string;
  caption: string;
  alt: string;
  aspectRatio: 'square' | 'portrait';
  objectPosition: string;
}

export const MEMORY_PHOTOS: readonly MemoryPhoto[] = [
  {
    id: 'memory-01',
    src: '/images/memories/img1.jpeg',
    person: 'both',
    title: 'Saki & Akku',
    caption: 'Together with all my love ❤️',
    alt: 'A cherished memory of Saki and Akku smiling together',
    aspectRatio: 'square',
    objectPosition: 'center center',
  },
  {
    id: 'memory-02',
    src: '/images/memories/img2.jpeg',
    person: 'both',
    title: 'Our Beautiful Moments',
    caption: 'Campus memories & endless laughter ✨',
    alt: 'A joyful memory of Saki and Akku together outdoors',
    aspectRatio: 'portrait',
    objectPosition: 'center 25%',
  },
  {
    id: 'memory-03',
    src: '/images/memories/img3.jpeg',
    person: 'akku',
    title: 'My Gorgeous Akku',
    caption: 'Dressed in elegance & grace 🌸',
    alt: 'A beautiful portrait of Akku in traditional attire',
    aspectRatio: 'portrait',
    objectPosition: 'center 20%',
  },
  {
    id: 'memory-04',
    src: '/images/memories/img4.jpeg',
    person: 'akku',
    title: 'Precious Moments',
    caption: 'Her pure, sweetest smile 🧸',
    alt: 'A sweet memory of Akku hugging a pink teddy bear',
    aspectRatio: 'portrait',
    objectPosition: 'center 25%',
  },
  {
    id: 'memory-05',
    src: '/images/memories/img5.jpeg',
    person: 'both',
    title: 'Warm Comfort',
    caption: 'Right where my heart belongs 🌹',
    alt: 'A romantic moment with Saki resting on Akku shoulder',
    aspectRatio: 'portrait',
    objectPosition: 'center 25%',
  },
  {
    id: 'memory-06',
    src: '/images/memories/img6.jpeg',
    person: 'akku',
    title: 'Growing Beautifully',
    caption: 'From sweet memories to forever love 💫',
    alt: 'A memory collage of Akku childhood and present day',
    aspectRatio: 'portrait',
    objectPosition: 'center 20%',
  },
] as const;

/**
 * Preload all 6 photos into the browser cache when the application initializes.
 * Ensures zero lag when the first photo animation reveals.
 */
export function preloadMemoryPhotos(): Promise<void[]> {
  if (typeof window === 'undefined') return Promise.resolve([]);

  const promises = MEMORY_PHOTOS.map((photo) => {
    return new Promise<void>((resolve) => {
      const img = new Image();
      img.src = photo.src;
      img.onload = () => resolve();
      img.onerror = () => {
        if (import.meta.env.DEV) {
          console.warn(`[MemoryPhoto] Failed to preload image: ${photo.src}`);
        }
        resolve(); // Continue without blocking other assets
      };
    });
  });

  return Promise.all(promises);
}
