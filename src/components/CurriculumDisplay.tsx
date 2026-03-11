import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronUp, Download, Clock, BookOpen, CheckCircle2 } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export interface Topic {
  name: string;
  estimatedHours: number;
}

export interface Course {
  courseName: string;
  description: string;
  estimatedHours: number;
  topics: Topic[];
}

export interface Semester {
  semesterNumber: number;
  level: string;
  title: string;
  courses: Course[];
}

export interface Curriculum {
  title: string;
  description: string;
  semesters: Semester[];
}

interface CurriculumDisplayProps {
  curriculum: Curriculum;
}

export function CurriculumDisplay({ curriculum }: CurriculumDisplayProps) {
  const [openSemester, setOpenSemester] = useState<number | null>(1);

  const toggleSemester = (semesterNumber: number) => {
    setOpenSemester(openSemester === semesterNumber ? null : semesterNumber);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(22);
    doc.setTextColor(40, 40, 40);
    const titleLines = doc.splitTextToSize(curriculum.title, 180);
    doc.text(titleLines, 14, 20);
    
    // Add description
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    const descLines = doc.splitTextToSize(curriculum.description, 180);
    doc.text(descLines, 14, 20 + titleLines.length * 10);

    let currentY = 25 + titleLines.length * 10 + descLines.length * 7;

    curriculum.semesters.forEach((semester) => {
      // Check if we need a new page
      if (currentY > 250) {
        doc.addPage();
        currentY = 20;
      }

      // Semester Title
      doc.setFontSize(16);
      doc.setTextColor(60, 60, 60);
      doc.text(`Semester ${semester.semesterNumber} (${semester.level}): ${semester.title}`, 14, currentY);
      currentY += 10;

      const tableData = semester.courses.map((course) => [
        course.courseName,
        course.description,
        `${course.estimatedHours}h`,
        course.topics.map(t => `${t.name} (${t.estimatedHours}h)`).join(', ')
      ]);

      (doc as any).autoTable({
        startY: currentY,
        head: [['Course Name', 'Description', 'Hours', 'Topics']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [79, 70, 229] }, // Indigo 600
        styles: { fontSize: 10, cellPadding: 3 },
        columnStyles: {
          0: { cellWidth: 40 },
          1: { cellWidth: 60 },
          2: { cellWidth: 20 },
          3: { cellWidth: 60 },
        },
        margin: { top: 10, right: 14, bottom: 10, left: 14 },
      });

      currentY = (doc as any).lastAutoTable.finalY + 15;
    });

    doc.save(`${curriculum.title.replace(/\s+/g, '_').toLowerCase()}.pdf`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white/90 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/40 mt-12"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
            {curriculum.title}
          </h2>
          <p className="text-slate-600 text-lg max-w-3xl">{curriculum.description}</p>
        </div>
        <button
          onClick={handleDownloadPDF}
          className="flex items-center gap-2 px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-medium transition-colors shadow-lg shadow-slate-900/20 shrink-0"
        >
          <Download className="w-5 h-5" />
          Export PDF
        </button>
      </div>

      <div className="space-y-4">
        {curriculum.semesters.map((semester) => (
          <div
            key={semester.semesterNumber}
            className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm transition-all duration-200 hover:shadow-md"
          >
            <button
              onClick={() => toggleSemester(semester.semesterNumber)}
              className="w-full px-6 py-5 flex items-center justify-between bg-slate-50/50 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-lg">
                  {semester.semesterNumber}
                </div>
                <h3 className="text-xl font-semibold text-slate-800 text-left">
                  {semester.title} <span className="text-sm font-normal text-slate-500 ml-2">({semester.level})</span>
                </h3>
              </div>
              {openSemester === semester.semesterNumber ? (
                <ChevronUp className="w-6 h-6 text-slate-400" />
              ) : (
                <ChevronDown className="w-6 h-6 text-slate-400" />
              )}
            </button>

            <AnimatePresence>
              {openSemester === semester.semesterNumber && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="p-6 border-t border-slate-100 space-y-6">
                    {semester.courses.map((course, idx) => (
                      <div key={idx} className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-3 gap-2">
                          <h4 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-indigo-500" />
                            {course.courseName}
                          </h4>
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm font-medium">
                            <Clock className="w-4 h-4" />
                            {course.estimatedHours} hours
                          </span>
                        </div>
                        <p className="text-slate-600 mb-4">{course.description}</p>
                        
                        <div>
                          <h5 className="text-sm font-semibold text-slate-700 mb-2 uppercase tracking-wider">Key Topics</h5>
                          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {course.topics.map((topic, tIdx) => (
                              <li key={tIdx} className="flex items-start gap-2 text-slate-600">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                                <span className="text-sm">
                                  <span className="font-medium">{topic.name}</span> ({topic.estimatedHours}h)
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
