#!/usr/bin/env bash
# exit on error
set -o errexit

echo "===> 1/2: Installing dependencies & Building Frontend (Vite/React)..."
cd frontend
npm install
npm run build
cd ..

echo "===> 2/2: Installing Backend Dependencies..."
pip install --upgrade pip
pip install -r backend/requirements.txt

echo "===> Build completed successfully!"
