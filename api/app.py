from fastapi import FastAPI, UploadFile, File
import shutil, uuid, os, redis, json, psycopg2

app = FastAPI()
UPLOAD_DIR = "/data/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)
r = redis.Redis(host="redis", port=6379)

def get_db():
    return psycopg2.connect(
        host=os.getenv("DB_HOST", "postgres"),
        dbname=os.getenv("DB_NAME", "grading"),
        user=os.getenv("DB_USER", "admin"),
        password=os.getenv("DB_PASS", "secret")
    )

@app.get("/")
def root():
    return {"status": "AI Grading API is running"}

@app.post("/upload")
async def upload(file: UploadFile = File(...), exam_id: str = "default"):
    sheet_id = str(uuid.uuid4())
    original_ext = os.path.splitext(file.filename)[1].lower() if file.filename else ".jpg"
    if original_ext not in [".jpg", ".jpeg", ".png", ".pdf"]:
        original_ext = ".jpg"
    path = os.path.join(UPLOAD_DIR, sheet_id + original_ext)
    with open(path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    print(f"Uploaded: {file.filename} -> {path}", flush=True)
    try:
        db = get_db()
        cur = db.cursor()
        cur.execute(
            "INSERT INTO answer_sheets (id, exam_id, status) VALUES (%s, %s, 'pending')",
            (sheet_id, exam_id)
        )
        db.commit()
        db.close()
    except Exception as e:
        print("DB log error:", e)
    r.rpush("ocr_queue", json.dumps({
        "sheet_id": sheet_id,
        "image_path": path,
        "exam_id": exam_id
    }))
    return {"sheet_id": sheet_id, "status": "queued"}

@app.get("/results/{sheet_id}")
def get_results(sheet_id: str):
    try:
        db = get_db()
        cur = db.cursor()
        cur.execute("SELECT ocr_result FROM answer_sheets WHERE id=%s", (sheet_id,))
        sheet = cur.fetchone()
        student_name = "unknown"
        date = "unknown"
        if sheet and sheet[0]:
            ocr = sheet[0]
            if isinstance(ocr, dict):
                student_name = ocr.get("student_name", "unknown")
                date = ocr.get("date", "unknown")
        cur.execute("""
            SELECT question, marks_awarded, max_marks, similarity_score, feedback
            FROM grading_results WHERE sheet_id = %s
        """, (sheet_id,))
        rows = cur.fetchall()
        db.close()
        if not rows:
            return {"sheet_id": sheet_id, "status": "pending or not found", "results": []}
        total_marks = sum(r[1] for r in rows if r[1])
        max_total = sum(r[2] for r in rows if r[2])
        percentage = round((total_marks / max_total * 100), 2) if max_total else 0
        return {
            "sheet_id": sheet_id,
            "student_name": student_name,
            "date": date,
            "total_marks": total_marks,
            "max_marks": max_total,
            "percentage": percentage,
            "results": [
                {
                    "question": r[0],
                    "marks_awarded": r[1],
                    "max_marks": r[2],
                    "similarity_score": round(r[3], 3) if r[3] else None,
                    "feedback": r[4]
                } for r in rows
            ]
        }
    except Exception as e:
        return {"error": str(e)}

@app.get("/queue/status")
def queue_status():
    return {
        "ocr_queue": r.llen("ocr_queue"),
        "grading_queue": r.llen("grading_queue"),
        "review_queue": r.llen("review_queue")
    }
