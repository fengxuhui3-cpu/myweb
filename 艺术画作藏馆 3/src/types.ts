export interface Painting {
  id: string;
  title: string;
  titleEn: string;
  artist: string;
  artistEn: string;
  year: string;
  style: string;
  styleEn: string;
  medium: string;
  mediumEn: string;
  dimensions: string;
  location: string;
  locationEn: string;
  description: string;
  descriptionEn: string;
  imageUrl: string;
  accentColor: string; // Tailwind color class or hex string for iOS dynamic theming
  bgGradient: string; // background gradient for details
}

export interface Collection {
  id: string;
  name: string;
  description?: string;
  paintingIds: string[];
  createdAt: string;
}

export interface PaintingNote {
  paintingId: string;
  noteText: string;
  tags: string[];
  updatedAt: string;
}

export type ActiveTab = 'discover' | 'studio';
