
export interface Line {
  original: string;
  translation: string;
  ipa: string;
}

export interface LyricsData {
  title: string;
  artist: string;
  language: string;
  lyrics: Line[];
}
