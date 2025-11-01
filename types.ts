export interface ImageData {
  dataUrl: string;
  mimeType: string;
}

export interface PhotoState {
  original: ImageData | null;
  edited: string | null; // Data URL of the edited image
}
