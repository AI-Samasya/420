import { Character, Dialogue, LessonContent } from '@/constants/constant';

export interface ActiveDialogue {
  character: Character;
  dialogue: Dialogue;
  lesson?: LessonContent;
} 