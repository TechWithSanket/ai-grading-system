CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY,
  name TEXT,
  email TEXT
);

CREATE TABLE IF NOT EXISTS exams (
  id UUID PRIMARY KEY,
  name TEXT,
  subject TEXT,
  total_marks INT
);

CREATE TABLE IF NOT EXISTS answer_sheets (
  id UUID PRIMARY KEY,
  student_id UUID,
  exam_id UUID,
  uploaded_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ocr_output (
  id SERIAL PRIMARY KEY,
  sheet_id UUID,
  question_label TEXT,
  extracted_text TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS model_answers (
  question_id TEXT PRIMARY KEY,
  model_answer TEXT,
  max_marks INT,
  keywords TEXT,
  rubric_definition TEXT
);

CREATE TABLE IF NOT EXISTS grading_results (
  id SERIAL PRIMARY KEY,
  sheet_id UUID,
  question TEXT,
  marks_awarded INT,
  max_marks INT,
  similarity_score FLOAT,
  feedback TEXT,
  graded_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS review_queue (
  id SERIAL PRIMARY KEY,
  sheet_id UUID,
  question TEXT,
  reason TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id SERIAL PRIMARY KEY,
  action TEXT,
  details JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE answer_sheets ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';
ALTER TABLE answer_sheets ADD COLUMN IF NOT EXISTS ocr_result JSONB;

CREATE TABLE IF NOT EXISTS grading_results (
    id SERIAL PRIMARY KEY,
    sheet_id TEXT,
    question TEXT,
    marks_awarded NUMERIC,
    max_marks NUMERIC,
    similarity_score NUMERIC,
    feedback TEXT,
    graded_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS review_queue (
    id SERIAL PRIMARY KEY,
    sheet_id TEXT,
    question TEXT,
    reason TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
