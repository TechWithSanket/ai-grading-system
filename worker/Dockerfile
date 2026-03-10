FROM python:3.10-slim
WORKDIR /app

RUN apt-get update && apt-get install -y \
    libgl1 libglib2.0-0 libgomp1 libsm6 libxext6 \
    && rm -rf /var/lib/apt/lists/*

RUN pip install --no-cache-dir \
    "numpy==1.26.4" \
    "torch==2.1.0" \
    "torchvision==0.16.0" \
    "easyocr==1.7.1" \
    "transformers==4.35.0" \
    "opencv-python-headless==4.8.1.78" \
    Pillow redis psycopg2-binary sentencepiece

RUN pip install --force-reinstall "numpy==1.26.4"

COPY worker.py .
CMD ["python", "worker.py"]
