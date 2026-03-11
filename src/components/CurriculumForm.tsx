import React, { useState } from 'react';
import { BookOpen, Clock, Layers, Target, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

export interface CurriculumParams {
  skill: string;
  level: string;
  semesters: number;
  hoursPerSemester: number;
}

interface CurriculumFormProps {
  onSubmit: (params: CurriculumParams) => void;
  isLoading: boolean;
}

export function CurriculumForm({ onSubmit, isLoading }: CurriculumFormProps) {
  const [params, setParams] = useState<CurriculumParams>({
    skill: '',
    level: 'Beginner',
    semesters: 2,
    hoursPerSemester: 40,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(params);
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-white/20"
    >
      <div className="space-y-6">
        <div>
          <label htmlFor="skill" className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
            <Target className="w-4 h-4 text-indigo-500" />
            Target Skill or Subject
          </label>
          <input
            id="skill"
            type="text"
            required
            value={params.skill}
            onChange={(e) => setParams({ ...params, skill: e.target.value })}
            placeholder="e.g., Machine Learning, Web Development, Python"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white/50"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="level" className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-500" />
              Experience Level
            </label>
            <select
              id="level"
              value={params.level}
              onChange={(e) => setParams({ ...params, level: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white/50"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
            </select>
          </div>

          <div>
            <label htmlFor="semesters" className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-500" />
              Number of Semesters
            </label>
            <input
              id="semesters"
              type="number"
              min="1"
              max="8"
              required
              value={params.semesters}
              onChange={(e) => setParams({ ...params, semesters: parseInt(e.target.value) || 1 })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white/50"
            />
          </div>

          <div>
            <label htmlFor="hours" className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-500" />
              Hours per Semester
            </label>
            <input
              id="hours"
              type="number"
              min="10"
              max="500"
              required
              value={params.hoursPerSemester}
              onChange={(e) => setParams({ ...params, hoursPerSemester: parseInt(e.target.value) || 10 })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white/50"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !params.skill.trim()}
          className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-semibold shadow-lg shadow-indigo-500/30 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating Curriculum...
            </>
          ) : (
            <>
              Generate Curriculum
            </>
          )}
        </button>
      </div>
    </motion.form>
  );
}
