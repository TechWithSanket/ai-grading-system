import { useState, useEffect } from "react";

const features = [
  { icon: "🧠", title: "AI-Powered Evaluation", desc: "Advanced AI reads, understands, and scores handwritten answers with human-level accuracy." },
  { icon: "⚡", title: "High-Speed Scanning", desc: "Convert physical answer sheets into high-resolution digital copies using advanced scanning." },
  { icon: "🔔", title: "Instant Results", desc: "Auto-calculation of marks with grace marks, combining theory, practical & internals seamlessly." },
  { icon: "🖥️", title: "On-Screen Evaluation", desc: "Evaluators mark answers digitally with zoom, annotations, and question-wise scoring interface." },
];

const steps = [
  { icon: "📄", label: "Scanning Answer Sheet", desc: "Laser scanning handwritten answer pages with precision" },
  { icon: "📚", label: "Digitizing Pages", desc: "Converting physical pages to high-resolution digital format" },
  { icon: "☁️", label: "Uploading to AI", desc: "Securely transferring answer sheets to AI evaluation engine" },
  { icon: "🔍", label: "Reading Answers", desc: "AI vision model reads and interprets handwritten content" },
  { icon: "✅", label: "Grading Answers", desc: "AI evaluates each answer against marking criteria" },
  { icon: "📋", label: "Generating Report", desc: "Compiling detailed performance report with feedback" },
  { icon: "👤", label: "Delivering Results", desc: "Sending results to students and teachers instantly" },
];

export default function Home({ navigate }) {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep(prev => (prev + 1) % steps.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {/* Hero */}
      <div className="text-center py-20 px-4">
        <div className="inline-block text-sm font-semibold px-4 py-1 rounded-full mb-5"
          style={{background:"#f3e8ff", color:"#9A4CFF"}}>
          🚀 Powered by Groq Vision AI
        </div>
        <h1 className="text-5xl font-extrabold text-gray-900 mb-5 leading-tight">
          Grade Answer Sheets<br />
          <span style={{color:"#9A4CFF"}}>Instantly with AI</span>
        </h1>
        <p className="text-gray-500 text-lg max-w-xl mx-auto mb-10">
          Upload handwritten or printed answer sheets and get accurate grades, detailed feedback, and performance analytics in seconds.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate("upload")}
            className="text-white font-semibold px-8 py-3 rounded-full shadow-lg transition hover:opacity-90"
            style={{background:"#9A4CFF"}}
          >
            🚀 Start Grading
          </button>
          <button
            onClick={() => navigate("history")}
            className="font-semibold px-8 py-3 rounded-full transition hover:bg-purple-50"
            style={{background:"white", color:"#9A4CFF", border:"2px solid #9A4CFF"}}
          >
            📋 View History
          </button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-12 px-4">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">Everything You Need</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 transition hover:shadow-lg"
              style={{border:"1px solid #f0e6ff", boxShadow:"0 2px 12px rgba(154,76,255,0.06)"}}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4"
                style={{background:"#f3e8ff"}}>
                {f.icon}
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How AI Evaluates */}
      <div className="py-12 px-4">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">See How AI Evaluates in Real-Time</h2>
        <div className="bg-white rounded-2xl p-8"
          style={{border:"1px solid #f0e6ff", boxShadow:"0 2px 12px rgba(154,76,255,0.06)"}}>
          {/* Progress bar */}
          <div className="w-full rounded-full h-1.5 mb-8" style={{background:"#f3e8ff"}}>
            <div className="h-1.5 rounded-full transition-all duration-500"
              style={{width:`${((activeStep+1)/steps.length)*100}%`, background:"#9A4CFF"}} />
          </div>
          {/* Steps */}
          <div className="flex justify-between items-start gap-2 overflow-x-auto pb-2">
            {steps.map((s, i) => (
              <div key={i}
                className="flex flex-col items-center gap-2 min-w-16 cursor-pointer transition-all"
                style={{opacity: i === activeStep ? 1 : 0.35}}
                onClick={() => setActiveStep(i)}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-all"
                  style={{background: i === activeStep ? "#f3e8ff" : "#fafafa",
                    transform: i === activeStep ? "scale(1.1)" : "scale(1)",
                    border: i === activeStep ? "2px solid #9A4CFF" : "2px solid transparent"}}>
                  {s.icon}
                </div>
                <p className="text-xs font-semibold text-center leading-tight"
                  style={{color: i === activeStep ? "#9A4CFF" : "#aaa"}}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <p className="text-gray-500 text-sm">{steps[activeStep].desc}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-5 py-8 px-4 mb-8">
        {[
          { value: "99%", label: "Accuracy Rate" },
          { value: "<30s", label: "Grading Time" },
          { value: "10+", label: "Subjects Supported" },
        ].map((s, i) => (
          <div key={i} className="rounded-2xl p-6 text-center text-white"
            style={{background:"#9A4CFF"}}>
            <p className="text-4xl font-extrabold">{s.value}</p>
            <p className="mt-1 text-sm" style={{color:"#e9d5ff"}}>{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
