"use client";

import React, { useState, useCallback, useEffect } from "react";
import { 
  GAME_DATA, 
  type Character, 
  type Dialogue, 
  type LessonContent,
  type Exercise,
  type CodeExample
} from "@/constants/constant";
import { GameCanvas } from "@/components/room/GameCanvas";
import { LearningInterface } from "@/components/room/LearningInterface";
import { Controls } from "@/components/room/Controls";
import type { ActiveDialogue } from '@/types';

interface CodeEditorState {
  code: string;
  output: string;
  isRunning: boolean;
}

export default function Room() {
  const [playerPos, setPlayerPos] = useState(GAME_DATA.characters.player.initialPosition);
  const [activeDialogue, setActiveDialogue] = useState<ActiveDialogue | null>(null);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [currentExample, setCurrentExample] = useState<CodeExample | null>(null);
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
  const [codeEditor, setCodeEditor] = useState<CodeEditorState>({
    code: "",
    output: "",
    isRunning: false,
  });

  const handleCloseDialog = useCallback(() => {
    setActiveDialogue(null);
    setCurrentExample(null);
    setCurrentExercise(null);
  }, []);

  const handleDialogueAction = useCallback(
    (dialogue: Dialogue) => {
      if (!activeDialogue?.lesson) return;

      switch (dialogue.action) {
        case "showExample":
          if (dialogue.actionData?.exampleId) {
            const example = activeDialogue.lesson.examples.find(
              (ex: CodeExample) => ex.id === dialogue.actionData?.exampleId
            );
            if (example) setCurrentExample(example);
          }
          break;
        case "startExercise":
          if (dialogue.actionData?.exerciseId) {
            const exercise = activeDialogue.lesson.exercises.find(
              (ex: Exercise) => ex.id === dialogue.actionData?.exerciseId
            );
            if (exercise) {
              setCurrentExercise(exercise);
              setCodeEditor((prev) => ({
                ...prev,
                code: exercise.starterCode,
              }));
            }
          }
          break;
        case "showLesson":
          break;
      }
    },
    [activeDialogue]
  );

  const checkInteractions = useCallback(() => {
    if (activeDialogue) {
      const currentCharacter = activeDialogue.character;
      const distance = Math.sqrt(
        Math.pow(playerPos.x - currentCharacter.initialPosition.x, 2) +
          Math.pow(playerPos.y - currentCharacter.initialPosition.y, 2)
      );

      if (!currentCharacter.interactions) return;

      const interaction = currentCharacter.interactions.find(
        (i) => distance <= i.triggerDistance
      );

      if (!interaction) {
        handleCloseDialog();
        return;
      }
    }

    if (!activeDialogue) {
      GAME_DATA.characters.npcs.forEach((character) => {
        const distance = Math.sqrt(
          Math.pow(playerPos.x - character.initialPosition.x, 2) +
            Math.pow(playerPos.y - character.initialPosition.y, 2)
        );

        const interaction = character.interactions.find(
          (interaction) => distance <= interaction.triggerDistance
        );

        if (interaction) {
          const dialogue = interaction.dialogues.find((d) => {
            if (d.requires) {
              return completedLessons.has(d.requires);
            }
            return true;
          });

          if (dialogue) {
            const newActiveDialogue = {
              character,
              dialogue,
              lesson: interaction.lesson,
            };

            setActiveDialogue(newActiveDialogue);

            if (dialogue.action) {
              handleDialogueAction(dialogue);
            }
          }
        }
      });
    }
  }, [
    playerPos,
    completedLessons,
    handleDialogueAction,
    activeDialogue,
    handleCloseDialog,
  ]);

  const handleNextDialogue = useCallback(() => {
    if (!activeDialogue) return;

    if (activeDialogue.dialogue.next) {
      const character = activeDialogue.character;
      const nextDialogue = character.interactions[0].dialogues.find(
        (d) => d.id === activeDialogue.dialogue.next
      );

      if (nextDialogue) {
        const newActiveDialogue = {
          character,
          dialogue: nextDialogue,
          lesson: activeDialogue.lesson,
        };

        setActiveDialogue(newActiveDialogue);

        if (nextDialogue.action) {
          handleDialogueAction(nextDialogue);
        }
      }
    } else {
      const dialogueId = activeDialogue.dialogue.id;
      if (activeDialogue.lesson && dialogueId) {
        setCompletedLessons((prev) => new Set([...prev, dialogueId]));
      }
      handleCloseDialog();
    }
  }, [activeDialogue, handleDialogueAction, handleCloseDialog]);

  const handleRunCode = useCallback(async () => {
    if (!currentExercise) return;

    setCodeEditor((prev) => ({ ...prev, isRunning: true }));
    try {
      const evaluateCode = new Function("return " + codeEditor.code);
      const result = evaluateCode();

      const passed = currentExercise.testCases.every(
        (test: { expected: any }) =>
          JSON.stringify(result) === JSON.stringify(test.expected)
      );

      setCodeEditor((prev) => ({
        ...prev,
        output: passed ? "All tests passed! 🎉" : "Tests failed. Try again!",
        isRunning: false,
      }));

      if (passed) {
        setCompletedLessons((prev) => new Set([...prev, currentExercise.id]));
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      setCodeEditor((prev) => ({
        ...prev,
        output: `Error: ${errorMessage}`,
        isRunning: false,
      }));
    }
  }, [currentExercise, codeEditor.code]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const speed = 5;
      let newPos = { ...playerPos };

      switch (e.key) {
        case "ArrowUp":
          newPos.y = Math.max(0, newPos.y - speed);
          break;
        case "ArrowDown":
          newPos.y = Math.min(
            GAME_DATA.config.gridSize.height - 32,
            newPos.y + speed
          );
          break;
        case "ArrowLeft":
          newPos.x = Math.max(0, newPos.x - speed);
          break;
        case "ArrowRight":
          newPos.x = Math.min(
            GAME_DATA.config.gridSize.width - 32,
            newPos.x + speed
          );
          break;
      }

      setPlayerPos(newPos);
    },
    [playerPos]
  );

  const handleDialogueUpdate = useCallback((dialogueUpdate: ActiveDialogue | null) => {
    setActiveDialogue(dialogueUpdate);
  }, []);

  // Check for interactions when player position changes
  useEffect(() => {
    checkInteractions();
  }, [playerPos, checkInteractions]);

  return (
    <div
      className="relative w-screen h-screen overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{
        // backgroundImage: 'url("/images/game-bg.jpg")',
        height: "100vh",
        width: "100vw",
      }}
    >
      <div className="absolute inset-0 bg-black/30" />
      <div className="relative h-full w-full flex justify-center items-center">
        <div className="relative">
          <GameCanvas
            playerPos={playerPos}
            characters={GAME_DATA.characters.npcs}
            characterEmojis={GAME_DATA.characters.emojis}
            onKeyDown={handleKeyDown}
            onDialogueUpdate={handleDialogueUpdate}
          />

          {(currentExample || currentExercise) && (
            <LearningInterface
              activeDialogue={activeDialogue}
              currentExample={currentExample}
              currentExercise={currentExercise}
              characterEmojis={GAME_DATA.characters.emojis}
              codeEditor={codeEditor}
              onCloseDialog={handleCloseDialog}
              onNextDialogue={handleNextDialogue}
              onCodeChange={(code) => setCodeEditor((prev) => ({ ...prev, code }))}
              onRunCode={handleRunCode}
            />
          )}
        </div>

        <Controls />
      </div>
    </div>
  );
}
