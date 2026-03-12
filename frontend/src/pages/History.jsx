import { useState, useEffect } from "react";

export default function History({ navigate }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const h = JSON.parse(localStorage.getItem("history") || "[]");
    setHistory(h);
  }, []);

  const clearHistory = () => {
    localStorage.removeItem("history");
    setHistory([]);
  };

  const formatDate = (iso) => {
    return new Date(iso).toLocaleString();
  };

  if (history.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <div className="text-6xl mb-4">📭</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">No History Yet</h2>
        <p className="text-gray-500 mb-6">Upload an answer sheet to get started</p>
        <button
          onClick={() => navigate("upload")}
          className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition"
        >
          Upload Now
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">📋 Upload History</h2>
        <button
          onClick={clearHistory}
          className="text-sm text-red-500 hover:underline"
        >
          Clear All
        </button>
      </div>

      <div className="space-y-4">
        {history.map((item, i) => (
          <div key={i} className="bg-white rounded-2xl shadow p-5 flex justify-between items-center">
            <div>
              <p className="font-semibold text-gray-800">📄 {item.file}</p>
              <p className="text-sm text-gray-500 mt-1">Exam: {item.exam_id}</p>
              <p className="text-xs text-gray-400 mt-1">{formatDate(item.uploaded_at)}</p>
            </div>
            <button
              onClick={() => navigate("results", item.sheet_id)}
              className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm hover:bg-blue-700 transition"
            >
              View Results
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
