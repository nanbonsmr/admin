import { useQuery, useMutation } from "convex/react";
import { api } from "../convexClient";
import { Link } from "react-router-dom";
import { Plus, MoreVertical, Edit2, Trash2, ExternalLink, HelpCircle } from "lucide-react";

export default function CourseList() {
  const courses = useQuery(api.courses.list, { onlyPublished: false });
  const removeCourse = useMutation(api.courses.remove);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
          <p className="text-sm text-gray-500">Manage and publish your learning materials</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/courses/create"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-sm"
          >
            <Plus size={20} />
            Create Course
          </Link>
          <Link
            to="/courses/new"
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all"
          >
            <Edit2 size={20} />
            Quick Edit
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Course</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Created</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {courses?.map((course) => (
              <tr key={course._id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {course.coverImage && (
                        <img src={course.coverImage} className="w-full h-full object-cover" alt="" />
                      )}
                    </div>
                    <div className="font-semibold text-gray-900">{course.title}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-medium">
                    {course.category}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {course.isPublished ? (
                    <span className="flex items-center gap-1.5 text-green-600 font-medium text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-600" />
                      Published
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-gray-400 font-medium text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                      Draft
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(course.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link
                      to={`/courses/${course._id}`}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit Course"
                    >
                      <Edit2 size={18} />
                    </Link>
                    <Link
                      to={`/courses/${course._id}/quiz/new`}
                      className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                      title="Add Quiz"
                    >
                      <HelpCircle size={18} />
                    </Link>
                    <button 
                      onClick={() => confirm("Are you sure?") && removeCourse({ id: course._id })}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Course"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!courses || courses.length === 0) && (
          <div className="text-center py-20 text-gray-400">
            No courses found. Click "New Course" to get started.
          </div>
        )}
      </div>
    </div>
  );
}
