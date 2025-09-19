
---

#  RAG Chatbot — Frontend

```markdown
# RAG Chatbot — Frontend

React + TypeScript frontend for the RAG chatbot.  
Communicates with backend via REST API (Axios).

---

## Features

- Chat interface with user + assistant messages
- Session management with backend
- Styled input + send button
- Loader while waiting for reply
- Friendly fallback for unmatched queries

---

## Project Structure
rag-chatbot-frontend/
├── src/
│ ├── components/Chat/ # ChatInterface, MessageList, Message, MessageInput
│ ├── hooks/ # useChat.ts
│ ├── services/ # api.ts
│ └── index.tsx
├── public/
├── package.json
├── .env
└── README.md


---

## ⚙️ Setup

### 1. Clone and Install
```bash
git clone https://github.com/pandeyshikha123/rag-chatbot-frontend.git
cd rag-chatbot-frontend
npm install

2. Environment Variables

Create .env in the root:

REACT_APP_API_BASE=http://localhost:4000


For production (Vercel), set in dashboard:

REACT_APP_API_BASE=https://your-backend.onrender.com

3. Run Development Server
npm start


App opens at:
http://localhost:3000

4. Build for Production
npm run build

🖥 Usage

Open frontend in browser.

On page load, a new session is created with backend.

Type your query in the input box → press Send.

Assistant shows search-based response with documents.

☁️ Deployment
Vercel

Import repo in Vercel.

Set env variable:

REACT_APP_API_BASE=https://rag-chatbot-backend-t4ly.onrender.com


Deploy.

Frontend live at:
https://rag-chatbot-frontend-mauve.vercel.app/

🛠 Troubleshooting

Requests going to REACT_APP_API_BASE= https://rag-chatbot-backend-t4ly.onrender.com in URL
→ You mistakenly included env var in string. Must use process.env.REACT_APP_API_BASE.

CORS error
→ Set FRONTEND_ORIGIN in backend .env to your frontend URL.

Assistant replies empty
→ Ensure backend ingestion script (ingestNews.js) ran before queries.



