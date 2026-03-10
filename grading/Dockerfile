FROM python:3.10-slim
WORKDIR /app
RUN pip install --no-cache-dir \
    "numpy==1.26.4" \
    "torch==2.1.0" \
    "transformers==4.35.0" \
    "sentence-transformers==2.2.2" \
    redis \
    psycopg2-binary \
    requests
RUN pip install --force-reinstall "numpy==1.26.4"
COPY grader.py .
CMD ["python", "grader.py"]
