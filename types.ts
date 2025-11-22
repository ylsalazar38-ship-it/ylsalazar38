
export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  isLoading?: boolean;
  error?: string;
  ratio?: string;
}

export interface SavedMood {
  id: string;
  prompt: string;
  timestamp: number;
  images: GeneratedImage[];
  style: string;
}

export interface GeneratorFormProps {
  onGenerate: (prompt: string, style: string, language: string, count: number, ratio: string) => void;
  isLoading: boolean;
}

export interface ImageGridProps {
  images: GeneratedImage[];
}

export const STYLES = [
  "Cinematografico",
  "Realistico",
  "Cartoon",
  "Macro Photography",
  "High Contrast",
  "Soft Focus",
  "Mood Dark Ambient",
  "Pastel Dream Core",
  "Mistic Aura Photography",
  "Esoteric Fantasy Style",
  "Golden Light Spiritual Style",
  "Zen Minimal Photography",
  "Boho Chic",
  "Oriental Style"
];

export const LANGUAGES = [
  { code: "it", label: "Italiano" },
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
  { code: "ja", label: "Japanese" }
];

export const ASPECT_RATIOS = [
  { id: "1:1", label: "1:1 (Quadrato)", apiValue: "1:1" },
  { id: "4:5", label: "4:5 (Social Portrait)", apiValue: "3:4" },
  { id: "1.91:1", label: "1.91:1 (Landscape)", apiValue: "16:9" },
  { id: "9:16", label: "9:16 (Story)", apiValue: "9:16" },
  { id: "16:9", label: "16:9 (Cinema)", apiValue: "16:9" },
  { id: "cover-9:16", label: "Per Cover 9:16", apiValue: "9:16" },
  { id: "1584x396", label: "1584x396 px (Banner)", apiValue: "16:9" },
  { id: "1128x191", label: "1128x191 px (Header)", apiValue: "16:9" }
];
