# Projects — master index

Everything Arnav Bule has built, in one place. Generated on 2026-09-16 from the portfolio data and the GitHub account [GODOSTROYER](https://github.com/GODOSTROYER); portfolio at [www.arnavbule.in](https://www.arnavbule.in).

## Featured (shown on the portfolio)

| Project | Period | Live | Code | Stack |
|---|---|---|---|---|
| **Cadence** | Sep 2026 | [www.arnavbule.in/hiver-assignment](https://www.arnavbule.in/hiver-assignment) | [GitHub](https://github.com/GODOSTROYER/cadence) | Python · FastAPI · Google Gemini · BM25 · Pydantic · SQLite · React 18 · TypeScript · Vite · Tailwind · Vercel |
| **Parakh** | Aug – Sep 2026 | [www.arnavbule.in/parakh](https://www.arnavbule.in/parakh) | [GitHub](https://github.com/GODOSTROYER/parakh) | Next.js 15 · React 19 · TypeScript · Tailwind v4 · pdf.js · Google Gemini · Vercel |
| **Sentinel** | Sep 2026 | [huggingface.co/spaces/GODOSTROYER/sentinel](https://huggingface.co/spaces/GODOSTROYER/sentinel) | [GitHub](https://github.com/GODOSTROYER/sentinel-vad) | Python · PyTorch · CLIP ViT-B/32 · Qwen3-VL-2B + LoRA · YOLO11n · OpenCV · React 19 · Vite |
| **QR Studio** | 2026 | [qr-studio.arnavbule.in](https://qr-studio.arnavbule.in) | [GitHub](https://github.com/GODOSTROYER/qr-tree-studio) | WebGPU · WGSL · React 19 · Vite · jsQR · Vercel |
| **Mini Task Tracker** | 2025 | [www.arnavbule.in/task-tracker](https://www.arnavbule.in/task-tracker) | [GitHub](https://github.com/GODOSTROYER/task-tracker) | Next.js 16 · React 19 · TypeScript · Express · Neon Postgres · Sequelize · Vercel |
| **Email Digital Twin** | 2025 | — | — | Chrome Extension · Node.js · Express · Google Gemini · LanceDB · Gmail API · OAuth 2.0 |
| **Sicklesense** | 2025 | [huggingface.co/spaces/GODOSTROYER/Sicklesense](https://huggingface.co/spaces/GODOSTROYER/Sicklesense) | [GitHub](https://github.com/GODOSTROYER/sicklesense) | Python · TensorFlow · Keras · OpenCV · Streamlit · Docker · Hugging Face |
| **Road Extraction On Satellite Images** | Aug 2024 – Present | — | — | SIH Project (No. of Group Members – 6) |
| **ERP Exerciser** | Aug 2024 – Present | — | — | Industry Project (No. of Group Members – 3) |
| **Prisma** | Jan 2023 – Apr 2024 | — | — | SY Mini Project (No. of Group Members – 3) |

### Cadence

Built an evaluated AI support agent for @SpotifyCares as the Hiver SDE Intern take-home: one structured Gemini call classifies a tweet into 12 intents, drafts a ≤280-character reply grounded in six BM25-retrieved threads from 27,627 real conversations, and decides whether to auto-handle or escalate — with deterministic money/security/legal/churn rules that can force an escalation the model cannot undo, and a release veto that replaces any draft carrying an uncited claim or unsupported link with a holding reply.

- Live: https://www.arnavbule.in/hiver-assignment  
- Code: https://github.com/GODOSTROYER/cadence

### Parakh

Built Parakh (परख), a serverless AI exam checker: upload a question paper and a student's handwritten answer sheet (plus an optional marking scheme) and it extracts every question, finds and highlights each answer's exact ink region on the sheet, grades it, and writes per-question feedback with a teacher summary — no auth, no database, nothing stored beyond the browser session, and a one-click sample exam to try the whole flow.

- Live: https://www.arnavbule.in/parakh  
- Code: https://github.com/GODOSTROYER/parakh

### Sentinel

Built a fully local video anomaly detector in a one-day hackathon that runs on a single 8 GB RTX 4060 laptop GPU: a trained head on frozen CLIP ViT-B/32 features scores footage at 2 FPS, a LoRA-adapted Qwen3-VL-2B verifies scene context on a bounded cadence, and per-class temporal state machines turn repeated evidence into timestamped events — zero hosted model calls at runtime.

- Live: https://huggingface.co/spaces/GODOSTROYER/sentinel  
- Code: https://github.com/GODOSTROYER/sentinel-vad

### QR Studio

Built a WebGPU studio that grows any link or message into a 3D voxel tree whose canopy encodes a working QR code — click the tree and it flattens into a top-down view, captured straight off the GPU canvas as a PNG that ordinary phone cameras can scan.

- Live: https://qr-studio.arnavbule.in  
- Code: https://github.com/GODOSTROYER/qr-tree-studio

### Mini Task Tracker

Built a multi-user task tracker with a Next.js 16 (React 19) frontend and an Express + TypeScript REST API on Neon PostgreSQL via Sequelize: owner-scoped workspaces and tasks (title, description, status, priority, due date, position) shown in Board, List, Table and Timeline views.

- Live: https://www.arnavbule.in/task-tracker  
- Code: https://github.com/GODOSTROYER/task-tracker

### Email Digital Twin

Built an AI-powered Chrome Extension and Node.js backend that learns a user's unique writing style to generate hyper-personalized, context-aware email drafts using Google Gemini and LanceDB.

### Sicklesense

Built a low-cost, AI-powered digital telepathology solution that detects sickle cells from blood smear images using a fine-tuned ResNet50 deep learning model, achieving >92% accuracy.

- Live: https://huggingface.co/spaces/GODOSTROYER/Sicklesense  
- Code: https://github.com/GODOSTROYER/sicklesense

### Road Extraction On Satellite Images

Developing software for automated road extraction using CNNs on ISRO's Resourcesat images from the Boonidhi portal.

### ERP Exerciser

### Prisma

Developed an extremely efficient machine-learning application for upscaling and colorizing images, with a model size of just 260 MB and achieving 89% color accuracy in standardized tests (using CNNs and DinkNet).

## All repositories

| Repository | Status | Language | Last push | Live | Description |
|---|---|---|---|---|---|
| [task-tracker](https://github.com/GODOSTROYER/task-tracker) | featured | TypeScript | 2026-09-16 | — | Multi-user task tracker with email-OTP auth and a drag-and-drop Kanban board - Next.js, Express + TypeScript, Neon Postgres via Sequelize, deployed on Vercel |
| [GODOSTROYER](https://github.com/GODOSTROYER/GODOSTROYER) | active | Python | 2026-09-16 | — | Arnav Bule \| Projects, experiments, and public work |
| [cto.newtest](https://github.com/GODOSTROYER/cto.newtest) | active | Python | 2026-09-16 | — | Volatility breakout strategy engine with per-VA risk management, a Bybit v5 testnet client and SQLite persistence |
| [azure-databricks-ecommerce-analytics](https://github.com/GODOSTROYER/azure-databricks-ecommerce-analytics) | active | Python | 2026-09-16 | — | Medallion (Bronze/Silver/Gold) e-commerce analytics platform on Azure Databricks: Unity Catalog governance, Delta Live Tables with quality expectations and a quarantine table, Auto Loader streaming, and multi-environment delivery via Databricks Asset Bundles + GitHub Actions. |
| [email-persona-draft](https://github.com/GODOSTROYER/email-persona-draft) | earlier iteration of email-digital-twin | JavaScript | 2026-09-16 | — | Chrome extension + Node/Express server that learns your writing style from sent Gmail and drafts replies with Google Gemini and LanceDB vector search. Original December 2025 publication; same code as GODOSTROYER/email-digital-twin. |
| [Trishool](https://github.com/GODOSTROYER/Trishool) | active | TypeScript | 2026-09-16 | — | Trishool Health AI - an Expo / React Native app for non-invasive anemia, diabetes and hypertension risk screening, backed by Convex. |
| [rackvisionv1](https://github.com/GODOSTROYER/rackvisionv1) | active | TypeScript | 2026-09-16 | [rackvision.vercel.app](https://rackvision.vercel.app) | RackVision - a frontend-only infrastructure visualization module in a Pulseway-style admin dashboard: globe, site and rack drill-downs over mock data. |
| [Zenith-plugins](https://github.com/GODOSTROYER/Zenith-plugins) | plugins for zenith | JavaScript | 2026-09-16 | — | MCP connector and generated Claude Code / Codex plugins for Zenith: scoped reads plus opt-in, browser-reviewed operations. |
| [arnav-portfolio-2025](https://github.com/GODOSTROYER/arnav-portfolio-2025) | active | JavaScript | 2026-09-16 | [www.arnavbule.in](https://www.arnavbule.in) | Personal portfolio of Arnav Bule (Next.js 15 static export, Vercel) - live at www.arnavbule.in |
| [zenith](https://github.com/GODOSTROYER/zenith) | active | TypeScript | 2026-09-16 | [orrery-three-kappa.vercel.app](https://orrery-three-kappa.vercel.app) | Local-first deployment and operations platform: one typed manifest behind a system map, source view, REST API and agent, with priced plans, streaming deploys and Terraform export. |
| [calquity-intern-task](https://github.com/GODOSTROYER/calquity-intern-task) | active | HTML | 2026-09-16 | — | Hybrid Search in PGVector: Dense vs Dense+Sparse Comparison |
| [Voice-Cloner-Qwen-Arnav](https://github.com/GODOSTROYER/Voice-Cloner-Qwen-Arnav) | active | Python | 2026-09-16 | — | Parrot AI — voice cloning and speech synthesis on Qwen3-TTS-12Hz-1.7B. FastAPI backend with Whisper auto-transcription, a saved voice library, voice design, preset speakers and multi-speaker dialogue. |
| [suryaegg](https://github.com/GODOSTROYER/suryaegg) | private | TypeScript | 2026-09-16 | — | Egg stock, sales and transfer tracking for a master godown and its retail outlets. React, TypeScript and Supabase, with atomic Postgres stock operations and row-level security. |
| [small-software-cloud](https://github.com/GODOSTROYER/small-software-cloud) | private | TypeScript | 2026-09-16 | — | A governed release path for small internal tools: deterministic signed plans, deny-by-default policy, four-eyes approval, a capability broker so the deployed app never holds a credential, and a verifiable receipt for every step. Pre-alpha. |
| [task-tracker-deployment](https://github.com/GODOSTROYER/task-tracker-deployment) | deployment variant of task-tracker | TypeScript | 2026-09-16 | — | Deployment snapshot of the Mini Task Tracker (Next.js 15 + Express + MongoDB + Redis), prepared for a Vercel frontend / Railway backend split. Current code lives in GODOSTROYER/task-tracker. |
| [zillow-medallion-databricks](https://github.com/GODOSTROYER/zillow-medallion-databricks) | active | Jupyter Notebook | 2026-09-16 | — | Bronze-layer medallion pipeline on Databricks: the Zillow Economics dataset ingested into Unity Catalog four ways (COPY INTO, Auto Loader, PySpark XML, Delta Live Tables), orchestrated by one job and deployed as an Asset Bundle. |
| [vedaai-assessment](https://github.com/GODOSTROYER/vedaai-assessment) | predecessor of parakh | TypeScript | 2026-09-16 | — | VedaAI, first snapshot (Aug 2026) - AI exam assessment: question extraction, handwritten answer mapping with ink highlights, grading. Local DeepSeek-OCR-2 + GPT-5.6 Luna. Continued in vedaai-answer-mapping, now Parakh. |
| [vedaai-answer-mapping](https://github.com/GODOSTROYER/vedaai-answer-mapping) | predecessor of parakh | TypeScript | 2026-09-16 | — | VedaAI - extracts every exam question, maps a student's handwritten answers to them with exact ink-region highlights, and grades. DeepSeek-OCR-2 on a local GPU + GPT-5.6 Luna via the Codex CLI. Superseded by Parakh. |
| [HSN-Classifier-LLM](https://github.com/GODOSTROYER/HSN-Classifier-LLM) | active | Python | 2026-09-16 | — | HSN-Classifier-LLM leverages advanced AI and a Retrieval-Augmented Generation (RAG) pipeline to correctly classify products according to the Harmonized System (HS) Nomenclature and the General Rules of Interpretation (GRI). |
| [mapyourlove](https://github.com/GODOSTROYER/mapyourlove) | private | JavaScript | 2026-09-16 | — | A college dating site , lol |
| [MIT-Result-Scraper](https://github.com/GODOSTROYER/MIT-Result-Scraper) | active | Python | 2026-09-16 | — | A Simple Python based program using Selenium , Pandas that Scrapes the Results off the MIT Student's Portal. |
| [My-Portfolio-Website](https://github.com/GODOSTROYER/My-Portfolio-Website) | first portfolio (2023), superseded | JavaScript | 2026-09-16 | — | My First Portfolio Website , Arnav.Fun :) |
| [email-digital-twin](https://github.com/GODOSTROYER/email-digital-twin) | private | JavaScript | 2026-09-16 | — | AI-powered email assistant that learns your writing style and generates personalized draft replies using Google Gemini and RAG |
| [sicklesense](https://github.com/GODOSTROYER/sicklesense) | featured | Jupyter Notebook | 2026-09-16 | — | AI sickle-cell screening from blood-smear images: ResNet50 (TensorFlow) model behind a Streamlit app, deployed as a Hugging Face Space |
| [parakh](https://github.com/GODOSTROYER/parakh) | featured | JavaScript | 2026-09-16 | [www.arnavbule.in/parakh](https://www.arnavbule.in/parakh) | Parakh - serverless exam checker: upload a question paper and a handwritten answer sheet; every answer found, highlighted and graded (Next.js + Gemini). |
| [qr-tree-studio](https://github.com/GODOSTROYER/qr-tree-studio) | featured | JavaScript | 2026-09-16 | [qr-studio.arnavbule.in](https://qr-studio.arnavbule.in) | Vite + React/WebGPU experience for turning URLs and text into scannable 3D voxel QR trees |
| [sentinel-vad](https://github.com/GODOSTROYER/sentinel-vad) | featured | Python | 2026-09-16 | [huggingface.co/spaces/GODOSTROYER/sentinel](https://huggingface.co/spaces/GODOSTROYER/sentinel) | Sentinel: local video anomaly detection with a trained CLIP head, Qwen3-VL 2B LoRA, temporal evidence and measured GPU runtime |
| [cadence](https://github.com/GODOSTROYER/cadence) | featured | Python | 2026-09-16 | [www.arnavbule.in/hiver-assignment](https://www.arnavbule.in/hiver-assignment) | Cadence — an evaluated AI support agent for @SpotifyCares (intent classification, grounded reply drafting, escalation) with a golden set, LLM-as-judge harness and dashboard. Hiver SDE Intern take-home. |
| [Portfolio-1](https://github.com/GODOSTROYER/Portfolio-1) | fork | TypeScript | 2026-09-12 | [portfolio-two-murex-p8r6yjoqtw.vercel.app](https://portfolio-two-murex-p8r6yjoqtw.vercel.app) | My Portfolio Website |
| [Portfolio](https://github.com/GODOSTROYER/Portfolio) | third-party (Ayush Chougula's portfolio; relationship to be confirmed) | TypeScript | 2026-09-06 | [portfolio-two-murex-p8r6yjoqtw.vercel.app](https://portfolio-two-murex-p8r6yjoqtw.vercel.app) | My Portfolio Website |
| [TechQuest](https://github.com/GODOSTROYER/TechQuest) | fork | — | 2026-08-06 | — | — |
| [parrot-ai-frontend-qwen](https://github.com/GODOSTROYER/parrot-ai-frontend-qwen) | fork | TypeScript | 2026-01-29 | — | — |

Status key: **featured** = on the portfolio · **active** = own project · **private** = private repo · **fork** = not original work · notes mark superseded/derivative repos.

