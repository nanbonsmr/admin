import { useState } from "react";
import { X, Plus, Trash2, Type, Image as ImageIcon, Youtube, Save, Eye, GripVertical, File, Video } from "lucide-react";
import { clsx } from "clsx";
import FileUpload from "./FileUpload";

export default function LessonEditor({ lesson, onSave, onClose }) {
  const [title, setTitle] = useState(lesson.title);
  const [content, setContent] = useState(lesson.content || []);

  const addBlock = (type) => {
    setContent([...content, { type, value: "" }]);
  };

  const updateBlock = (index, value, fileName = null, fileSize = null, mimeType = null) => {
    const newContent = [...content];
    newContent[index].value = value;
    if (fileName) newContent[index].fileName = fileName;
    if (fileSize) newContent[index].fileSize = fileSize;
    if (mimeType) newContent[index].mimeType = mimeType;
    setContent(newContent);
  };

  const removeBlock = (index) => {
    setContent(content.filter((_, i) => i !== index));
  };

  const handleFileUploaded = (index, fileData) => {
    updateBlock(index, fileData.storageId, fileData.fileName, fileData.fileSize, fileData.mimeType);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              <Type size={20} />
            </div>
            <div>
              <input 
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Lesson Title"
                className="text-xl font-bold text-gray-900 outline-none w-64 focus:border-b-2 border-blue-600 pb-1 transition-all"
              />
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mt-1">Editing Lesson Content</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => onSave({ title, content })}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 shadow-sm transition-all text-sm"
            >
              <Save size={18} />
              Save Lesson
            </button>
            <button 
              onClick={onClose}
              className="p-2.5 text-gray-400 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-gray-50/30">
          {content.map((block, index) => (
            <div key={index} className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:border-blue-200 transition-all">
              <div className="absolute -left-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all">
                <GripVertical className="text-gray-300" size={20} />
              </div>
              
              <div className="flex items-start justify-between mb-4">
                <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest bg-gray-50 px-2 py-1 rounded">
                  {block.type} Block
                </span>
                <button 
                  onClick={() => removeBlock(index)}
                  className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {block.type === "text" ? (
                <textarea 
                  value={block.value}
                  onChange={e => updateBlock(index, e.target.value)}
                  placeholder="Write lesson content here... (Supports Markdown)"
                  rows={4}
                  className="w-full text-gray-700 leading-relaxed outline-none resize-none bg-transparent placeholder:text-gray-300"
                />
              ) : block.type === "image" ? (
                <div className="space-y-4">
                  <FileUpload
                    onFileUploaded={(fileData) => handleFileUploaded(index, fileData)}
                    acceptedTypes="image/*"
                    maxSize={10}
                    className="mb-3"
                  />
                  {block.value && (
                    <div className="rounded-xl overflow-hidden border border-gray-100 max-h-64 flex justify-center bg-gray-50 relative">
                      <img src={`https://brainy-crow-276.convex.cloud/api/storage/${block.value}`} className="max-w-full object-contain" alt="Preview" />
                      {block.fileName && (
                        <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                          {block.fileName}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : block.type === "video" ? (
                <div className="space-y-4">
                  <FileUpload
                    onFileUploaded={(fileData) => handleFileUploaded(index, fileData)}
                    acceptedTypes="video/*"
                    maxSize={100}
                    className="mb-3"
                  />
                  {block.value && (
                    <div className="rounded-xl overflow-hidden border border-gray-100 bg-gray-50">
                      <video 
                        src={`https://brainy-crow-276.convex.cloud/api/storage/${block.value}`} 
                        controls 
                        className="w-full max-h-64"
                      />
                      <div className="p-2 text-sm text-gray-600">
                        {block.fileName || 'Uploaded Video'} ({Math.round((block.fileSize || 0) / 1024 / 1024)}MB)
                      </div>
                    </div>
                  )}
                </div>
              ) : block.type === "file" ? (
                <div className="space-y-4">
                  <FileUpload
                    onFileUploaded={(fileData) => handleFileUploaded(index, fileData)}
                    acceptedTypes=".pdf,.doc,.docx,.txt,.ppt,.pptx,.xls,.xlsx"
                    maxSize={50}
                    className="mb-3"
                  />
                  {block.value && (
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <File className="text-blue-600" size={24} />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{block.fileName || 'Uploaded File'}</div>
                        <div className="text-sm text-gray-500">
                          {Math.round((block.fileSize || 0) / 1024)}KB • {block.mimeType}
                        </div>
                      </div>
                      <a 
                        href={`https://brainy-crow-276.convex.cloud/api/storage/${block.value}`} 
                        download={block.fileName}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                      >
                        Download
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="flex-1 bg-gray-50/50 rounded-xl px-4 py-3 border border-gray-100 flex items-center gap-3">
                      <Youtube className="text-red-600" size={20} />
                      <input 
                        type="text"
                        value={block.value}
                        onChange={e => updateBlock(index, e.target.value)}
                        placeholder="Paste YouTube Video ID (e.g. dQw4w9WgXcQ)"
                        className="flex-1 bg-transparent focus:outline-none text-sm font-medium"
                      />
                    </div>
                  </div>
                  {block.value && (
                    <div className="aspect-video rounded-xl overflow-hidden bg-gray-900 shadow-inner flex items-center justify-center">
                       <iframe 
                        width="100%" 
                        height="100%" 
                        src={`https://www.youtube.com/embed/${block.value}`} 
                        title="YouTube preview"
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Add Block Toolbar */}
          <div className="pt-8 flex items-center justify-center gap-4">
            <div className="h-px bg-gray-200 flex-1" />
            <div className="flex gap-2">
              <button 
                onClick={() => addBlock("text")}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-bold text-gray-600 hover:border-blue-600 hover:text-blue-600 transition-all shadow-sm"
              >
                <Type size={16} />
                Text
              </button>
              <button 
                onClick={() => addBlock("image")}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-bold text-gray-600 hover:border-blue-600 hover:text-blue-600 transition-all shadow-sm"
              >
                <ImageIcon size={16} />
                Image
              </button>
              <button 
                onClick={() => addBlock("video")}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-bold text-gray-600 hover:border-blue-600 hover:text-blue-600 transition-all shadow-sm"
              >
                <Video size={16} />
                Video
              </button>
              <button 
                onClick={() => addBlock("file")}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-bold text-gray-600 hover:border-blue-600 hover:text-blue-600 transition-all shadow-sm"
              >
                <File size={16} />
                File
              </button>
              <button 
                onClick={() => addBlock("youtube")}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-bold text-gray-600 hover:border-blue-600 hover:text-blue-600 transition-all shadow-sm"
              >
                <Youtube size={16} />
                YouTube
              </button>
            </div>
            <div className="h-px bg-gray-200 flex-1" />
          </div>
        </div>
      </div>
    </div>
  );
}
