import os, sys
os.environ["PADDLE_PDX_DISABLE_MODEL_SOURCE_CHECK"] = "True"

import redis, psycopg2, json, time, cv2, numpy as np
import easyocr
from transformers import TrOCRProcessor, VisionEncoderDecoderModel
from PIL import Image

print("Step 1: Loading EasyOCR...", flush=True)
ocr_reader = easyocr.Reader(['en'], gpu=False, verbose=False)
print("Step 2: EasyOCR loaded.", flush=True)

print("Step 3: Loading TrOCR processor...", flush=True)
processor = TrOCRProcessor.from_pretrained('microsoft/trocr-base-handwritten')
print("Step 4: TrOCR processor loaded.", flush=True)

print("Step 5: Loading TrOCR model...", flush=True)
trocr_model = VisionEncoderDecoderModel.from_pretrained('microsoft/trocr-base-handwritten')
print("Step 6: TrOCR model loaded.", flush=True)

def get_db():
    return psycopg2.connect(
        host=os.getenv("DB_HOST", "postgres"),
        dbname=os.getenv("DB_NAME", "grading"),
        user=os.getenv("DB_USER", "admin"),
        password=os.getenv("DB_PASS", "secret")
    )

try:
    db = get_db()
    cur = db.cursor()
    cur.execute("ALTER TABLE answer_sheets ADD COLUMN IF NOT EXISTS ocr_result JSONB")
    db.commit()
    db.close()
    print("Step 7: DB ready.", flush=True)
except Exception as e:
    print(f"Step 7: DB note: {e}", flush=True)

r = redis.Redis(host=os.getenv("REDIS_HOST", "redis"), port=6379)

def process_sheet(sheet_id, image_path):
    print(f"Processing sheet {sheet_id}", flush=True)
    image = cv2.imread(image_path)
    if image is None:
        print(f"ERROR: Cannot read {image_path}", flush=True)
        return

    results = ocr_reader.readtext(image_path)
    print(f"Detected {len(results)} lines", flush=True)

    # Join all tokens into one text stream
    tokens = [text.strip() for bbox, text, conf in results if text.strip()]
    full_text = " ".join(tokens)
    print(f"Full text: {full_text[:200]}", flush=True)

    # Parse Q&A pairs by detecting "1." "2." etc or "Q1" "Q2"
    import re
    # Split on question numbers like "1.", "2.", "Q1", "Q2"
    parts = re.split(r'(?<!\d)(\d+\.|Q\d+\.?)\s+', full_text)

    qa_pairs = []
    i = 1
    while i < len(parts) - 1:
        marker = parts[i].strip()
        content = parts[i+1].strip() if i+1 < len(parts) else ""
        if marker and content:
            # Split content into question and answer
            # Question ends at "?" or first sentence
            q_match = re.split(r'(\?)', content, maxsplit=1)
            if len(q_match) >= 2:
                question = (q_match[0] + q_match[1]).strip()
                answer = q_match[2].strip() if len(q_match) > 2 else ""
            else:
                question = content[:80]
                answer = content[80:]
            if answer:
                qa_pairs.append((question, answer))
                print(f"  Q: {question[:60]}", flush=True)
                print(f"  A: {answer[:60]}", flush=True)
        i += 2

    # Fallback
    if not qa_pairs:
        qa_pairs = [("What is the main topic discussed?", full_text)]

    print(f"Parsed {len(qa_pairs)} Q&A pairs", flush=True)

    db = get_db()
    cur = db.cursor()
    cur.execute(
        "UPDATE answer_sheets SET status='ocr_done', ocr_result=%s WHERE id=%s",
        (json.dumps([{"question": q, "answer": a} for q, a in qa_pairs]), sheet_id)
    )
    db.commit()
    db.close()

    for question, answer in qa_pairs:
        r.rpush("grading_queue", json.dumps({
            "sheet_id": sheet_id,
            "question": question,
            "answer": answer
        }))
        print(f"  Queued: {question[:60]}", flush=True)

    print(f"Sheet {sheet_id} done — {len(qa_pairs)} answers queued", flush=True)

print("Models loaded successfully. Worker started, waiting for jobs...", flush=True)
while True:
    job = r.blpop("ocr_queue", timeout=5)
    if job:
        data = json.loads(job[1])
        try:
            process_sheet(data["sheet_id"], data.get("image_path") or data.get("path"))
        except Exception as e:
            print(f"Error: {e}", flush=True)
            import traceback
            traceback.print_exc()
