FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install
COPY backend/requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source code, courses catalog and static frontend
COPY backend/ .
COPY courses/ ./courses/
COPY frontend/ ./frontend/

ENV COURSES_DIR=/app/courses
ENV FRONTEND_DIR=/app/frontend
ENV PORT=8080
EXPOSE 8080

CMD exec uvicorn app.main:app --host 0.0.0.0 --port ${PORT}
