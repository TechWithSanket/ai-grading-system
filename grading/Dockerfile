FROM python:3.10-slim
WORKDIR /app

RUN apt-get update && apt-get install -y \
    poppler-utils \
    && rm -rf /var/lib/apt/lists/*

RUN pip install --no-cache-dir \
    "numpy==1.26.4" \
    "torch==2.1.0" \
    "transformers==4.35.0" \
    "sentence-transformers==2.2.2" \
    redis \
    psycopg2-binary \
    requests \
    pdf2image \
    Pillow

COPY grader.py .
CMD ["python", "grader.py"]
