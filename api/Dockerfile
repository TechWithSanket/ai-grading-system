FROM python:3.10-slim
WORKDIR /app
RUN pip install fastapi uvicorn python-multipart redis psycopg2-binary
COPY app.py .
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
