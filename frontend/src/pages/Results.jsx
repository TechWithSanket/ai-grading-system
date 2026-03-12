import { useState, useEffect } from "react";
import axios from "axios";

export default function Results({ sheetId, navigate }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((d) => (d.length >= 3 ? "" : d + "."));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!sheetId) return;
    let stableCount = 0;
    let lastCount = 0;
    const poll = setInterval(async () => {
      try {
        const res = await axios.get(`/api/results/${sheetId}`);
        if (res.data.results && res.data.results.length > 0) {
          setData(res.data);
          setLoading(false);
          // Keep polling until results stabilize (no new questions added)
          if (res.data.results.length === lastCount) {
            stableCount++;
            if (stableCount >= 3) clearInterval(poll);
          } else {
            stableCount = 0;
            lastCount = res.data.results.length;
          }
        }
      } catch (e) {
        console.error(e);
      }
    }, 5000);
    return () => clearInterval(poll);
  }, [sheetId]);

  const getColor = (pct) => {
    if (pct >= 75) return "text-green-600";
    if (pct >= 50) return "text-yellow-600";
    return "text-red-500";
  };

  const getBg = (pct) => {
    if (pct >= 75) return "bg-green-500";
    if (pct >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <div className="text-6xl mb-6">🤖</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">AI is grading{dots}</h2>
        <p className="text-gray-500 mb-8">OCR is extracting text, Mistral 7B is grading answers</p>
        <div className="flex justify-center gap-3">
          <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            <span className="text-sm text-blue-600">OCR Processing</span>
          </div>
          <div className="flex items-center gap-2 bg-purple-50 px-4 py-2 rounded-full">
            <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
            <span className="text-sm text-purple-600">LLM Grading</span>
          </div>
        </div>
        <p className="text-gray-400 text-sm mt-8">This may take 1-2 minutes</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">📊 Grading Results</h2>
        <button
          onClick={() => navigate("upload")}
          className="text-sm text-blue-600 hover:underline"
        >
          ← Upload Another
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow p-6 mb-6 text-center">
        <p className="text-gray-500 text-sm mb-1">Total Score</p>
        <p className={`text-6xl font-bold mb-2 ${getColor(data.percentage)}`}>
          {data.percentage}%
        </p>
        <p className="text-gray-600 text-lg">
          {data.total_marks} / {data.max_marks} marks
        </p>
        <div className="w-full bg-gray-200 rounded-full h-3 mt-4">
          <div
            className={`h-3 rounded-full transition-all ${getBg(data.percentage)}`}
            style={{ width: `${data.percentage}%` }}
          ></div>
        </div>
      </div>

      <div className="space-y-4">
        {data.results.map((r, i) => (
          <div key={i} className="bg-white rounded-2xl shadow p-5">
            <div className="flex justify-between items-start mb-3">
              <p className="font-semibold text-gray-800 flex-1 pr-4">
                Q{i + 1}: {r.question}
              </p>
              <span className={`text-lg font-bold whitespace-nowrap ${getColor((r.marks_awarded / r.max_marks) * 100)}`}>
                {r.marks_awarded}/{r.max_marks}
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2 mb-3">
              <div
                className={`h-2 rounded-full ${getBg((r.marks_awarded / r.max_marks) * 100)}`}
                style={{ width: `${(r.marks_awarded / r.max_marks) * 100}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600">💬 {r.feedback}</p>
          </div>
        ))}
      </div>

      <button
        onClick={() => navigate("upload")}
        className="w-full mt-6 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
      >
        📤 Grade Another Sheet
      </button>
    </div>
  );
}
