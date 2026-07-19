## Getting Started

First, run the development server:

```cmd 
Terminal 1
-----------------------
npm run dev

Terminal 2
-----------------------
npm run dev:webhook

Terminal 3
-----------------------
npx inngest-cli@1.6.2 dev

Terminal 4
-----------------------
cd agent-worker
uv run uvicorn main:app --port 8787
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
