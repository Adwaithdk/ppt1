export type SlideStyle = 'corporate' | 'educational' | 'creative' | 'minimalist';

export type AnimationTheme = 'fade' | 'slide' | 'zoom' | 'bounce';

export interface Slide {
  title: string;
  content: string[];
  explanation: string;
  visualDescription: string;
  imageQuery: string;
  imageUrl?: string;
  backgroundColor?: string;
  textColor?: string;
  layout: 'title' | 'content' | 'two-column' | 'image-right' | 'image-left' | 'quote' | 'comparison' | 'timeline';
  animation?: AnimationTheme;
  notes?: string;
}

export interface Presentation {
  title: string;
  subtitle: string;
  slides: Slide[];
  style: SlideStyle;
  animationTheme: AnimationTheme;
  themeColor: string;
}

export interface GeneratorState {
  topic: string;
  style: SlideStyle;
  isGenerating: boolean;
  presentation: Presentation | null;
  error: string | null;
}
