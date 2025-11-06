# LinkedIn Profile Scraper 🔍

> A full-stack Chrome extension that automatically scrapes LinkedIn profiles and stores data in a database via Node.js backend.

---

## 🎯 Project Overview

This project consists of:
- **Chrome Extension** - Automatically opens LinkedIn profiles and scrapes data
- **Node.js Backend** - Express API with Sequelize ORM to store profile data
- **SQLite Database** - Stores all scraped LinkedIn profile information

## ✨ Features

✅ Bulk LinkedIn profile scraping (paste multiple URLs)  
✅ Automatic tab management (opens one profile at a time)  
✅ Extracts: Name, Bio, Location, About, Followers, Connections  
✅ RESTful API for data storage and retrieval  
✅ SQLite database with Sequelize ORM  
✅ Desktop notifications on completion  
✅ Dashboard UI for viewing scraped profiles  

---

## 📂 Project Structure

```
banao-task1/
├── manifest.json           # Extension manifest (Manifest V3)
├── popup.html              # Extension popup UI
├── popup.css               # Popup styling
├── popup.js                # Popup logic
├── background.js           # Background service worker
├── contentScript.js        # LinkedIn page scraper
└── backend/
    ├── app.js              # Express server
    ├── package.json        # Node dependencies
    ├── cleanup.js          # Database cleanup utility
    ├── dashboard.html      # Profile viewer UI
    ├── config/
    │   └── database.js     # Sequelize config
    ├── models/
    │   └── Profile.js      # Profile model
    └── routes/
        └── profileRoutes.js # API routes
```

---

## 🚀 Installation & Setup

### 1️⃣ Backend Setup

```powershell
cd backend
npm install
npm start
```

The server will run on `http://localhost:3000`

### 2️⃣ Chrome Extension Setup

1. Open Chrome and go to `chrome://extensions/`
2. Enable **Developer mode** (top-right toggle)
3. Click **Load unpacked**
4. Select the `banao-task1` folder (root directory, not the backend folder)
5. The extension should now appear in your toolbar

---

## 🎮 Usage

### Step 1: Start the Backend
```powershell
cd backend
npm start
```

### Step 2: Log into LinkedIn
- Open LinkedIn in Chrome and log in manually
- This is required before scraping profiles

### Step 3: Use the Extension
1. Click the extension icon in Chrome toolbar
2. Paste LinkedIn profile URLs (one per line)
   ```
   https://www.linkedin.com/in/username1
   https://www.linkedin.com/in/username2
   https://www.linkedin.com/in/username3
   ```
3. Click **"Start Scraping"**
4. Watch as tabs open automatically, data is scraped, and sent to the backend
5. Each tab closes after successful scraping
6. Get notification when complete!

### Step 4: View Stored Data

**Option 1: Dashboard (Recommended)**
Visit `http://localhost:3000/dashboard` for a beautiful UI

**Option 2: API**
```powershell
curl http://localhost:3000/api/profiles
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/profiles` | Create/update a profile |
| `GET` | `/api/profiles` | Get all profiles |
| `GET` | `/api/profiles/:id` | Get single profile |
| `DELETE` | `/api/profiles/:id` | Delete a profile |
| `DELETE` | `/api/profiles/cleanup/errors` | Delete all error profiles |

### Example POST Request Body:
```json
{
  "name": "John Doe",
  "url": "https://www.linkedin.com/in/johndoe",
  "bio": "Software Engineer at Tech Corp",
  "about": "Passionate about building great products...",
  "location": "San Francisco, CA",
  "follower_count": 1234,
  "connection_count": 500
}
```

---

## 🛠️ Tech Stack

### Chrome Extension
- **Manifest V3**
- **HTML5** / **CSS3** / **JavaScript (ES6)**
- Chrome Extension APIs: `tabs`, `scripting`, `runtime`, `notifications`

### Backend
- **Node.js** + **Express.js**
- **Sequelize ORM**
- **SQLite3** database
- **CORS** enabled

---

## ⚠️ Important Notes

1. **LinkedIn Login Required**: You must be logged into LinkedIn for scraping to work
2. **Rate Limiting**: The extension waits between profiles to avoid rate limits
3. **LinkedIn's Terms**: This is for educational purposes only. Review LinkedIn's Terms of Service before scraping
4. **Data Accuracy**: Some fields may be empty if the profile structure differs or elements are not loaded

---

## 🧪 Testing Checklist

- [x] Backend starts on port 3000
- [x] Extension loads without errors
- [x] Can paste LinkedIn URLs (1 or more)
- [x] Tabs open automatically
- [x] Content script extracts data correctly
- [x] POST requests reach backend successfully
- [x] Database stores profiles
- [x] GET `/api/profiles` returns saved data
- [x] Desktop notification on completion
- [x] Dashboard displays profiles beautifully

---

## 📹 Demo Recording Tips

Record a 5-minute video showing:
1. ✅ Starting the backend server
2. ✅ Loading the extension in Chrome
3. ✅ Logging into LinkedIn
4. ✅ Pasting profile URLs in the extension
5. ✅ Watching tabs open and scrape automatically
6. ✅ Checking backend console for POST requests
7. ✅ Viewing dashboard at `/dashboard`
8. ✅ Showing scraped profiles with full data

---

## 🎓 Project Evolution

This project evolved from a simple Tab Title Picker to a full-stack LinkedIn Profile Scraper:

**Key Upgrades:**
- Upgraded from Tab Title Picker to full LinkedIn scraper
- Chrome extension automatically opens LinkedIn profiles and scrapes data
- Extracts: Name, Bio, Location, About, Followers, Connections
- Node.js backend with Express + Sequelize + SQLite
- RESTful API endpoints for profile storage and retrieval
- Background service worker for automated tab management
- Content script for LinkedIn page scraping
- Dashboard UI for viewing scraped profiles
- Notifications on completion
- Error handling and cleanup functionality

**Interview Task Submission** - Task 2

---

<div align="center">
  <sub>Built for interview task submission</sub>
</div>
