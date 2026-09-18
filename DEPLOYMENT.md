# AirWatch AI - 1-Click Deployment Guide (Render)

AirWatch AI is pre-configured with a unified build setup to run both the **React Frontend** and **FastAPI + Gemini AI Backend** on a single live URL on **Render.com** (Free Tier).

---

## 🚀 Step-by-Step Deployment (Free on Render)

### 1. Sign in to Render
1. Open [render.com](https://render.com) and click **Get Started** or **Sign In**.
2. Select **Continue with GitHub** (sign in using your GitHub account `kritika7268`).

### 2. Connect Your Repository
1. On the Render Dashboard, click the **New +** button (top right).
2. Select **Web Service**.
3. Choose **Build and deploy from a Git repository**.
4. In the list of repositories, select **kritika7268/airwatch-ai** (or paste `https://github.com/kritika7268/airwatch-ai`).

### 3. Configure the Web Service
Fill in the following details (most are auto-filled by `render.yaml`):

| Setting | Value |
|---|---|
| **Name** | `airwatch-ai` |
| **Language / Environment** | `Python 3` |
| **Region** | Any (e.g. `Oregon (US West)` or `Singapore`) |
| **Branch** | `main` |
| **Build Command** | `./build.sh` |
| **Start Command** | `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT` |
| **Instance Type** | **Free** |

### 4. Set Environment Variables
Under **Environment Variables**, add:

| Key | Value | Notes |
|---|---|---|
| `PYTHON_VERSION` | `3.11.9` | Ensures compatible Python environment |
| `NODE_VERSION` | `20.11.0` | For building the Vite React frontend |
| `GEMINI_API_KEY` | *Your Gemini API Key* | Get a free key at [Google AI Studio](https://aistudio.google.com/apikey) *(optional: can also be entered directly from the web UI)* |

### 5. Deploy!
1. Click **Deploy Web Service**.
2. Render will automatically:
   - Run `npm install && npm run build` for the frontend.
   - Install all backend dependencies (`fastapi`, `uvicorn`, `google-generativeai`, etc.).
   - Launch the FastAPI server serving both API and the interactive React dashboard.
3. Within 2-3 minutes, your app will be live at:
   **`https://airwatch-ai-xxxx.onrender.com`**

---

## 🔄 Automatic Continuous Deployment (CI/CD)
Whenever you push new code to the `main` branch on GitHub:
```bash
git add .
git commit -m "update"
git push origin main
```
Render will automatically detect the changes, re-build, and redeploy your live website!
