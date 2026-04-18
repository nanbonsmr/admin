import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Plus, Trash2, Save, ArrowLeft } from 'lucide-react';

interface Question {
  id: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
  points: number;
}

const QuizBuilder = () => {
  const { courseId, quizId } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [passingScore, setPassingScore] = useState(70);
  const [timeLimit, setTimeLimit] = useState<number | undefined>();
  const [attempts, setAttempts] = useState(3);
  const [isRequired, setIsRequired] = useState(false);

  const createQuiz = useMutation(api.quizzes.createQuiz);
  const updateQuiz = useMutation(api.quizzes.updateQuiz);
  const existingQuiz = useQuery(api.quizzes.getQuiz, quizId ? { id: quizId as any } : 'skip');

  useEffect(() => {
    if (existingQuiz) {
      setTitle(existingQuiz.title);
      setDescription(existingQuiz.description || '');
      setQuestions(existingQuiz.questions);
      setPassingScore(existingQuiz.passingScore);
      setTimeLimit(existingQuiz.timeLimit);
      setAttempts(existingQuiz.attempts);
      setIsRequired(existingQuiz.isRequired);
    }
  }, [existingQuiz]);

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      type: 'multiple_choice',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      explanation: '',
      points: 10,
    };
    setQuestions([...questions, newQuestion]);
  };

  const createTestQuiz = async () => {
    if (!courseId) return;
    
    const testQuiz = {
      courseId: courseId as any,
      title: 'Test Quiz',
      description: 'A test quiz to verify the system is working',
      questions: [
        {
          id: 'q1',
          type: 'multiple_choice' as const,
          question: 'What is 2 + 2?',
          options: ['3', '4', '5', '6'],
          correctAnswer: '4',
          explanation: 'Basic arithmetic: 2 + 2 = 4',
          points: 10,
        },
        {
          id: 'q2',
          type: 'true_false' as const,
          question: 'The sky is blue.',
          correctAnswer: 'True',
          explanation: 'The sky appears blue due to light scattering.',
          points: 10,
        },
        {
          id: 'q3',
          type: 'short_answer' as const,
          question: 'What is the capital of France?',
          correctAnswer: 'Paris',
          explanation: 'Paris is the capital and largest city of France.',
          points: 10,
        }
      ],
      passingScore: 70,
      timeLimit: 15,
      attempts: 3,
      isRequired: true,
    };

    try {
      await createQuiz(testQuiz);
      alert('Test quiz created successfully!');
    } catch (error) {
      console.error('Error creating test quiz:', error);
      alert('Error creating test quiz');
    }
  };

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
    setQuestions(updatedQuestions);
  };

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const updatedQuestions = [...questions];
    if (updatedQuestions[questionIndex].options) {
      updatedQuestions[questionIndex].options![optionIndex] = value;
      setQuestions(updatedQuestions);
    }
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!title.trim() || questions.length === 0) {
      alert('Please provide a title and at least one question');
      return;
    }

    try {
      if (quizId) {
        await updateQuiz({
          id: quizId as any,
          title,
          description,
          questions,
          passingScore,
          timeLimit,
          attempts,
          isRequired,
        });
      } else {
        await createQuiz({
          courseId: courseId as any,
          title,
          description,
          questions,
          passingScore,
          timeLimit,
          attempts,
          isRequired,
        });
      }
      navigate(`/courses/${courseId}`);
    } catch (error) {
      console.error('Error saving quiz:', error);
      alert('Failed to save quiz');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(`/courses/${courseId}`)}
            className="p-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            {quizId ? 'Edit Quiz' : 'Create Quiz'}
          </h1>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={createTestQuiz}
            className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
          >
            <Plus className="h-4 w-4" />
            <span>Create Test Quiz</span>
          </button>
          <button
            onClick={handleSave}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Save className="h-4 w-4" />
            <span>Save Quiz</span>
          </button>
        </div>
      </div>

      {/* Quiz Settings */}
      <div className="bg-white p-6 rounded-lg shadow-sm border space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Quiz Settings</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quiz Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter quiz title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Passing Score (%)
            </label>
            <input
              type="number"
              value={passingScore}
              onChange={(e) => setPassingScore(Number(e.target.value))}
              min="0"
              max="100"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Time Limit (minutes)
            </label>
            <input
              type="number"
              value={timeLimit || ''}
              onChange={(e) => setTimeLimit(e.target.value ? Number(e.target.value) : undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="No time limit"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Attempts
            </label>
            <input
              type="number"
              value={attempts}
              onChange={(e) => setAttempts(Number(e.target.value))}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Quiz description (optional)"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="required"
            checked={isRequired}
            onChange={(e) => setIsRequired(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="required" className="ml-2 text-sm text-gray-700">
            Required for course completion
          </label>
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Questions</h2>
          <button
            onClick={addQuestion}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            <Plus className="h-4 w-4" />
            <span>Add Question</span>
          </button>
        </div>

        {questions.map((question, index) => (
          <div key={question.id} className="bg-white p-6 rounded-lg shadow-sm border space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Question {index + 1}</h3>
              <button
                onClick={() => removeQuestion(index)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Question Text *
                </label>
                <textarea
                  value={question.question}
                  onChange={(e) => updateQuestion(index, 'question', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your question"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Question Type
                </label>
                <select
                  value={question.type}
                  onChange={(e) => updateQuestion(index, 'type', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="multiple_choice">Multiple Choice</option>
                  <option value="true_false">True/False</option>
                  <option value="short_answer">Short Answer</option>
                </select>
              </div>
            </div>

            {/* Question Options */}
            {question.type === 'multiple_choice' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Answer Options
                </label>
                <div className="space-y-2">
                  {question.options?.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name={`correct-${question.id}`}
                        checked={question.correctAnswer === option}
                        onChange={() => updateQuestion(index, 'correctAnswer', option)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => updateOption(index, optionIndex, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder={`Option ${optionIndex + 1}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {question.type === 'true_false' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Correct Answer
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name={`tf-${question.id}`}
                      value="true"
                      checked={question.correctAnswer === 'true'}
                      onChange={(e) => updateQuestion(index, 'correctAnswer', e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2">True</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name={`tf-${question.id}`}
                      value="false"
                      checked={question.correctAnswer === 'false'}
                      onChange={(e) => updateQuestion(index, 'correctAnswer', e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2">False</span>
                  </label>
                </div>
              </div>
            )}

            {question.type === 'short_answer' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Correct Answer
                </label>
                <input
                  type="text"
                  value={question.correctAnswer}
                  onChange={(e) => updateQuestion(index, 'correctAnswer', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter the correct answer"
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Points
                </label>
                <input
                  type="number"
                  value={question.points}
                  onChange={(e) => updateQuestion(index, 'points', Number(e.target.value))}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Explanation (optional)
                </label>
                <input
                  type="text"
                  value={question.explanation || ''}
                  onChange={(e) => updateQuestion(index, 'explanation', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Explain the correct answer"
                />
              </div>
            </div>
          </div>
        ))}

        {questions.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <p className="text-gray-500">No questions added yet. Click "Add Question" to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizBuilder;