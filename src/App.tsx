/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, GraduationCap } from 'lucide-react';
import { CurriculumForm, CurriculumParams } from './components/CurriculumForm';
import { CurriculumDisplay, Curriculum } from './components/CurriculumDisplay';
import { GoogleGenAI, Type } from '@google/genai';

export default function App() {
  const [curriculum, setCurriculum] = useState<Curriculum | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (params: CurriculumParams) => {
    setIsLoading(true);
    setError(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const { skill, level, semesters, hoursPerSemester } = params;

      const prompt = `Generate a comprehensive curriculum for learning "${skill}" at a "${level}" level.
The curriculum should be structured into ${semesters} semesters, with approximately ${hoursPerSemester} hours of study per semester.
Assign a progressive difficulty level to each semester (e.g., if 3 semesters: Semester 1 is "Basics", Semester 2 is "Core", Semester 3 is "Advanced". Scale this appropriately for the requested number of semesters).
For each semester, provide a list of courses. For each course, provide a name, a brief description, the total estimated hours, and a list of key topics covered.
For each topic, include the topic name and the specific estimated hours to complete that topic. The sum of topic hours should roughly equal the course's total estimated hours.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: {
                type: Type.STRING,
                description: 'The title of the curriculum',
              },
              description: {
                type: Type.STRING,
                description: 'A brief overview of the curriculum',
              },
              semesters: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    semesterNumber: {
                      type: Type.INTEGER,
                      description: 'The semester number (e.g., 1, 2, 3)',
                    },
                    level: {
                      type: Type.STRING,
                      description: 'The progressive level of the semester (e.g., Basics, Core, Advanced)',
                    },
                    title: {
                      type: Type.STRING,
                      description: 'The theme or title of the semester',
                    },
                    courses: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          courseName: {
                            type: Type.STRING,
                            description: 'The name of the course',
                          },
                          description: {
                            type: Type.STRING,
                            description: 'A brief description of the course',
                          },
                          estimatedHours: {
                            type: Type.INTEGER,
                            description: 'The estimated number of hours to complete the course',
                          },
                          topics: {
                            type: Type.ARRAY,
                            items: {
                              type: Type.OBJECT,
                              properties: {
                                name: {
                                  type: Type.STRING,
                                  description: 'The name of the topic',
                                },
                                estimatedHours: {
                                  type: Type.INTEGER,
                                  description: 'The estimated number of hours to complete this topic',
                                },
                              },
                              required: ['name', 'estimatedHours'],
                            },
                            description: 'A list of key topics covered in the course with their estimated hours',
                          },
                        },
                        required: ['courseName', 'description', 'estimatedHours', 'topics'],
                      },
                    },
                  },
                  required: ['semesterNumber', 'level', 'title', 'courses'],
                },
              },
            },
            required: ['title', 'description', 'semesters'],
          },
        },
      });

      const jsonStr = response.text?.trim();
      if (!jsonStr) {
        throw new Error('Failed to generate curriculum');
      }

      const data = JSON.parse(jsonStr);
      setCurriculum(data);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden font-sans">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-300/30 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-violet-300/30 blur-[120px]" />
        <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] rounded-full bg-emerald-300/20 blur-[100px]" />
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-2xl mb-6 shadow-sm">
            <GraduationCap className="w-10 h-10 text-indigo-600" />
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
            GenAI <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Curriculum</span> Generator
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Design professional, structured learning paths powered by AI. Enter your target skill, level, and timeline to instantly generate a comprehensive curriculum.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <CurriculumForm onSubmit={handleGenerate} isLoading={isLoading} />
          
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-center flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              {error}
            </motion.div>
          )}
        </div>

        {curriculum && !isLoading && (
          <CurriculumDisplay curriculum={curriculum} />
        )}
      </div>
    </div>
  );
}
