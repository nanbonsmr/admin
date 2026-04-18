import React, { useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../convexClient';
import { 
  BarChart3, TrendingUp, Users, Award, Clock, 
  Target, AlertCircle, CheckCircle, XCircle 
} from 'lucide-react';

export default function QuizAnalytics() {
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  
  const courses = useQuery(api.courses.list, { onlyPublished: true });
  const quizzes = useQuery(
    api.quizzes.getQuizzesByCourse, 
    selectedCourse ? { courseId: selectedCourse as any } : 'skip'
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz Analytics</h1>
        <p className="text-gray-600">Track quiz performance and student engagement</p>
      </div>

      {/* Course Selection */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Course
        </label>
        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Choose a course...</option>
          {courses?.map((course) => (
            <option key={course._id} value={course._id}>
              {course.title}
            </option>
          ))}
        </select>
      </div>

      {!selectedCourse && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Course</h3>
          <p className="text-gray-600">Choose a course from the dropdown above to view quiz analytics.</p>
        </div>
      )}

      {selectedCourse && quizzes && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quiz Information</h2>
          {quizzes.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Quizzes Found</h3>
              <p className="text-gray-600">This course doesn't have any quizzes yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {quizzes.map((quiz) => (
                <div key={quiz._id} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">{quiz.title}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Questions:</span>
                      <span className="ml-2 font-medium">{quiz.questions?.length || 0}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Time Limit:</span>
                      <span className="ml-2 font-medium">
                        {quiz.timeLimit ? `${quiz.timeLimit} min` : 'Unlimited'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Passing Score:</span>
                      <span className="ml-2 font-medium">{quiz.passingScore}%</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Max Attempts:</span>
                      <span className="ml-2 font-medium">{quiz.attempts}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}