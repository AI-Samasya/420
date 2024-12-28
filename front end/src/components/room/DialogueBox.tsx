import React, { useState, useEffect, useRef } from "react";
import { type Character, type Dialogue } from "@/constants/constant";
import axios from "axios";

interface DialogueBoxProps {
  character: Character;
  dialogue: Dialogue;
  characterEmojis: Record<string, string>;
  position?: { x: number; y: number };
}

interface Message {
  sender: "user" | "teacher";
  message: string;
}

export const DialogueBox: React.FC<DialogueBoxProps> = ({
  character,
  dialogue,
  characterEmojis,
  position,
}) => {
  const [userMessage, setUserMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const initRef = useRef(false);

  const extractTeacherResponse = (response: any): string => {
    if (typeof response?.teacher_response?.teacher_response === "string") {
      return response.teacher_response.teacher_response;
    }
    if (typeof response?.teacher_response === "string") {
      return response.teacher_response;
    }
    return "I'm here to help you learn!";
  };

  useEffect(() => {
    // Only initialize if it hasn't been done before
    if (!initRef.current) {
      const initialMessage = {
        sender: "user" as const,
        message: "Hi! Can you explain what we'll be learning today?",
      };
      setChatHistory([initialMessage]);
      handleInitialResponse();
      initRef.current = true;
    }
  }, []);

  const handleInitialResponse = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        "https://c6b6-120-61-245-194.ngrok-free.app/chat_with_teacher",
        {
          teacher_name: character.name,
          topic: localStorage.getItem("studyTopic") || "Computer Science",
          user_msg: "Hi! Can you explain what we'll be learning today?",
        }
      );

      const teacherResponse = extractTeacherResponse(response.data);

      setChatHistory((prev) => [
        ...prev,
        {
          sender: "teacher",
          message: teacherResponse,
        },
      ]);
    } catch (error) {
      console.error("Error getting initial response:", error);
      setChatHistory((prev) => [
        ...prev,
        {
          sender: "teacher",
          message:
            "Hello! I'm here to help you learn. What would you like to know?",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userMessage.trim()) return;

    const newMessage = userMessage.trim();
    setUserMessage("");

    setChatHistory((prev) => [
      ...prev,
      { sender: "user", message: newMessage },
    ]);
    setIsLoading(true);

    try {
      const response = await axios.post(
        "https://c6b6-120-61-245-194.ngrok-free.app/chat_with_teacher",
        {
          teacher_name: character.name,
          topic: localStorage.getItem("studyTopic") || "Computer Science",
          user_msg: newMessage,
        }
      );

      const teacherResponse = extractTeacherResponse(response.data);

      setChatHistory((prev) => [
        ...prev,
        {
          sender: "teacher",
          message: teacherResponse,
        },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      setChatHistory((prev) => [
        ...prev,
        {
          sender: "teacher",
          message:
            "I apologize, but I'm having trouble responding right now. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed z-50 top-4 left-4">
      {/* Chat Interface */}
      <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-slate-200 w-[450px]">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6 pb-4 border-b border-slate-100">
          <div className="relative">
            <span className="text-5xl">{characterEmojis[character.role]}</span>
            <span className="absolute bottom-1 right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
          </div>
          <div>
            <h3 className="font-semibold text-xl text-slate-800">
              {character.name}
            </h3>
            <p className="text-slate-600 text-sm">
              {typeof dialogue.text === "string" ? dialogue.text : "Welcome!"}
            </p>
          </div>
        </div>

        {/* Chat History */}
        <div className="h-[400px] overflow-y-auto mb-6 space-y-4 pr-2 scrollbar-custom scrollbar scrollbar-track-gray-100 scrollbar-thumb-gray-400">
          {chatHistory.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.sender === "teacher" && (
                <div className="w-8 h-8 rounded-full flex items-center justify-center mr-2 mt-1">
                  <span className="text-2xl">
                    {characterEmojis[character.role]}
                  </span>
                </div>
              )}
              <div
                className={`max-w-[75%] rounded-2xl p-3.5 ${
                  msg.sender === "user"
                    ? "bg-blue-500 text-white rounded-tr-none"
                    : "bg-gray-100 text-slate-800 rounded-tl-none"
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {msg.message}
                </p>
              </div>
              {msg.sender === "user" && (
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center ml-2 mt-1">
                  <span className="text-sm font-medium text-blue-500">You</span>
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="w-8 h-8 rounded-full flex items-center justify-center mr-2">
                <span className="text-2xl">
                  {characterEmojis[character.role]}
                </span>
              </div>
              <div className="bg-gray-100 rounded-2xl rounded-tl-none p-3.5">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce"></span>
                  <span className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                  <span className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Message Input */}
        <div className="relative bg-gray-50 rounded-2xl p-2">
          <form
            onSubmit={handleSendMessage}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-transparent px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !userMessage.trim()}
              className="shrink-0 bg-blue-500 text-white rounded-xl p-3 hover:bg-blue-600 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
