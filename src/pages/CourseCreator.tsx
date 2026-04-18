import React, { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from "../../../convex/_generated/api";
import FileUpload from '../components/FileUpload';
import { 
  Plus, Save, X, Upload, Video, FileText, Image as ImageIcon, 
  BookOpen, Clock, Users, Tag, ChevronDown, ChevronUp, Trash2, File, Download,
  HelpCircle, CheckCircle, AlertCircle
} from 'lucide-react';

interface ContentBlock {
  id: string;
  type: 'text' | 'image' | 'youtube' | 'video' | 'file';
  value: string;
  order: number;
  fileData?: {
    filename: string;
    size: number;
    storageId: string;
  };
}

interface QuizQuestion {
  id: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
  points: number;
}

interface Quiz {
  id: string;
  title: string;
  description?: string;
  questions: QuizQuestion[];
  passingScore: number;
  timeLimit?: number;
  attempts: number;
  isRequired: boolean;
}

interface Lesson {
  id: string;
  title: string;
  content: ContentBlock[];
  estimatedDuration?: number;
}

interface Subunit {
  id: string;
  title: string;
  lessons: Lesson[];
  order: number;
}

interface Unit {
  id: string;
  title: string;
  subunits: Subunit[];
  order: number;
}

export default function CourseCreator() {
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    category: '',
    coverImage: '',
    instructor: '',
    estimatedDuration: 0,
    difficulty: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
  });

  const [units, setUnits] = useState<Unit[]>([]);
  const [courseQuiz, setCourseQuiz] = useState<Quiz | null>(null);
  const [isPublished, setIsPublished] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const createCourse = useMutation(api.courses.create);
  const updateCourse = useMutation(api.courses.update);
  const createUnit = useMutation(api.units.create);
  const createSubunit = useMutation(api.units.createSubunit);
  const createLesson = useMutation(api.lessons.create);
  const createQuiz = useMutation(api.quizzes.createQuiz);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const storeFileMetadata = useMutation(api.files.storeFileMetadata);

  const addUnit = () => {
    const newUnit: Unit = {
      id: `unit-${Date.now()}`,
      title: 'New Unit',
      subunits: [],
      order: units.length,
    };
    setUnits([...units, newUnit]);
  };

  const addCourseQuiz = () => {
    const newQuiz: Quiz = {
      id: `quiz-${Date.now()}`,
      title: 'Course Completion Quiz',
      description: 'Test your knowledge after completing this course',
      questions: [],
      passingScore: 70,
      timeLimit: 30,
      attempts: 3,
      isRequired: true,
    };
    setCourseQuiz(newQuiz);
  };

  const addQuizQuestion = () => {
    if (!courseQuiz) return;
    
    const newQuestion: QuizQuestion = {
      id: `question-${Date.now()}`,
      type: 'multiple_choice',
      question: '',
      options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
      correctAnswer: 'Option 1',
      explanation: '',
      points: 10,
    };
    
    setCourseQuiz({
      ...courseQuiz,
      questions: [...courseQuiz.questions, newQuestion]
    });
  };

  const updateQuizQuestion = (questionId: string, updates: Partial<QuizQuestion>) => {
    if (!courseQuiz) return;
    
    setCourseQuiz({
      ...courseQuiz,
      questions: courseQuiz.questions.map(q => 
        q.id === questionId ? { ...q, ...updates } : q
      )
    });
  };

  const deleteQuizQuestion = (questionId: string) => {
    if (!courseQuiz) return;
    
    setCourseQuiz({
      ...courseQuiz,
      questions: courseQuiz.questions.filter(q => q.id !== questionId)
    });
  };

  const addSubunit = (unitId: string) => {
    setUnits(units.map(unit => {
      if (unit.id === unitId) {
        const newSubunit: Subunit = {
          id: `subunit-${Date.now()}`,
          title: 'New Subunit',
          lessons: [],
          order: unit.subunits.length,
        };
        return { ...unit, subunits: [...unit.subunits, newSubunit] };
      }
      return unit;
    }));
  };

  const addLesson = (unitId: string, subunitId: string) => {
    setUnits(units.map(unit => {
      if (unit.id === unitId) {
        return {
          ...unit,
          subunits: unit.subunits.map(subunit => {
            if (subunit.id === subunitId) {
              const newLesson: Lesson = {
                id: `lesson-${Date.now()}`,
                title: 'New Lesson',
                content: [],
                estimatedDuration: 10,
              };
              return { ...subunit, lessons: [...subunit.lessons, newLesson] };
            }
            return subunit;
          })
        };
      }
      return unit;
    }));
  };

  const addContentBlock = (unitId: string, subunitId: string, lessonId: string, type: 'text' | 'image' | 'youtube' | 'video' | 'file') => {
    setUnits(units.map(unit => {
      if (unit.id === unitId) {
        return {
          ...unit,
          subunits: unit.subunits.map(subunit => {
            if (subunit.id === subunitId) {
              return {
                ...subunit,
                lessons: subunit.lessons.map(lesson => {
                  if (lesson.id === lessonId) {
                    const newBlock: ContentBlock = {
                      id: `block-${Date.now()}`,
                      type,
                      value: type === 'text' ? 'Enter your content here...' : '',
                      order: lesson.content.length,
                    };
                    return { ...lesson, content: [...lesson.content, newBlock] };
                  }
                  return lesson;
                })
              };
            }
            return subunit;
          })
        };
      }
      return unit;
    }));
  };

  const updateContentBlock = (unitId: string, subunitId: string, lessonId: string, blockId: string, value: string) => {
    setUnits(units.map(unit => {
      if (unit.id === unitId) {
        return {
          ...unit,
          subunits: unit.subunits.map(subunit => {
            if (subunit.id === subunitId) {
              return {
                ...subunit,
                lessons: subunit.lessons.map(lesson => {
                  if (lesson.id === lessonId) {
                    return {
                      ...lesson,
                      content: lesson.content.map(block => 
                        block.id === blockId ? { ...block, value } : block
                      )
                    };
                  }
                  return lesson;
                })
              };
            }
            return subunit;
          })
        };
      }
      return unit;
    }));
  };

  const deleteContentBlock = (unitId: string, subunitId: string, lessonId: string, blockId: string) => {
    setUnits(units.map(unit => {
      if (unit.id === unitId) {
        return {
          ...unit,
          subunits: unit.subunits.map(subunit => {
            if (subunit.id === subunitId) {
              return {
                ...subunit,
                lessons: subunit.lessons.map(lesson => {
                  if (lesson.id === lessonId) {
                    return {
                      ...lesson,
                      content: lesson.content.filter(block => block.id !== blockId)
                    };
                  }
                  return lesson;
                })
              };
            }
            return subunit;
          })
        };
      }
      return unit;
    }));
  };

  const saveCourse = async () => {
    if (!courseData.title || !courseData.description) {
      alert('Please fill in the course title and description');
      return;
    }

    setIsSaving(true);
    try {
      // Create the course
      const courseId = await createCourse({
        title: courseData.title,
        description: courseData.description,
        category: courseData.category,
        coverImage: courseData.coverImage,
        instructor: courseData.instructor,
      });

      // Update course to published if checkbox is checked
      if (isPublished) {
        await updateCourse({
          id: courseId,
          isPublished: true,
        });
      }

      // Create units, subunits, and lessons
      for (const unit of units) {
        const unitId = await createUnit({
          courseId,
          title: unit.title,
          order: unit.order,
        });

        for (const subunit of unit.subunits) {
          const subunitId = await createSubunit({
            unitId,
            title: subunit.title,
            order: subunit.order,
          });

          for (const lesson of subunit.lessons) {
            await createLesson({
              subunitId,
              title: lesson.title,
              content: lesson.content.map(block => ({
                type: block.type,
                value: block.value,
              })),
              order: lesson.content.length,
              estimatedDuration: lesson.estimatedDuration,
            });
          }
        }
      }

      // Create course completion quiz if exists
      if (courseQuiz && courseQuiz.questions.length > 0) {
        await createQuiz({
          courseId,
          title: courseQuiz.title,
          description: courseQuiz.description,
          questions: courseQuiz.questions.map(q => ({
            id: q.id,
            type: q.type,
            question: q.question,
            options: q.options,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation,
            points: q.points,
          })),
          passingScore: courseQuiz.passingScore,
          timeLimit: courseQuiz.timeLimit,
          attempts: courseQuiz.attempts,
          isRequired: courseQuiz.isRequired,
        });
      }

      alert('Course created successfully!');
      // Reset form
      setCourseData({
        title: '',
        description: '',
        category: '',
        coverImage: '',
        instructor: '',
        estimatedDuration: 0,
        difficulty: 'beginner',
      });
      setUnits([]);
      setCourseQuiz(null);
    } catch (error) {
      console.error('Error creating course:', error);
      alert('Error creating course. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Course</h1>
        <p className="text-gray-600">Build engaging courses with multimedia content</p>
      </div>

      {/* Course Basic Information */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          Course Information
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Course Title</label>
            <input
              type="text"
              value={courseData.title}
              onChange={(e) => setCourseData({ ...courseData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter course title"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={courseData.category}
              onChange={(e) => setCourseData({ ...courseData, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select category</option>
              <option value="Technology">Technology</option>
              <option value="Science">Science</option>
              <option value="History">History</option>
              <option value="Business">Business</option>
              <option value="Art">Art</option>
            </select>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={courseData.description}
              onChange={(e) => setCourseData({ ...courseData, description: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter course description"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image URL</label>
            <input
              type="url"
              value={courseData.coverImage}
              onChange={(e) => setCourseData({ ...courseData, coverImage: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://example.com/image.jpg"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Instructor</label>
            <input
              type="text"
              value={courseData.instructor}
              onChange={(e) => setCourseData({ ...courseData, instructor: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Instructor name"
            />
          </div>
        </div>
      </div>

      {/* Course Structure */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Course Structure
          </h2>
          <button
            onClick={addUnit}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Unit
          </button>
        </div>

        {units.map((unit, unitIndex) => (
          <UnitEditor
            key={unit.id}
            unit={unit}
            unitIndex={unitIndex}
            onAddSubunit={() => addSubunit(unit.id)}
            onAddLesson={addLesson}
            onAddContentBlock={addContentBlock}
            onUpdateContentBlock={updateContentBlock}
            onDeleteContentBlock={deleteContentBlock}
            onUpdateUnit={(updatedUnit) => {
              setUnits(units.map(u => u.id === unit.id ? updatedUnit : u));
            }}
          />
        ))}
      </div>

      {/* Course Completion Quiz */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold flex items-center gap-2 text-purple-800">
              <HelpCircle className="w-5 h-5" />
              Course Completion Quiz
              <span className="text-sm font-normal text-purple-600">(Recommended)</span>
            </h2>
            <p className="text-sm text-purple-600 mt-1">
              Test students' knowledge after they complete all course lessons. Quizzes appear in the mobile app after course completion.
            </p>
          </div>
          {!courseQuiz ? (
            <button
              onClick={addCourseQuiz}
              className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-md"
            >
              <Plus className="w-4 h-4" />
              Create Quiz
            </button>
          ) : (
            <button
              onClick={() => setCourseQuiz(null)}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <X className="w-4 h-4" />
              Remove Quiz
            </button>
          )}
        </div>
        
        {!courseQuiz && (
          <div className="bg-white border border-purple-200 rounded-lg p-4">
            <h3 className="font-medium text-purple-800 mb-2">Why add a quiz?</h3>
            <ul className="text-sm text-purple-700 space-y-1">
              <li>• Assess student understanding and knowledge retention</li>
              <li>• Provide immediate feedback with explanations</li>
              <li>• Allow multiple attempts with customizable passing scores</li>
              <li>• Automatically appears in mobile app after course completion</li>
              <li>• Track student performance and quiz analytics</li>
            </ul>
          </div>
        )}

        {courseQuiz && (
          <div className="space-y-6">
            {/* Quiz Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-purple-50 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quiz Title</label>
                <input
                  type="text"
                  value={courseQuiz.title}
                  onChange={(e) => setCourseQuiz({ ...courseQuiz, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Quiz title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Passing Score (%)</label>
                <input
                  type="number"
                  value={courseQuiz.passingScore}
                  onChange={(e) => setCourseQuiz({ ...courseQuiz, passingScore: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  min="0"
                  max="100"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time Limit (minutes)</label>
                <input
                  type="number"
                  value={courseQuiz.timeLimit || 30}
                  onChange={(e) => setCourseQuiz({ ...courseQuiz, timeLimit: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  min="1"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Attempts</label>
                <input
                  type="number"
                  value={courseQuiz.attempts}
                  onChange={(e) => setCourseQuiz({ ...courseQuiz, attempts: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  min="1"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={courseQuiz.description || ''}
                  onChange={(e) => setCourseQuiz({ ...courseQuiz, description: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Quiz description"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={courseQuiz.isRequired}
                    onChange={(e) => setCourseQuiz({ ...courseQuiz, isRequired: e.target.checked })}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Required for course completion</span>
                </label>
              </div>
            </div>

            {/* Quiz Questions */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Questions ({courseQuiz.questions.length})</h3>
                <button
                  onClick={addQuizQuestion}
                  className="flex items-center gap-2 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Question
                </button>
              </div>

              {courseQuiz.questions.map((question, index) => (
                <QuizQuestionEditor
                  key={question.id}
                  question={question}
                  index={index}
                  onUpdate={(updates) => updateQuizQuestion(question.id, updates)}
                  onDelete={() => deleteQuizQuestion(question.id)}
                />
              ))}

              {courseQuiz.questions.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <HelpCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No questions added yet. Click "Add Question" to get started.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Save Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Publish immediately</span>
          </label>
        </div>
        
        <button
          onClick={saveCourse}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-4 h-4" />
          {isSaving ? 'Saving...' : 'Save Course'}
        </button>
      </div>
    </div>
  );
}

// Unit Editor Component
function UnitEditor({ unit, unitIndex, onAddSubunit, onAddLesson, onAddContentBlock, onUpdateContentBlock, onDeleteContentBlock, onUpdateUnit }) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="border border-gray-200 rounded-lg mb-4">
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-500 hover:text-gray-700"
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            <input
              type="text"
              value={unit.title}
              onChange={(e) => onUpdateUnit({ ...unit, title: e.target.value })}
              className="text-lg font-semibold bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
              placeholder="Unit title"
            />
          </div>
          <button
            onClick={onAddSubunit}
            className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
          >
            <Plus className="w-3 h-3" />
            Add Subunit
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4">
          {unit.subunits.map((subunit, subunitIndex) => (
            <SubunitEditor
              key={subunit.id}
              unit={unit}
              subunit={subunit}
              subunitIndex={subunitIndex}
              onAddLesson={onAddLesson}
              onAddContentBlock={onAddContentBlock}
              onUpdateContentBlock={onUpdateContentBlock}
              onDeleteContentBlock={onDeleteContentBlock}
              onUpdateSubunit={(updatedSubunit) => {
                const updatedUnit = {
                  ...unit,
                  subunits: unit.subunits.map(s => s.id === subunit.id ? updatedSubunit : s)
                };
                onUpdateUnit(updatedUnit);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Subunit Editor Component
function SubunitEditor({ unit, subunit, subunitIndex, onAddLesson, onAddContentBlock, onUpdateContentBlock, onDeleteContentBlock, onUpdateSubunit }) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="border border-gray-100 rounded-lg mb-3 ml-6">
      <div className="p-3 bg-blue-50 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-500 hover:text-gray-700"
            >
              {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
            <input
              type="text"
              value={subunit.title}
              onChange={(e) => onUpdateSubunit({ ...subunit, title: e.target.value })}
              className="font-medium bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
              placeholder="Subunit title"
            />
          </div>
          <button
            onClick={() => onAddLesson(unit.id, subunit.id)}
            className="flex items-center gap-2 px-3 py-1 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
          >
            <Plus className="w-3 h-3" />
            Add Lesson
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-3">
          {subunit.lessons.map((lesson, lessonIndex) => (
            <LessonEditor
              key={lesson.id}
              unit={unit}
              subunit={subunit}
              lesson={lesson}
              lessonIndex={lessonIndex}
              onAddContentBlock={onAddContentBlock}
              onUpdateContentBlock={onUpdateContentBlock}
              onDeleteContentBlock={onDeleteContentBlock}
              onUpdateLesson={(updatedLesson) => {
                const updatedSubunit = {
                  ...subunit,
                  lessons: subunit.lessons.map(l => l.id === lesson.id ? updatedLesson : l)
                };
                onUpdateSubunit(updatedSubunit);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Lesson Editor Component
function LessonEditor({ unit, subunit, lesson, lessonIndex, onAddContentBlock, onUpdateContentBlock, onDeleteContentBlock, onUpdateLesson }) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="border border-gray-100 rounded-lg mb-3 ml-6">
      <div className="p-3 bg-green-50 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-500 hover:text-gray-700"
            >
              {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
            <input
              type="text"
              value={lesson.title}
              onChange={(e) => onUpdateLesson({ ...lesson, title: e.target.value })}
              className="font-medium bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
              placeholder="Lesson title"
            />
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="w-3 h-3" />
              <input
                type="number"
                value={lesson.estimatedDuration || 10}
                onChange={(e) => onUpdateLesson({ ...lesson, estimatedDuration: parseInt(e.target.value) })}
                className="w-16 px-1 py-0.5 text-xs border border-gray-200 rounded"
                min="1"
              />
              <span>min</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onAddContentBlock(unit.id, subunit.id, lesson.id, 'text')}
              className="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-100 rounded"
              title="Add Text"
            >
              <FileText className="w-4 h-4" />
            </button>
            <button
              onClick={() => onAddContentBlock(unit.id, subunit.id, lesson.id, 'image')}
              className="p-1 text-gray-600 hover:text-green-600 hover:bg-green-100 rounded"
              title="Add Image"
            >
              <ImageIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => onAddContentBlock(unit.id, subunit.id, lesson.id, 'video')}
              className="p-1 text-gray-600 hover:text-red-600 hover:bg-red-100 rounded"
              title="Add Video File"
            >
              <Video className="w-4 h-4" />
            </button>
            <button
              onClick={() => onAddContentBlock(unit.id, subunit.id, lesson.id, 'file')}
              className="p-1 text-gray-600 hover:text-purple-600 hover:bg-purple-100 rounded"
              title="Add File"
            >
              <File className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="p-3 space-y-3">
          {lesson.content.map((block, blockIndex) => (
            <ContentBlockEditor
              key={block.id}
              block={block}
              onUpdate={(value) => onUpdateContentBlock(unit.id, subunit.id, lesson.id, block.id, value)}
              onDelete={() => onDeleteContentBlock(unit.id, subunit.id, lesson.id, block.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Content Block Editor Component
function ContentBlockEditor({ block, onUpdate, onDelete }) {
  const [isUploading, setIsUploading] = useState(false);
  const generateUploadUrl = useMutation(api.fileStorage.generateUploadUrl);
  const storeFileMetadata = useMutation(api.fileStorage.storeFileMetadata);

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    try {
      // Generate upload URL
      const uploadUrl = await generateUploadUrl();
      
      // Upload file
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      
      const { storageId } = await result.json();
      
      // Store file metadata
      await storeFileMetadata({
        storageId,
        originalName: file.name,
        mimeType: file.type,
        size: file.size,
        uploadedBy: 'temp-admin-id' as any, // Replace with actual admin ID
        isPublic: true,
      });
      
      // Update block with file info
      onUpdate(storageId);
      
    } catch (error) {
      console.error('File upload failed:', error);
      alert('File upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const renderEditor = () => {
    switch (block.type) {
      case 'text':
        return (
          <textarea
            value={block.value}
            onChange={(e) => onUpdate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
            rows={4}
            placeholder="Enter your text content here..."
          />
        );
      case 'image':
        return (
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="url"
                value={block.value}
                onChange={(e) => onUpdate(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter image URL or upload file"
              />
              <label className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Upload
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                  className="hidden"
                />
              </label>
            </div>
            {isUploading && (
              <div className="text-sm text-blue-600">Uploading image...</div>
            )}
            {block.value && (
              <img src={block.value} alt="Preview" className="max-w-xs h-32 object-cover rounded-lg" />
            )}
          </div>
        );
      case 'video':
        return (
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={block.value}
                onChange={(e) => onUpdate(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Video will appear here after upload"
                readOnly
              />
              <label className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 cursor-pointer flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Upload Video
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                  className="hidden"
                />
              </label>
            </div>
            {isUploading && (
              <div className="text-sm text-red-600">Uploading video...</div>
            )}
            {block.value && (
              <div className="aspect-video max-w-xs bg-gray-100 rounded-lg flex items-center justify-center">
                <Video className="w-8 h-8 text-gray-400" />
                <span className="ml-2 text-sm text-gray-500">Video: {block.fileData?.filename}</span>
              </div>
            )}
          </div>
        );
      case 'youtube':
        return (
          <div className="space-y-2">
            <input
              type="text"
              value={block.value}
              onChange={(e) => onUpdate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter YouTube video ID (e.g., dQw4w9WgXcQ)"
            />
            {block.value && (
              <div className="aspect-video max-w-xs bg-gray-100 rounded-lg flex items-center justify-center">
                <Video className="w-8 h-8 text-gray-400" />
                <span className="ml-2 text-sm text-gray-500">YouTube: {block.value}</span>
              </div>
            )}
          </div>
        );
      case 'file':
        return (
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={block.value}
                onChange={(e) => onUpdate(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="File will appear here after upload"
                readOnly
              />
              <label className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Upload File
                <input
                  type="file"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                  className="hidden"
                />
              </label>
            </div>
            {isUploading && (
              <div className="text-sm text-purple-600">Uploading file...</div>
            )}
            {block.value && (
              <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                <File className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-700">{block.fileData?.filename}</span>
                <span className="text-xs text-gray-500">
                  ({Math.round((block.fileData?.size || 0) / 1024)} KB)
                </span>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {block.type === 'text' && <FileText className="w-4 h-4 text-blue-600" />}
          {block.type === 'image' && <ImageIcon className="w-4 h-4 text-green-600" />}
          {block.type === 'youtube' && <Video className="w-4 h-4 text-red-600" />}
          {block.type === 'video' && <Video className="w-4 h-4 text-red-600" />}
          {block.type === 'file' && <File className="w-4 h-4 text-purple-600" />}
          <span className="text-sm font-medium capitalize">{block.type} Content</span>
        </div>
        <button
          onClick={onDelete}
          className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      {renderEditor()}
    </div>
  );
}

// Quiz Question Editor Component
function QuizQuestionEditor({ question, index, onUpdate, onDelete }: {
  question: QuizQuestion;
  index: number;
  onUpdate: (updates: Partial<QuizQuestion>) => void;
  onDelete: () => void;
}) {
  const [isExpanded, setIsExpanded] = useState(true);

  const addOption = () => {
    const newOptions = [...(question.options || []), `Option ${(question.options?.length || 0) + 1}`];
    onUpdate({ options: newOptions });
  };

  const updateOption = (optionIndex: number, value: string) => {
    const newOptions = [...(question.options || [])];
    newOptions[optionIndex] = value;
    onUpdate({ options: newOptions });
  };

  const removeOption = (optionIndex: number) => {
    const newOptions = question.options?.filter((_, i) => i !== optionIndex) || [];
    onUpdate({ options: newOptions });
    
    // If the correct answer was the removed option, reset it
    if (question.correctAnswer === question.options?.[optionIndex]) {
      onUpdate({ correctAnswer: newOptions[0] || '' });
    }
  };

  return (
    <div className="border border-purple-200 rounded-lg mb-4">
      <div className="p-4 bg-purple-50 border-b border-purple-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-purple-600 hover:text-purple-800"
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            <span className="font-medium text-purple-800">Question {index + 1}</span>
            <select
              value={question.type}
              onChange={(e) => onUpdate({ 
                type: e.target.value as 'multiple_choice' | 'true_false' | 'short_answer',
                options: e.target.value === 'true_false' ? ['True', 'False'] : 
                        e.target.value === 'short_answer' ? undefined : 
                        question.options || ['Option 1', 'Option 2', 'Option 3', 'Option 4']
              })}
              className="px-3 py-1 text-sm border border-purple-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="multiple_choice">Multiple Choice</option>
              <option value="true_false">True/False</option>
              <option value="short_answer">Short Answer</option>
            </select>
            <div className="flex items-center gap-2 text-sm text-purple-600">
              <span>Points:</span>
              <input
                type="number"
                value={question.points}
                onChange={(e) => onUpdate({ points: parseInt(e.target.value) || 10 })}
                className="w-16 px-2 py-1 text-xs border border-purple-300 rounded"
                min="1"
              />
            </div>
          </div>
          <button
            onClick={onDelete}
            className="p-1 text-purple-400 hover:text-red-600 hover:bg-red-100 rounded"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 space-y-4">
          {/* Question Text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Question</label>
            <textarea
              value={question.question}
              onChange={(e) => onUpdate({ question: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter your question here..."
            />
          </div>

          {/* Options for Multiple Choice and True/False */}
          {(question.type === 'multiple_choice' || question.type === 'true_false') && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">Answer Options</label>
                {question.type === 'multiple_choice' && (
                  <button
                    onClick={addOption}
                    className="text-sm text-purple-600 hover:text-purple-800"
                  >
                    + Add Option
                  </button>
                )}
              </div>
              <div className="space-y-2">
                {question.options?.map((option, optionIndex) => (
                  <div key={optionIndex} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={`correct-${question.id}`}
                      checked={question.correctAnswer === option}
                      onChange={() => onUpdate({ correctAnswer: option })}
                      className="text-purple-600 focus:ring-purple-500"
                    />
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => updateOption(optionIndex, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder={`Option ${optionIndex + 1}`}
                    />
                    {question.type === 'multiple_choice' && question.options && question.options.length > 2 && (
                      <button
                        onClick={() => removeOption(optionIndex)}
                        className="p-1 text-gray-400 hover:text-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Correct Answer for Short Answer */}
          {question.type === 'short_answer' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Correct Answer</label>
              <input
                type="text"
                value={question.correctAnswer}
                onChange={(e) => onUpdate({ correctAnswer: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter the correct answer"
              />
            </div>
          )}

          {/* Explanation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Explanation <span className="text-gray-500">(Optional)</span>
            </label>
            <textarea
              value={question.explanation || ''}
              onChange={(e) => onUpdate({ explanation: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Explain why this is the correct answer..."
            />
          </div>
        </div>
      )}
    </div>
  );
}