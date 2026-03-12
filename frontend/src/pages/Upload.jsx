import { useState } from "react";
import axios from "axios";

export default function Upload({ navigate }) {
  const [file, setFile] = useState(null);
  const [examId, setExamId] = useState("exam001");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [drag, setDrag] = useState(false);

  const handleUpload = async () => {
    if (!file) return setError("Please select a file first");
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await axios.post(
        `/api/upload?exam_id=${examId}`,
        formData
      );
      const { sheet_id } = res.data;
      const history = JSON.parse(localStorage.getItem("history") || "[]");
      history.unshift({ sheet_id, exam_id: examId, uploaded_at: new Date().toISOString(), file: file.name });
      localStorage.setItem("history", JSON.stringify(history.slice(0, 20)));
      navigate("results", sheet_id);
    } catch (e) {
      setError("Upload failed. Please try again.");
    }
    setLoading(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDrag(false);
    const f = e.dataTransfer.files[0];
    if (f) setFile(f);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Upload Answer Sheet</h2>
      <p className="text-gray-500 mb-6">Upload a handwritten or printed answer sheet to get AI-powered grades instantly.</p>

      <div
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={handleDrop}
        onClick={() => document.getElementById("fileInput").click()}
        className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition mb-6 ${
          drag ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
        }`}
      >
        <div className="text-5xl mb-3">📄</div>
        {file ? (
          <div>
            <p className="text-green-600 font-semibold">{file.name}</p>
            <p className="text-gray-400 text-sm mt-1">{(file.size / 1024).toFixed(1)} KB</p>
          </div>
        ) : (
          <div>
            <p className="text-gray-600 font-medium">Drag & drop your answer sheet here</p>
            <p className="text-gray-400 text-sm mt-1">or click to browse — JPG, PNG, PDF supported</p>
          </div>
        )}
        <input
          id="fileInput"
          type="file"
          accept="image/*,.pdf"
          className="hidden"
          onChange={(e) => setFile(e.target.files[0])}
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Exam ID</label>
        <input
          type="text"
          value={examId}
          onChange={(e) => setExamId(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="e.g. exam001"
        />
      </div>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <button
        onClick={handleUpload}
        disabled={loading || !file}
        className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold text-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        {loading ? "⏳ Uploading..." : "🚀 Upload & Grade"}
      </button>
    </div>
  );
}
