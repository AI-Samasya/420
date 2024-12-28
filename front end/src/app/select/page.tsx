"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUploadCloud,
  FiX,
  FiTarget,
  FiBook,
  FiUser,
  FiUsers,
} from "react-icons/fi";
import Link from "next/link";

interface Chapter {
  level: number;
  title: string;
  description: string;
  learning_goal: string;
}

interface TeacherPersona {
  name: string;
  personality: string;
  teaching_style: string;
  signature_trait: string;
  example_behavior: {
    introduction: string;
    reward_system: string;
  };
}

interface TeacherPersonas {
  [key: string]: TeacherPersona;
}

export default function SelectPage() {
  const [topic, setTopic] = useState("");
  const [userDetails, setUserDetails] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [showChapters, setShowChapters] = useState(false);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [teachers, setTeachers] = useState<TeacherPersonas>({});
  const [activeTab, setActiveTab] = useState<"chapters" | "teachers">(
    "chapters"
  );
  const [loading, setLoading] = useState(false);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedTopic = localStorage.getItem("studyTopic");
    const savedUserDetails = localStorage.getItem("userDetails");
    if (savedTopic) setTopic(savedTopic);
    if (savedUserDetails) setUserDetails(savedUserDetails);
  }, []);

  // Save data to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("studyTopic", topic);
    localStorage.setItem("userDetails", userDetails);
  }, [topic, userDetails]);

  // Save teachers data to localStorage whenever it changes
  useEffect(() => {
    if (Object.keys(teachers).length > 0) {
      localStorage.setItem("gameTeachers", JSON.stringify(teachers));
    }
  }, [teachers]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    setUploadedFiles((prev) => [...prev, ...files]);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setUploadedFiles((prev) => [...prev, ...files]);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const [chaptersResponse, teachersResponse] = await Promise.all([
        fetch("https://c6b6-120-61-245-194.ngrok-free.app/chapters", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            topic,
            user_details: userDetails || "Default user details",
          }),
        }),
        fetch("https://c6b6-120-61-245-194.ngrok-free.app/teacher_persona", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            topic,
            user_details: userDetails || "Default user details",
          }),
        }),
      ]);

      const [chaptersData, teachersData] = await Promise.all([
        chaptersResponse.json(),
        teachersResponse.json(),
      ]);

      setChapters(chaptersData.chapters);
      setTeachers(teachersData);
      setShowChapters(true);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 sm:p-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 mb-4">
            What would you like to study?
          </h1>
          <p className="text-gray-600 text-lg">
            Enter your topic and tell us about yourself
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div>
            <label
              htmlFor="topic"
              className="block text-sm font-medium text-gray-700 mb-2 ml-1"
            >
              Study Topic
            </label>
            <input
              id="topic"
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter your study topic..."
              className="w-full p-6 text-lg rounded-2xl border-2 border-gray-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all duration-300 bg-white shadow-lg text-gray-800 placeholder-gray-400"
            />
          </div>

          <div>
            <label
              htmlFor="userDetails"
              className="block text-sm font-medium text-gray-700 mb-2 ml-1"
            >
              Tell us about yourself
            </label>
            <div className="relative">
              <div className="absolute left-6 top-6">
                <FiUser className="w-6 h-6 text-gray-400" />
              </div>
              <textarea
                id="userDetails"
                value={userDetails}
                onChange={(e) => setUserDetails(e.target.value)}
                placeholder="Example: I am a 12-year-old kid who loves science and space..."
                className="w-full p-6 pl-16 text-lg rounded-2xl border-2 border-gray-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all duration-300 bg-white shadow-lg text-gray-800 placeholder-gray-400 min-h-[120px] resize-y"
              />
            </div>
          </div>
        </motion.div>

        {topic && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-gray-100"
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
              Upload Documents for {topic}
            </h2>

            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-10 transition-all duration-300 ${
                dragActive
                  ? "border-indigo-500 bg-indigo-50/50"
                  : "border-gray-200 hover:border-indigo-400 bg-gray-50/50"
              }`}
            >
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                  <FiUploadCloud className="w-8 h-8 text-indigo-600" />
                </div>
                <p className="text-gray-600 text-center mb-4 text-lg">
                  Drag and drop your files here, or{" "}
                  <label className="text-indigo-600 hover:text-indigo-700 cursor-pointer font-medium hover:underline">
                    browse
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      onChange={handleFileInput}
                    />
                  </label>
                </p>
                <p className="text-sm text-gray-500">
                  Supported files: PDF, DOC, DOCX, TXT
                </p>
              </div>
            </div>

            {uploadedFiles.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                  Uploaded Files ({uploadedFiles.length})
                </h3>
                <div className="space-y-3">
                  {uploadedFiles.map((file, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-gray-50/80 backdrop-blur-sm p-4 rounded-xl flex items-center justify-between border border-gray-100 group hover:border-gray-200 transition-all duration-200"
                    >
                      <span className="text-gray-700 font-medium">
                        {file.name}
                      </span>
                      <button
                        onClick={() =>
                          setUploadedFiles((files) =>
                            files.filter((_, i) => i !== index)
                          )
                        }
                        className="text-gray-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-all duration-200"
                      >
                        <FiX className="w-5 h-5" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              disabled={loading}
              className="mt-8 w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Generating Chapters..." : "Continue"}
            </motion.button>
          </motion.div>
        )}

        <AnimatePresence>
          {showChapters && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              onClick={() => setShowChapters(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
                className="bg-white rounded-3xl p-8 max-w-4xl w-full max-h-[80vh] overflow-y-auto shadow-2xl"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Learning Journey: {topic}
                  </h2>
                  <Link href="/room">
                    <button className="bg-indigo-600 text-white py-2 px-4 rounded-xl font-medium hover:bg-indigo-700 transition-all duration-300 shadow-lg shadow-indigo-200">
                      Start Learning by playing
                    </button>
                  </Link>
                  <button
                    onClick={() => setShowChapters(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <FiX className="w-6 h-6 text-gray-600" />
                  </button>
                </div>

                <div className="flex gap-4 mb-6">
                  <button
                    onClick={() => setActiveTab("chapters")}
                    className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all duration-200 ${
                      activeTab === "chapters"
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <FiBook className="w-5 h-5" />
                      <span>Chapters</span>
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveTab("teachers")}
                    className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all duration-200 ${
                      activeTab === "teachers"
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <FiUsers className="w-5 h-5" />
                      <span>Teachers</span>
                    </div>
                  </button>
                </div>

                {activeTab === "chapters" ? (
                  <div className="space-y-4">
                    {chapters.map((chapter, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-gradient-to-r from-white to-gray-50 rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                            <FiBook className="w-5 h-5 text-indigo-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                              {chapter.title}
                            </h3>
                            <p className="text-gray-600 mb-3">
                              {chapter.description}
                            </p>
                            <div className="flex items-center gap-2 text-sm text-indigo-600">
                              <FiTarget className="w-4 h-4" />
                              <span>{chapter.learning_goal}</span>
                            </div>
                            <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-50 text-indigo-700">
                              Level {chapter.level}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {Object.entries(teachers).map(([key, teacher], index) => (
                      <motion.div
                        key={key}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-gradient-to-r from-white to-gray-50 rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                            <FiUser className="w-6 h-6 text-purple-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                              {teacher.name}
                            </h3>
                            <div className="space-y-2">
                              <p className="text-gray-600">
                                <span className="font-medium">
                                  Personality:
                                </span>{" "}
                                {teacher.personality}
                              </p>
                              <p className="text-gray-600">
                                <span className="font-medium">
                                  Teaching Style:
                                </span>{" "}
                                {teacher.teaching_style}
                              </p>
                              <p className="text-gray-600">
                                <span className="font-medium">
                                  Signature Trait:
                                </span>{" "}
                                {teacher.signature_trait}
                              </p>
                              <div className="mt-4 bg-purple-50 rounded-xl p-4">
                                <p className="text-purple-700 italic mb-2">
                                  "{teacher.example_behavior.introduction}"
                                </p>
                                <p className="text-purple-600 text-sm">
                                  {teacher.example_behavior.reward_system}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                <div className="mt-8 text-center">
                  <button
                    onClick={() => setShowChapters(false)}
                    className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors duration-200"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
