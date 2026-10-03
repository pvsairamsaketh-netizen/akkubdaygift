export interface MCQOption {
  text: string;
  isCorrect: boolean;
}

export interface MCQQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

export interface InterviewQuestionItem {
  id: string;
  question: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Interview Challenge';
  topic: string;
  tags: string[];
  hint: string;
  solution: string;
  timeComplexity?: string;
  spaceComplexity?: string;
  commonMistakes?: string[];
}

export interface CodingTestCase {
  input: string;
  expected_output: string;
  hidden?: boolean;
}

export interface CodingExercise {
  id: string;
  title: string;
  language: 'python' | 'sql' | 'pyspark' | 'bash';
  problemStatement: string;
  inputFormat?: string;
  outputFormat?: string;
  constraints?: string[];
  starterCode: string;
  solutionCode: string;
  hints: string[];
  testCases?: CodingTestCase[];
  expectedSQL?: string;
  timeComplexity?: string;
  spaceComplexity?: string;
}

export interface CheatSheetData {
  summary: string;
  definitions: { term: string; explanation: string }[];
  syntaxSnippets: { label: string; language: string; code: string }[];
  commonMistakes: string[];
  interviewTips: string[];
}

export interface DayLesson {
  id: string;
  dayNumber: number;
  subject: string;
  moduleTitle: string;
  title: string;
  description: string;
  durationMinutes: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  learningObjectives: string[];
  prerequisites: string[];
  learnContent: string; // Detailed educational lecture in markdown
  examples: { title: string; explanation: string; language: string; code: string; output?: string }[];
  practiceExercise: CodingExercise;
  mcqs: MCQQuestion[];
  interviewQuestions: InterviewQuestionItem[];
  cheatSheet: CheatSheetData;
  docLinks: { title: string; url: string }[];
  track?: 'de' | 'dsa';
  mrcetUnit?: string;
  academicLevel?: string;
  visualType?: string;
  videoUrl?: string;
  videoTitle?: string;
}

export interface AcademicNoteItem {
  id: string;
  user_id: string;
  day_number?: number | null;
  topic_id?: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  is_pinned: boolean;
  created_at?: string;
  updated_at?: string;
  formatted_date?: string;
}

export interface SQLTableColumn {
  cid: number;
  name: string;
  type: string;
  notnull: boolean;
  dflt_value: any;
  pk: boolean;
}

export interface SQLTableSchema {
  table_name: string;
  columns: SQLTableColumn[];
  row_count: number;
  sample_rows: Record<string, any>[];
}

export interface AcademicProgressData {
  user_id: string;
  completed_days: number[];
  day_status: Record<string, {
    learned?: boolean;
    practice?: boolean;
    mcqScore?: number;
    completed?: boolean;
  }>;
  quiz_scores: Record<string, number>;
  coding_submissions: Record<string, { code: string; passed: boolean; timestamp: string }>;
  saved_cheat_sheets: string[];
  bookmarks: string[];
  revision_items: {
    topic: string;
    dayNumber: number;
    difficulty: 'easy' | 'medium' | 'hard';
    nextReviewDate: string;
    stage: number;
  }[];
  capstone_progress: Record<string, boolean>;
  streak_count: number;
  last_active_date?: string;
  completion_percentage?: number;
}
