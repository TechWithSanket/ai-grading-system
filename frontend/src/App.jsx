import { useState } from "react";
import Upload from "./pages/Upload";
import Results from "./pages/Results";
import History from "./pages/History";
import Home from "./pages/Home";

export default function App() {
  const [page, setPage] = useState("home");
  const [sheetId, setSheetId] = useState(null);

  const navigate = (p, id = null) => {
    setPage(p);
    if (id) setSheetId(id);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{background:"#ffffff"}}>
      {/* Navbar */}
      <nav style={{background:"#ffffff", borderBottom:"1px solid #f0e6ff"}} className="px-6 py-4 shadow-sm">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("home")}>
            <span className="text-2xl">🎓</span>
            <span className="text-lg font-extrabold" style={{color:"#9A4CFF"}}>AI Grading</span>
            <span className="text-lg font-extrabold text-gray-800">System</span>
          </div>
          <div className="flex gap-2">
            {[
              {key:"home", label:"Home"},
              {key:"upload", label:"Upload"},
              {key:"history", label:"History"}
            ].map(p => (
              <button
                key={p.key}
                onClick={() => navigate(p.key)}
                className="px-4 py-1.5 rounded-full text-sm font-semibold transition"
                style={page === p.key
                  ? {background:"#9A4CFF", color:"white"}
                  : {background:"transparent", color:"#555", border:"1px solid #e0d0ff"}}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Pages */}
      <div className="max-w-6xl mx-auto px-4 py-8 w-full flex-1">
        {page === "home"    && <Home navigate={navigate} />}
        {page === "upload"  && <Upload navigate={navigate} />}
        {page === "results" && <Results sheetId={sheetId} navigate={navigate} />}
        {page === "history" && <History navigate={navigate} />}
      </div>

      {/* Footer */}
      <footer style={{background:"#f9f5ff", borderTop:"1px solid #ede0ff"}} className="py-6 mt-4">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎓</span>
            <span className="font-bold text-gray-800">AI Grading System</span>
          </div>
          <p className="text-sm" style={{color:"#9A4CFF"}}>© 2026 Sankett Kasar. All rights reserved.</p>
          <div className="flex gap-2 text-sm text-gray-400">
            <span>Powered by</span>
            <span className="font-semibold" style={{color:"#9A4CFF"}}>Groq Vision AI</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
