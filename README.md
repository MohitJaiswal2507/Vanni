## Getting Started
### Terminal 1 : Running the development server:
```cmd 
npm run dev
```

### Terminal 2
```cmd 
npm run dev:webhook
```

### Terminal 3
```cmd
npx inngest-cli@1.6.2 dev
```
Inngest dev server => http://localhost:8288/

### Terminal 4
```cmd
cd agent-worker
uv run uvicorn main:app --port 8787
```

## Database Commands

### Push Schema Changes

```cmd
npm run db:push
```

Pushes the latest Drizzle schema to the database.

---

### Open Drizzle Studio

```cmd
npm run db:studio
```

## Stream Dashboard

To monitor meetings, recordings, transcripts, and other Stream resources, visit:

https://dashboard.getstream.io/app/

---
## Polar Payment Dashboard

To monitor Payments for subscriptitons:


[https://dashboard.getstream.io/app/](https://sandbox.polar.sh/dashboard/)

---

## Run the Application

Once all services are running, open:

```
http://localhost:3000
```
