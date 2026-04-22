import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "convex/react";
import { api } from "../convexClient";
import type { Id } from "../../convex/_generated/dataModel";
import { 
  ChevronLeft, Save, Plus, Trash2, ChevronRight, 
  GripVertical, FileText, Image as ImageIcon, Youtube, 
  Eye, Layout, FileEdit, CheckCircle2, Circle, HelpCircle,
  Clock, Users, Award
} from "lucide-react";
import { clsx } from "clsx";
import LessonEditor from "../components/LessonEditor";

export default function CourseEditor({ isNew = false }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const courseId = id as Id<"courses">;

  const courseData = useQuery(api.courses.getById, isNew ? 'skip' : { id: courseId });
  const units = useQuery(api.units.listUnits, isNew ? 'skip' : { courseId });
  const quizzes = useQuery(api.quizzes.getQuizzesByCourse, isNew ? 'skip' : { courseId });

  const createCourse = useMutation(api.courses.create);
  const updateCourse = useMutation(api.courses.update);
  const createUnit = useMutation(api.units.createUnit);
  const updateUnit = useMutation(api.units.updateUnit);
  const removeUnit = useMutation(api.units.removeUnit);
  const createSubunit = useMutation(api.units.createSubunit);
  const updateSubunit = useMutation(api.units.updateSubunit);
  const createLesson = useMutation(api.lessons.createLesson);
  const updateLesson = useMutation(api.lessons.updateLesson);
  const removeLesson = useMutation(api.lessons.removeLesson);
  const deleteQuiz = useMutation(api.quizzes.deleteQuiz);

  const [courseForm, setCourseForm] = useState({
    title: "",
    description: "",
    category: "Technology",
    instructor: "",
    isPublished: false,
    price: 0,
    currency: "USD",
    isFree: true,
    discountPrice: 0,
    discountValidUntil: ""
  });

  const [activeTab, setActiveTab] = useState("content"); // 'settings' | 'content' | 'quizzes'
  const [editingLesson, setEditingLesson] = useState<any>(null);

  useEffect(() => {
    if (courseData) {
      setCourseForm({
        title: courseData.title,
        description: courseData.description,
        category: courseData.category,
        instructor: courseData.instructor || "",
        isPublished: courseData.isPublished,
        price: courseData.price || 0,
        currency: courseData.currency || "USD",
        isFree: courseData.isFree || false,
        discountPrice: courseData.discountPrice || 0,
        discountValidUntil: courseData.discountValidUntil 
          ? new Date(courseData.discountValidUntil).toISOString().split('T')[0] 
          : ""
      });
    }
  }, [courseData]);

  const handleSaveCourse = async () => {
    const formData = {
      ...courseForm,
      discountValidUntil: courseForm.discountValidUntil 
        ? new Date(courseForm.discountValidUntil).getTime() 
        : undefined
    };
    
    if (isNew) {
      const newId = await createCourse(formData);
      navigate(`/courses/${newId}`);
    } else {
      await updateCourse({ id: courseId, ...formData });
    }
  };

  const handleAddUnit = async () => {
    await createUnit({
      courseId,
      title: "New Unit",
      order: (units?.length || 0) + 1
    });
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate("/courses")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isNew ? "Create Course" : courseForm.title || "Untitled Course"}
            </h1>
            <p className="text-sm text-gray-500">
              {isNew ? "Define your course basics" : "Manage course structure and lessons"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setCourseForm(p => ({ ...p, isPublished: !p.isPublished }))}
            className={clsx(
              "px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all border",
              courseForm.isPublished 
                ? "bg-green-50 text-green-700 border-green-200" 
                : "bg-gray-50 text-gray-600 border-gray-200"
            )}
          >
            {courseForm.isPublished ? <CheckCircle2 size={18} /> : <Circle size={18} />}
            {courseForm.isPublished ? "Published" : "Draft"}
          </button>
          <button 
            onClick={handleSaveCourse}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-semibold flex items-center gap-2 shadow-sm transition-all"
          >
            <Save size={18} />
            Save Details
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-8">
        <button 
          onClick={() => setActiveTab("content")}
          className={clsx(
            "px-6 py-3 text-sm font-bold transition-all border-b-2",
            activeTab === "content" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
          )}
        >
          Curriculum Content
        </button>
        <button 
          onClick={() => setActiveTab("quizzes")}
          className={clsx(
            "px-6 py-3 text-sm font-bold transition-all border-b-2",
            activeTab === "quizzes" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
          )}
        >
          Quizzes & Assessments
        </button>
        <button 
          onClick={() => setActiveTab("settings")}
          className={clsx(
            "px-6 py-3 text-sm font-bold transition-all border-b-2",
            activeTab === "settings" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
          )}
        >
          Course Settings
        </button>
      </div>

      {activeTab === "settings" ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Course Title</label>
              <input 
                type="text" 
                value={courseForm.title}
                onChange={e => setCourseForm(p => ({ ...p, title: e.target.value }))}
                placeholder="e.g. Introduction to Astrophysics"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Category</label>
              <select 
                value={courseForm.category}
                onChange={e => setCourseForm(p => ({ ...p, category: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none"
              >
                <option>Technology</option>
                <option>Science</option>
                <option>History</option>
                <option>Business</option>
                <option>Art</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Short Description</label>
            <textarea 
              value={courseForm.description}
              onChange={e => setCourseForm(p => ({ ...p, description: e.target.value }))}
              placeholder="What will students learn in this course?"
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Instructor Name</label>
            <input 
              type="text" 
              value={courseForm.instructor}
              onChange={e => setCourseForm(p => ({ ...p, instructor: e.target.value }))}
              placeholder="e.g. Dr. Sarah Jenkins"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>

          {/* Pricing Section */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Course Pricing</h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isFree"
                  checked={courseForm.isFree}
                  onChange={e => setCourseForm(p => ({ 
                    ...p, 
                    isFree: e.target.checked,
                    price: e.target.checked ? 0 : p.price
                  }))}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="isFree" className="text-sm font-medium text-gray-700">
                  This is a free course
                </label>
              </div>

              {!courseForm.isFree && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Price</label>
                      <div className="relative">
                        <input 
                          type="number" 
                          min="0"
                          step="0.01"
                          value={courseForm.price}
                          onChange={e => setCourseForm(p => ({ ...p, price: parseFloat(e.target.value) || 0 }))}
                          placeholder="0.00"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Currency</label>
                      <select 
                        value={courseForm.currency}
                        onChange={e => setCourseForm(p => ({ ...p, currency: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none"
                      >
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="JPY">JPY (¥)</option>
                        <option value="CAD">CAD (C$)</option>
                        <option value="AUD">AUD (A$)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Discount Price (Optional)</label>
                      <input 
                        type="number" 
                        min="0"
                        step="0.01"
                        value={courseForm.discountPrice}
                        onChange={e => setCourseForm(p => ({ ...p, discountPrice: parseFloat(e.target.value) || 0 }))}
                        placeholder="0.00"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Discount Valid Until</label>
                      <input 
                        type="date" 
                        value={courseForm.discountValidUntil}
                        onChange={e => setCourseForm(p => ({ ...p, discountValidUntil: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      />
                    </div>
                  </div>

                  {courseForm.discountPrice > 0 && courseForm.discountValidUntil && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-sm text-blue-700">
                        <strong>Discount Preview:</strong> Students will pay {courseForm.currency} {courseForm.discountPrice} 
                        instead of {courseForm.currency} {courseForm.price} until {new Date(courseForm.discountValidUntil).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      ) : activeTab === "quizzes" ? (
        <div className="space-y-6">
          {isNew ? (
            <div className="bg-purple-50 border border-purple-100 p-8 rounded-2xl text-center">
              <HelpCircle className="mx-auto text-purple-400 mb-4" size={48} />
              <h3 className="text-lg font-bold text-purple-900 mb-2">Create Quizzes & Assessments</h3>
              <p className="text-purple-600 max-w-md mx-auto mb-6">
                Save the course details first to start adding quizzes and assessments to test student knowledge.
              </p>
              <button 
                onClick={handleSaveCourse}
                className="bg-purple-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-purple-200 hover:scale-105 transition-transform"
              >
                Save & Add Quizzes
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Course Quizzes</h3>
                  <p className="text-sm text-gray-500">Create assessments to test student understanding</p>
                </div>
                <button 
                  onClick={() => navigate(`/courses/${courseId}/quiz/new`)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-xl font-semibold flex items-center gap-2 shadow-sm transition-all"
                >
                  <Plus size={18} />
                  Create Quiz
                </button>
              </div>

              <div className="grid gap-4">
                {quizzes?.map((quiz) => (
                  <div key={quiz._id} className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 hover:shadow-md transition-all">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <HelpCircle className="text-purple-600" size={20} />
                          <h4 className="font-bold text-gray-900">{quiz.title}</h4>
                          {quiz.isRequired && (
                            <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">
                              Required
                            </span>
                          )}
                        </div>
                        {quiz.description && (
                          <p className="text-gray-600 text-sm mb-3">{quiz.description}</p>
                        )}
                        <div className="flex items-center gap-6 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <FileText size={14} />
                            <span>{quiz.questions?.length || 0} questions</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Award size={14} />
                            <span>{quiz.passingScore}% to pass</span>
                          </div>
                          {quiz.timeLimit && (
                            <div className="flex items-center gap-1">
                              <Clock size={14} />
                              <span>{quiz.timeLimit} min</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Users size={14} />
                            <span>{quiz.attempts} attempts</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/courses/${courseId}/quiz/${quiz._id}`)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="Edit Quiz"
                        >
                          <FileEdit size={16} />
                        </button>
                        <button
                          onClick={async () => {
                            if (confirm("Are you sure you want to delete this quiz? This action cannot be undone.")) {
                              try {
                                await deleteQuiz({ id: quiz._id });
                              } catch (error) {
                                alert("Failed to delete quiz");
                              }
                            }
                          }}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Delete Quiz"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {(!quizzes || quizzes.length === 0) && (
                  <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400">
                    <HelpCircle className="mx-auto mb-4 text-gray-300" size={48} />
                    <h4 className="font-bold text-gray-500 mb-2">No quizzes created yet</h4>
                    <p className="text-sm mb-4">Create your first quiz to assess student learning</p>
                    <button 
                      onClick={() => navigate(`/courses/${courseId}/quiz/new`)}
                      className="bg-purple-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-purple-700 transition-colors"
                    >
                      Create First Quiz
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {isNew ? (
            <div className="bg-blue-50 border border-blue-100 p-8 rounded-2xl text-center">
              <Layout className="mx-auto text-blue-400 mb-4" size={48} />
              <h3 className="text-lg font-bold text-blue-900 mb-2">Build Your Curriculum</h3>
              <p className="text-blue-600 max-w-md mx-auto mb-6">
                Save the course details first to start adding units, subunits, and lessons to your structured learning path.
              </p>
              <button 
                onClick={handleSaveCourse}
                className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 hover:scale-105 transition-transform"
              >
                Save & Start Building
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Curriculum Structure</h3>
                <button 
                  onClick={handleAddUnit}
                  className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg font-bold text-sm flex items-center gap-1 transition-colors"
                >
                  <Plus size={18} />
                  Add Unit
                </button>
              </div>

              <div className="space-y-4">
                {units?.map((unit, uIdx) => (
                  <UnitItem key={unit._id} unit={unit} index={uIdx} setEditingLesson={setEditingLesson} />
                ))}
                {(!units || units.length === 0) && (
                  <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400">
                    Your curriculum is empty. Add your first unit to begin.
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {editingLesson && (
        <LessonEditor 
          lesson={editingLesson}
          onClose={() => setEditingLesson(null)}
          onSave={async (data) => {
            await updateLesson({ id: editingLesson._id, ...data });
            setEditingLesson(null);
          }}
        />
      )}
    </div>
  );
}

function UnitItem({ unit, index, setEditingLesson }) {
  const subunits = useQuery(api.units.listSubunits, { unitId: unit._id });
  const createSubunit = useMutation(api.units.createSubunit);
  const updateUnit = useMutation(api.units.updateUnit);
  const removeUnit = useMutation(api.units.removeUnit);
  const [isExpanded, setIsExpanded] = useState(true);

  const handleAddSubunit = async () => {
    await createSubunit({
      unitId: unit._id,
      title: "New Subunit",
      order: (subunits?.length || 0) + 1
    });
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden transition-all">
      <div 
        className="p-4 flex items-center gap-4 bg-gray-50/50 hover:bg-gray-100/50 cursor-pointer group transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <GripVertical className="text-gray-300 group-hover:text-gray-400" size={20} />
        <span className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">
          {index + 1}
        </span>
        <input 
          value={unit.title}
          onClick={e => e.stopPropagation()}
          onChange={e => updateUnit({ id: unit._id, title: e.target.value })}
          className="flex-1 bg-transparent font-bold text-gray-800 outline-none focus:border-b-2 border-blue-600 transition-all"
        />
        <div className="flex items-center gap-2">
          <button 
            onClick={e => { e.stopPropagation(); handleAddSubunit(); }}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-white rounded-lg transition-all"
          >
            <Plus size={18} />
          </button>
          <button 
            onClick={e => { e.stopPropagation(); confirm("Delete Unit?") && removeUnit({ id: unit._id }); }}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-white rounded-lg transition-all opacity-0 group-hover:opacity-100"
          >
            <Trash2 size={18} />
          </button>
          <ChevronRight 
            className={clsx("text-gray-400 transition-transform", isExpanded && "rotate-90")} 
            size={20} 
          />
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 space-y-3 bg-white">
          {subunits?.map((sub, sIdx) => (
            <SubunitItem key={sub._id} subunit={sub} index={sIdx} setEditingLesson={setEditingLesson} />
          ))}
          <button 
            onClick={handleAddSubunit}
            className="w-full py-3 border-2 border-dashed border-gray-50 rounded-xl text-xs font-bold text-gray-400 hover:border-gray-200 hover:text-gray-600 transition-all flex items-center justify-center gap-2"
          >
            <Plus size={16} />
            Add Subunit
          </button>
        </div>
      )}
    </div>
  );
}

function SubunitItem({ subunit, index, setEditingLesson }) {
  const lessons = useQuery(api.lessons.listLessons, { subunitId: subunit._id });
  const createLesson = useMutation(api.lessons.createLesson);
  const updateSubunit = useMutation(api.units.updateSubunit);
  const removeLesson = useMutation(api.lessons.removeLesson);

  const handleAddLesson = async () => {
    await createLesson({
      subunitId: subunit._id,
      title: "New Lesson",
      content: [{ type: "text", value: "" }],
      order: (lessons?.length || 0) + 1
    });
  };

  return (
    <div className="pl-8 border-l-2 border-gray-50 space-y-2">
      <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 group cursor-default">
        <div className="text-xs font-bold text-gray-300 group-hover:text-gray-400">
          {index + 1}.
        </div>
        <input 
          value={subunit.title}
          onChange={e => updateSubunit({ id: subunit._id, title: e.target.value })}
          className="flex-1 bg-transparent text-sm font-semibold text-gray-600 outline-none focus:border-b border-blue-600 transition-all"
        />
        <button 
          onClick={handleAddLesson}
          className="p-1.5 text-gray-300 hover:text-blue-600 hover:bg-white rounded-md transition-all opacity-0 group-hover:opacity-100"
        >
          <Plus size={16} />
        </button>
      </div>
      
      <div className="pl-6 space-y-1">
        {lessons?.map((lesson) => (
          <div 
            key={lesson._id}
            onClick={() => setEditingLesson(lesson)}
            className="flex items-center justify-between p-2.5 rounded-lg border border-transparent hover:border-gray-100 hover:bg-gray-50/50 group transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <FileText className="text-gray-300 group-hover:text-blue-500 transition-colors" size={16} />
              <span className="text-sm text-gray-500 font-medium group-hover:text-gray-700">
                {lesson.title}
              </span>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
               <button className="p-1.5 text-gray-400 hover:text-blue-600 rounded">
                 <FileEdit size={14} />
               </button>
               <button 
                onClick={e => { e.stopPropagation(); confirm("Delete Lesson?") && removeLesson({ id: lesson._id }); }}
                className="p-1.5 text-gray-400 hover:text-red-600 rounded"
               >
                 <Trash2 size={14} />
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
