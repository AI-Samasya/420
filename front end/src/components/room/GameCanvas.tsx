"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  PLAYGROUND_CONFIG,
  type Character,
  type Dialogue,
} from "@/constants/constant";
import { DialogueBox } from "./DialogueBox";
import type { ActiveDialogue } from "@/types";

interface GameCanvasProps {
  playerPos: { x: number; y: number };
  characters: Character[];
  characterEmojis: Record<string, string>;
  onKeyDown: (e: KeyboardEvent) => void;
  onDialogueUpdate?: (dialogue: ActiveDialogue | null) => void;
}

// Get teacher data from localStorage
const getTeacherIntroductions = () => {
  if (typeof window !== "undefined") {
    try {
      const savedTeachers = localStorage.getItem("gameTeachers");
      if (savedTeachers) {
        const teachers = JSON.parse(savedTeachers);
        return {
          teacher:
            teachers.teacher1?.example_behavior?.introduction ||
            "Meet Professor Pixel, who turns every lesson into an adventure! Today, we're exploring the world of arrays.",
          student:
            teachers.teacher3?.example_behavior?.introduction ||
            "Hello, Junior Scientist! I'm Dr. Array. Let's explore the mysteries of arrays in our lab today!",
          guide:
            teachers.teacher2?.example_behavior?.introduction ||
            "Ahoy, matey! Set sail on the Seas of Arrays with Captain Code, where each treasure chest contains a new part of array knowledge.",
        };
      }
    } catch (error) {
      console.error(
        "Error parsing teacher introductions from localStorage:",
        error
      );
    }
  }
  return {
    teacher: "Meet Professor Pixel, who turns every lesson into an adventure!",
    student: "Hello, Junior Scientist! Let's explore together!",
    guide: "Ahoy, matey! Let's explore the world of coding!",
  };
};

export const GameCanvas: React.FC<GameCanvasProps> = ({
  playerPos,
  characters,
  characterEmojis,
  onKeyDown,
  onDialogueUpdate,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeDialogue, setActiveDialogue] = useState<Dialogue | null>(null);
  const [activeCharacter, setActiveCharacter] = useState<Character | null>(
    null
  );
  const [triggeredDialogs, setTriggeredDialogs] = useState<
    Record<string, boolean>
  >({});
  const [dialogPosition, setDialogPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const checkProximity = (
    playerPos: { x: number; y: number },
    characterPos: { x: number; y: number }
  ) => {
    const distance = Math.sqrt(
      Math.pow(playerPos.x - characterPos.x, 2) +
        Math.pow(playerPos.y - characterPos.y, 2)
    );
    return distance < 50; // Trigger dialog when player is within 50 units
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Load the background image
    const backgroundImage = new Image();
    backgroundImage.src = "https://i.imgur.com/Xok7KVh.png";

    // Initialize camera position
    let camera = {
      x: 0,
      y: 0,
    };

    const { bgOffsetX, bgOffsetY, manualOffsetX, manualOffsetY } =
      PLAYGROUND_CONFIG.camera;

    // Get dialogues from teacher data
    const teacherIntros = getTeacherIntroductions();
    const hardcodedDialogues: Record<string, Dialogue> = {
      teacher: { text: teacherIntros.teacher, speaker: "Teacher" },
      student: {
        text: teacherIntros.student,
        speaker: "Student",
      },
      guide: {
        text: teacherIntros.guide,
        speaker: "Guide",
      },
    };

    backgroundImage.onload = () => {
      const render = () => {
        // Clear canvas and draw background
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Camera position updates
        camera.x = playerPos.x - canvas.width / 2;
        camera.y = playerPos.y - canvas.height / 2;
        camera.x = Math.max(
          0,
          Math.min(camera.x, backgroundImage.width - canvas.width)
        );
        camera.y = Math.max(
          0,
          Math.min(camera.y, backgroundImage.height - canvas.height)
        );

        // Draw background
        ctx.drawImage(
          backgroundImage,
          camera.x + bgOffsetX,
          camera.y + bgOffsetY,
          canvas.width,
          canvas.height,
          0,
          0,
          canvas.width,
          canvas.height
        );

        // Render player
        const playerX = playerPos.x - camera.x + bgOffsetX + manualOffsetX;
        const playerY = playerPos.y - camera.y + bgOffsetY + manualOffsetY;
        ctx.font = "48px Arial";
        ctx.fillText(characterEmojis.player, playerX, playerY);
        
        // Add player label
        ctx.font = "bold 14px Arial";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.fillText("You", playerX + 12, playerY + 20);

        // Render characters and check interactions
        characters.forEach((char) => {
          const { x, y } = char.initialPosition;

          // Calculate screen position for character
          const screenX = x - camera.x + bgOffsetX + manualOffsetX;
          const screenY = y - camera.y + bgOffsetY + manualOffsetY;

          // Draw character emoji
          ctx.font = "48px Arial";
          ctx.fillStyle = "black";
          ctx.fillText(characterEmojis[char.role], screenX, screenY);
          
          // Draw character name label
          ctx.font = "bold 14px Arial";
          ctx.fillStyle = "black";
          ctx.textAlign = "center";
          ctx.fillText(char.name, screenX + 12, screenY + 20);

          // Check for dialogue triggers
          if (checkProximity(playerPos, { x, y })) {
            if (!triggeredDialogs[char.id]) {
              setActiveCharacter(char);
              setActiveDialogue(hardcodedDialogues[char.role] || null);
              setTriggeredDialogs((prev) => ({ ...prev, [char.id]: true }));
              setDialogPosition({ x: screenX, y: screenY });
            }
          } else {
            if (triggeredDialogs[char.id]) {
              setActiveDialogue(null);
              setActiveCharacter(null);
              setDialogPosition(null);
              setTriggeredDialogs((prev) => ({ ...prev, [char.id]: false }));
            }
          }
        });

        requestAnimationFrame(render);
      };

      render();
    };

    backgroundImage.onerror = () => {
      console.error("Failed to load the background image");
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [playerPos, characters, characterEmojis, onKeyDown, triggeredDialogs]);

  useEffect(() => {
    if (activeCharacter && activeDialogue && onDialogueUpdate) {
      onDialogueUpdate({
        character: activeCharacter,
        dialogue: activeDialogue,
      });
    } else if (!activeDialogue && onDialogueUpdate) {
      onDialogueUpdate(null);
    }
  }, [activeCharacter, activeDialogue, onDialogueUpdate]);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={PLAYGROUND_CONFIG.gridSize.width}
        height={PLAYGROUND_CONFIG.gridSize.height}
        className="border border-slate-200 rounded-xl shadow-lg bg-white/90"
      />
      {activeDialogue && activeCharacter && dialogPosition && (
        <DialogueBox
          character={activeCharacter}
          dialogue={activeDialogue}
          characterEmojis={characterEmojis}
          position={dialogPosition}
        />
      )}
    </div>
  );
};
