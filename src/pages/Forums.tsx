import React, { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { MessageSquare, Pin, Lock, Plus, Users, Clock } from 'lucide-react';

const Forums = () => {
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<any>(null);

  const courses = useQuery(api.courses.list, { onlyPublished: false });
  const topics = useQuery(
    api.forums.getTopicsByCourse, 
    selectedCourse ? { courseId: selectedCourse as any } : 'skip'
  );
  const posts = useQuery(
    api.forums.getPostsByTopic, 
    selectedTopic ? { topicId: selectedTopic._id } : 'skip'
  );

  const createTopic = useMutation(api.forums.createTopic);
  const createPost = useMutation(api.forums.createPost);
  const updateTopic = useMutation(api.forums.updateTopic);
  const deleteTopic = useMutation(api.forums.deleteTopic);

  const [topicForm, setTopicForm] = useState({
    title: '',
    description: '',
  });

  const [postContent, setPostContent] = useState('');

  const handleCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse || !topicForm.title) return;

    try {
      await createTopic({
        courseId: selectedCourse as any,
        title: topicForm.title,
        description: topicForm.description,
        createdBy: 'temp-user-id' as any, // In real app, get from auth
      });

      setShowCreateModal(false);
      setTopicForm({ title: '', description: '' });
    } catch (error) {
      console.error('Error creating topic:', error);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTopic || !postContent.trim()) return;

    try {
      await createPost({
        topicId: selectedTopic._id,
        userId: 'temp-user-id' as any, // In real app, get from auth
        content: postContent,
      });

      setPostContent('');
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const togglePin = async (topicId: string, isPinned: boolean) => {
    await updateTopic({
      id: topicId as any,
      isPinned: !isPinned,
    });
  };

  const toggleLock = async (topicId: string, isLocked: boolean) => {
    await updateTopic({
      id: topicId as any,
      isLocked: !isLocked,
    });
  };

  const handleDeleteTopic = async (topicId: string) => {
    if (confirm('Are you sure you want to delete this topic and all its posts?')) {
      await deleteTopic({ id: topicId as any });
      if (selectedTopic?._id === topicId) {
        setSelectedTopic(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Discussion Forums</h1>
        <div className="flex gap-4">
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Course</option>
            {courses?.map((course) => (
              <option key={course._id} value={course._id}>
                {course.title}
              </option>
            ))}
          </select>
          <button
            onClick={() => setShowCreateModal(true)}
            disabled={!selectedCourse}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            <span>New Topic</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Topics List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Topics</h2>
            </div>
            
            {selectedCourse && topics ? (
              <div className="divide-y divide-gray-200">
                {topics.length > 0 ? (
                  topics.map((topic) => (
                    <div
                      key={topic._id}
                      className={`p-4 cursor-pointer hover:bg-gray-50 ${
                        selectedTopic?._id === topic._id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                      }`}
                      onClick={() => setSelectedTopic(topic)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            {topic.isPinned && <Pin className="h-4 w-4 text-blue-600" />}
                            {topic.isLocked && <Lock className="h-4 w-4 text-gray-600" />}
                            <h3 className="text-sm font-medium text-gray-900 truncate">
                              {topic.title}
                            </h3>
                          </div>
                          
                          <div className="mt-1 flex items-center space-x-4 text-xs text-gray-500">
                            <span className="flex items-center">
                              <MessageSquare className="h-3 w-3 mr-1" />
                              {topic.postCount}
                            </span>
                            <span className="flex items-center">
                              <Users className="h-3 w-3 mr-1" />
                              {topic.creatorName}
                            </span>
                          </div>
                          
                          {topic.lastPostAt && (
                            <div className="mt-1 text-xs text-gray-500">
                              Last: {new Date(topic.lastPostAt).toLocaleDateString()} by {topic.lastPostBy}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex space-x-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              togglePin(topic._id, topic.isPinned);
                            }}
                            className={`p-1 rounded ${topic.isPinned ? 'text-blue-600' : 'text-gray-400 hover:text-blue-600'}`}
                          >
                            <Pin className="h-3 w-3" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleLock(topic._id, topic.isLocked);
                            }}
                            className={`p-1 rounded ${topic.isLocked ? 'text-gray-600' : 'text-gray-400 hover:text-gray-600'}`}
                          >
                            <Lock className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    No topics yet. Create the first one!
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                Select a course to view topics
              </div>
            )}
          </div>
        </div>

        {/* Posts View */}
        <div className="lg:col-span-2">
          {selectedTopic ? (
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">{selectedTopic.title}</h2>
                    {selectedTopic.description && (
                      <p className="text-sm text-gray-600 mt-1">{selectedTopic.description}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteTopic(selectedTopic._id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Delete Topic
                  </button>
                </div>
              </div>

              {/* Posts */}
              <div className="max-h-96 overflow-y-auto">
                {posts && posts.length > 0 ? (
                  <div className="divide-y divide-gray-200">
                    {posts.map((post) => (
                      <div key={post._id} className="p-4">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
                              <span className="text-xs font-medium text-gray-700">
                                {post.userName.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium text-gray-900">{post.userName}</span>
                              <span className="text-xs text-gray-500">
                                {new Date(post.createdAt).toLocaleString()}
                              </span>
                              {post.editedAt && (
                                <span className="text-xs text-gray-400">(edited)</span>
                              )}
                            </div>
                            <div className="mt-1 text-sm text-gray-700 whitespace-pre-wrap">
                              {post.content}
                            </div>
                            {post.replyCount > 0 && (
                              <div className="mt-2 text-xs text-gray-500">
                                {post.replyCount} {post.replyCount === 1 ? 'reply' : 'replies'}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    No posts yet. Start the discussion!
                  </div>
                )}
              </div>

              {/* New Post Form */}
              {!selectedTopic.isLocked && (
                <div className="p-4 border-t bg-gray-50">
                  <form onSubmit={handleCreatePost}>
                    <textarea
                      value={postContent}
                      onChange={(e) => setPostContent(e.target.value)}
                      placeholder="Write your post..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                    <div className="mt-2 flex justify-end">
                      <button
                        type="submit"
                        disabled={!postContent.trim()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                      >
                        Post Reply
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border p-8 text-center text-gray-500">
              Select a topic to view the discussion
            </div>
          )}
        </div>
      </div>

      {/* Create Topic Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Create New Topic</h2>
            
            <form onSubmit={handleCreateTopic} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Topic Title *
                </label>
                <input
                  type="text"
                  value={topicForm.title}
                  onChange={(e) => setTopicForm({ ...topicForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={topicForm.description}
                  onChange={(e) => setTopicForm({ ...topicForm, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Optional topic description"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create Topic
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Forums;