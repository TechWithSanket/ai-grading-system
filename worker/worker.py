import os, redis, psycopg2, json, time

def get_db():
    return psycopg2.connect(
        host=os.getenv("DB_HOST", "postgres"),
        dbname=os.getenv("DB_NAME", "grading"),
        user=os.getenv("DB_USER", "admin"),
        password=os.getenv("DB_PASS", "secret")
    )

r = redis.Redis(host=os.getenv("REDIS_HOST", "redis"), port=6379)

print("✅ Worker ready, waiting for jobs...", flush=True)

while True:
    job = r.blpop("ocr_queue", timeout=5)
    if job:
        data = json.loads(job[1])
        try:
            sheet_id = data["sheet_id"]
            image_path = data.get("image_path") or data.get("path")
            print(f"Forwarding sheet {sheet_id} to grader", flush=True)

            # Update DB status
            db = get_db()
            cur = db.cursor()
            cur.execute(
                "UPDATE answer_sheets SET status='processing' WHERE id=%s",
                (sheet_id,)
            )
            db.commit()
            db.close()

            # Forward directly to grader via ocr_queue
            r.rpush("vision_queue", json.dumps({"sheet_id": sheet_id, "image_path": image_path}))
            print(f"Sheet {sheet_id} ready for Groq Vision grading", flush=True)

        except Exception as e:
            print(f"Error: {e}", flush=True)
            import traceback
            traceback.print_exc()
