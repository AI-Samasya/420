export interface Position {
  x: number;
  y: number;
}

export interface CodeExample {
  id: string;
  title: string;
  code: string;
  explanation: string;
  output?: string;
}

export interface Exercise {
  id: string;
  question: string;
  hints: string[];
  starterCode: string;
  solution: string;
  testCases: {
    input: any[];
    expected: any;
  }[];
}

export interface LessonContent {
  id: string;
  title: string;
  description: string;
  examples: CodeExample[];
  exercises: Exercise[];
  nextLessonId?: string;
}

export interface Dialogue {
  id?: string;
  text: string;
  next?: string;
  requires?: string;
  action?: "showExample" | "startExercise" | "showLesson";
  actionData?: {
    exampleId?: string;
    exerciseId?: string;
    lessonId?: string;
  };
  speaker?: string;
}

export interface Interaction {
  type: "teach" | "practice" | "guide";
  triggerDistance: number;
  dialogues: Dialogue[];
  lesson?: LessonContent;
}

export interface Character {
  id: string;
  name: string;
  sprite: string;
  role: "teacher" | "student" | "guide" | "player";
  initialPosition: Position;
  movementSpeed: number;
  allowedMovements: ("up" | "down" | "left" | "right")[];
  boundaryBox?: {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
  };
  interactions?: Interaction[];
}

// Helper function to get teacher data from localStorage
const getTeacherData = () => {
  if (typeof window !== "undefined") {
    try {
      const savedTeachers = localStorage.getItem("gameTeachers");
      if (savedTeachers) {
        const teachers = JSON.parse(savedTeachers);
        return {
          names: {
            array_teacher: teachers.teacher1?.name || "Professor Pixel",
            method_master: teachers.teacher2?.name || "Captain Code",
            practice_pal: teachers.teacher3?.name || "Dr. Array",
            algorithm_sage: teachers.teacher4?.name || "Tech Whiz Tony",
            debug_buddy: teachers.teacher5?.name || "The Array Alchemist",
            code_reviewer: "Code Reviewer",
            test_master: "Test Master",
            claude: "Claude",
          },
          introductions: {
            array_teacher:
              teachers.teacher1?.example_behavior?.introduction ||
              "Meet Professor Pixel, who turns every lesson into an adventure! Today, we're exploring the world of arrays.",
            method_master:
              teachers.teacher2?.example_behavior?.introduction ||
              "Ahoy, matey! Set sail on the Seas of Arrays with Captain Code, where each treasure chest contains a new part of array knowledge.",
            practice_pal:
              teachers.teacher3?.example_behavior?.introduction ||
              "Hello, Junior Scientist! I'm Dr. Array. Let's explore the mysteries of arrays in our lab today!",
            algorithm_sage:
              teachers.teacher4?.example_behavior?.introduction ||
              "Greetings, Coding Ace! This is Tech Whiz Tony, and we're about to dive into some cool array tricks with gadgets.",
            debug_buddy:
              teachers.teacher5?.example_behavior?.introduction ||
              "Welcome, young adventurer, to the magical world of numbers with The Array Alchemist. Here, arrays weave spells!",
          },
        };
      }
    } catch (error) {
      console.error("Error parsing teacher data from localStorage:", error);
    }
  }
  return { names: {}, introductions: {} };
};

const teacherData = getTeacherData();

export const GAME_DATA = {
  config: {
    gridSize: { width: 2000, height: 1000 },
    cellSize: 32,
    backgroundColor: "#f0f9ff",
    camera: {
      bgOffsetX: 50,
      bgOffsetY: 500,
      manualOffsetX: 800,
      manualOffsetY: -100,
    },
  },

  characters: {
    player: {
      id: "player",
      name: "Player",
      sprite: "🚶",
      role: "player" as const,
      initialPosition: { x: 100, y: 100 },
      movementSpeed: 5,
      allowedMovements: ["up", "down", "left", "right"],
    } as Character,

    npcs: [
      {
        id: "array_teacher",
        name: teacherData.names.array_teacher,
        sprite: "👨‍🏫",
        role: "teacher" as const,
        initialPosition: { x: 120, y: 320 },
        movementSpeed: 3,
        allowedMovements: ["up", "down", "left", "right"] as const,
        boundaryBox: {
          minX: 150,
          maxX: 250,
          minY: 100,
          maxY: 200,
        },
        interactions: [
          {
            type: "teach",
            triggerDistance: 60,
            dialogues: [
              {
                id: "welcome",
                text: teacherData.introductions.array_teacher,
                next: "start_arrays",
              },
              {
                id: "start_arrays",
                text: "Let's start with creating arrays. Pay attention to this example!",
                action: "showExample",
                actionData: { exampleId: "array_creation" },
                next: "try_exercise",
              },
              {
                id: "try_exercise",
                text: "Now, let's practice creating an array. Ready to try?",
                action: "startExercise",
                actionData: { exerciseId: "create_array" },
              },
            ],
            lesson: {
              id: "arrays_intro",
              title: "Introduction to Arrays",
              description:
                "Learn the basics of arrays in JavaScript/TypeScript",
              examples: [
                {
                  id: "array_creation",
                  title: "Creating Arrays",
                  code: `// Different ways to create arrays
const numbers = [1, 2, 3, 4, 5];
const fruits = ['apple', 'banana', 'orange'];
const emptyArray = [];`,
                  explanation:
                    "Arrays can be created using square brackets [] and can hold any type of data.",
                },
              ],
              exercises: [
                {
                  id: "create_array",
                  question:
                    "Create an array containing the numbers 1 through 5",
                  hints: [
                    "Use square brackets []",
                    "Separate numbers with commas",
                  ],
                  starterCode: "const numbers = ",
                  solution: "[1, 2, 3, 4, 5]",
                  testCases: [
                    {
                      input: [],
                      expected: [1, 2, 3, 4, 5],
                    },
                  ],
                },
              ],
              nextLessonId: "array_methods",
            },
          },
        ],
      },
      {
        id: "method_master",
        name: teacherData.names.method_master,
        sprite: "👩‍💻",
        role: "guide" as const,
        initialPosition: { x: 700, y: 600 },
        movementSpeed: 4,
        allowedMovements: ["up", "down", "left", "right"] as const,
        boundaryBox: {
          minX: 350,
          maxX: 450,
          minY: 250,
          maxY: 350,
        },
        interactions: [
          {
            type: "practice",
            triggerDistance: 50,
            dialogues: [
              {
                id: "intro_methods",
                text: teacherData.introductions.method_master,
                next: "show_methods",
                requires: "arrays_intro",
              },
              {
                id: "show_methods",
                text: "Let's see how to add elements to arrays.",
                action: "showExample",
                actionData: { exampleId: "array_push" },
                next: "practice_push",
              },
              {
                id: "practice_push",
                text: "Now it's your turn! Try adding an element to an array.",
                action: "startExercise",
                actionData: { exerciseId: "use_push" },
              },
            ],
            lesson: {
              id: "array_methods",
              title: "Array Methods",
              description: "Learn essential array methods",
              examples: [
                {
                  id: "array_push",
                  title: "Adding Elements",
                  code: `const numbers = [1, 2, 3];
numbers.push(4);    // Adds 4 to end
numbers.unshift(0); // Adds 0 to start
console.log(numbers); // [0, 1, 2, 3, 4]`,
                  explanation:
                    "Use push() to add to the end and unshift() to add to the start of an array.",
                },
              ],
              exercises: [
                {
                  id: "use_push",
                  question:
                    "Add the number 4 to the end of the array using push()",
                  hints: [
                    "Use the push() method",
                    "push() adds to the end of the array",
                  ],
                  starterCode: `const numbers = [1, 2, 3];
// Add 4 to the array`,
                  solution: "numbers.push(4)",
                  testCases: [
                    {
                      input: [[1, 2, 3]],
                      expected: [1, 2, 3, 4],
                    },
                  ],
                },
              ],
            },
          },
        ],
      },
      {
        id: "practice_pal",
        name: teacherData.names.practice_pal,
        sprite: "🤖",
        role: "student" as const,
        initialPosition: { x: 500, y: 400 },
        movementSpeed: 3,
        allowedMovements: ["up", "down", "left", "right"] as const,
        boundaryBox: {
          minX: 550,
          maxX: 650,
          minY: 150,
          maxY: 250,
        },
        interactions: [
          {
            type: "practice",
            triggerDistance: 40,
            dialogues: [
              {
                id: "practice_intro",
                text: teacherData.introductions.practice_pal,
                next: "start_practice",
                requires: "arrays_intro",
              },
              {
                id: "start_practice",
                text: "Let's solve some array exercises together!",
                action: "startExercise",
                actionData: { exerciseId: "create_array" },
              },
            ],
          },
        ],
      },
      {
        id: "algorithm_sage",
        name: teacherData.names.algorithm_sage,
        sprite: "🧙",
        role: "teacher" as const,
        initialPosition: { x: 300, y: 200 },
        movementSpeed: 3,
        allowedMovements: ["up", "down", "left", "right"] as const,
        boundaryBox: {
          minX: 280,
          maxX: 320,
          minY: 180,
          maxY: 220,
        },
        interactions: [
          {
            type: "teach",
            triggerDistance: 50,
            dialogues: [
              {
                id: "algo_welcome",
                text: teacherData.introductions.algorithm_sage,
                next: "start_sorting",
              },
              {
                id: "start_sorting",
                text: "Let's begin with sorting algorithms. Here's a simple example.",
                action: "showExample",
                actionData: { exampleId: "bubble_sort" },
              },
            ],
            lesson: {
              id: "sorting_basics",
              title: "Introduction to Sorting",
              description: "Learn basic sorting algorithms",
              examples: [
                {
                  id: "bubble_sort",
                  title: "Bubble Sort",
                  code: `function bubbleSort(arr) {
  for(let i = 0; i < arr.length; i++) {
    for(let j = 0; j < arr.length - i - 1; j++) {
      if(arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}`,
                  explanation:
                    "Bubble sort repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.",
                },
              ],
              exercises: [],
            },
          },
        ],
      },
      {
        id: "debug_buddy",
        name: teacherData.names.debug_buddy,
        sprite: "🔍",
        role: "guide" as const,
        initialPosition: { x: 450, y: 300 },
        movementSpeed: 4,
        allowedMovements: ["up", "down", "left", "right"] as const,
        boundaryBox: {
          minX: 430,
          maxX: 470,
          minY: 280,
          maxY: 320,
        },
        interactions: [
          {
            type: "guide",
            triggerDistance: 45,
            dialogues: [
              {
                text: teacherData.introductions.debug_buddy,
                next: "debug_tip",
              },
              {
                id: "debug_tip",
                text: "Remember: console.log() is your friend when debugging!",
              },
            ],
          },
        ],
      },
      {
        id: "code_reviewer",
        name: teacherData.names.code_reviewer,
        sprite: "📝",
        role: "guide" as const,
        initialPosition: { x: 600, y: 250 },
        movementSpeed: 3,
        allowedMovements: ["up", "down", "left", "right"] as const,
        boundaryBox: {
          minX: 580,
          maxX: 620,
          minY: 230,
          maxY: 270,
        },
        interactions: [
          {
            type: "guide",
            triggerDistance: 40,
            dialogues: [
              {
                text: "Want me to review your code? I'll help you write cleaner code!",
                next: "review_tip",
              },
              {
                id: "review_tip",
                text: "Tip: Meaningful variable names make code easier to understand.",
              },
            ],
          },
        ],
      },
      {
        id: "test_master",
        name: teacherData.names.test_master,
        sprite: "⚡",
        role: "teacher" as const,
        initialPosition: { x: 800, y: 400 },
        movementSpeed: 3,
        allowedMovements: ["up", "down", "left", "right"] as const,
        boundaryBox: {
          minX: 780,
          maxX: 820,
          minY: 380,
          maxY: 420,
        },
        interactions: [
          {
            type: "teach",
            triggerDistance: 55,
            dialogues: [
              {
                text: "Testing is crucial! Let me teach you about unit testing.",
                next: "test_example",
              },
              {
                id: "test_example",
                text: "Here's how to write a basic test:",
                action: "showExample",
                actionData: { exampleId: "unit_test" },
              },
            ],
            lesson: {
              id: "testing_101",
              title: "Introduction to Testing",
              description: "Learn the basics of unit testing",
              examples: [
                {
                  id: "unit_test",
                  title: "Basic Unit Test",
                  code: `test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});`,
                  explanation:
                    "Unit tests verify that individual pieces of code work as expected.",
                },
              ],
              exercises: [],
            },
          },
        ],
      },
      {
        id: "claude",
        name: teacherData.names.claude,
        sprite: "🎮",
        role: "guide" as const,
        initialPosition: { x: 900, y: 500 },
        movementSpeed: 4,
        allowedMovements: ["up", "down", "left", "right"] as const,
        boundaryBox: {
          minX: 880,
          maxX: 920,
          minY: 480,
          maxY: 520,
        },
        interactions: [
          {
            type: "guide",
            triggerDistance: 50,
            dialogues: [
              {
                text: "Hello! I'm Claude, your AI programming assistant. How can I help you today?",
                next: "ai_help",
              },
              {
                id: "ai_help",
                text: "I can help you with coding problems, explain concepts, or review your code!",
              },
            ],
          },
        ],
      },
    ],

    emojis: {
      teacher: "👨‍🏫",
      student: "👨‍🎓",
      guide: "💁‍♀️",
      player: "🚶",
      array_teacher: "👨‍🏫",
      method_master: "👩‍💻",
      practice_pal: "🤖",
      algorithm_sage: "🧙",
      debug_buddy: "🔍",
      code_reviewer: "📝",
      test_master: "⚡",
      claude: "🎮",
    },
  },
};

// Export commonly used items for convenience
export const characters = GAME_DATA.characters.npcs;
export const characterEmojis = GAME_DATA.characters.emojis;
export const PLAYGROUND_CONFIG = GAME_DATA.config;
