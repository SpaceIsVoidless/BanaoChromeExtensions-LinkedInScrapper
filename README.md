# LinkedIn Profile Scraper 🔍# Tab Title Picker 🏷️



> A full-stack Chrome extension that automatically scrapes LinkedIn profiles and stores data in a database via Node.js backend.> A minimal Chrome extension that displays the current tab's title with a single click.



------



## 🎯 Project Overview## ✨ Features



This project consists of:✅ Clean, minimal interface  

- **Chrome Extension** - Automatically opens LinkedIn profiles and scrapes data✅ One-click tab title display  

- **Node.js Backend** - Express API with Sequelize ORM to store profile data✅ Built with Manifest V3  

- **SQLite Database** - Stores all scraped LinkedIn profile information✅ No external dependencies  



## ✨ Features## 🚀 Installation



✅ Bulk LinkedIn profile scraping (paste multiple URLs)  1. Open Chrome and navigate to `chrome://extensions/`

✅ Automatic tab management (opens one profile at a time)  2. Enable **Developer mode** (top-right toggle)

✅ Extracts: Name, Bio, Location, About, Followers, Connections  3. Click **Load unpacked** and select this folder

✅ RESTful API for data storage and retrieval  4. Click the extension icon and press the button to see the current tab's title

✅ SQLite database with Sequelize ORM  

## 📂 Project Structure

---

```

## 📂 Project Structure├── manifest.json    # Extension configuration

├── popup.html       # Popup interface

```├── popup.css        # Minimal styling

banao-task1/└── popup.js         # Tab title retrieval logic

├── manifest.json           # Extension manifest (Manifest V3)```

├── popup.html              # Extension popup UI

├── popup.css               # Popup styling## 🛠️ Tech Stack

├── popup.js                # Popup logic

├── background.js           # Background service worker- **HTML5** • **CSS3** • **JavaScript (ES6)**

├── contentScript.js        # LinkedIn page scraper- **Chrome Extension API** (Manifest V3)

└── backend/

    ├── app.js              # Express server---

    ├── package.json        # Node dependencies

    ├── config/<div align="center">

    │   └── database.js     # Sequelize config  <sub>Built as part of Interview task submission</sub>

    ├── models/</div>

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
2. Paste at least **3 LinkedIn profile URLs** (one per line)
   ```
   https://www.linkedin.com/in/username1
   https://www.linkedin.com/in/username2
   https://www.linkedin.com/in/username3
   ```
3. Click **"Start Scraping"**
4. Watch as tabs open automatically, data is scraped, and sent to the backend
5. Each tab closes after successful scraping

### Step 4: View Stored Data
```powershell
# Get all profiles
curl http://localhost:3000/api/profiles
```

Or visit `http://localhost:3000/api/profiles` in your browser

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/profiles` | Create/update a profile |
| `GET` | `/api/profiles` | Get all profiles |
| `GET` | `/api/profiles/:id` | Get single profile |
| `DELETE` | `/api/profiles/:id` | Delete a profile |

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
- Chrome Extension APIs: `tabs`, `scripting`, `runtime`

### Backend
- **Node.js** + **Express.js**
- **Sequelize ORM**
- **SQLite3** database
- **CORS** enabled

---

## ⚠️ Important Notes

1. **LinkedIn Login Required**: You must be logged into LinkedIn for scraping to work
2. **Rate Limiting**: The extension waits 2 seconds between profiles to avoid rate limits
3. **LinkedIn's Terms**: This is for educational purposes only. Review LinkedIn's Terms of Service before scraping
4. **Data Accuracy**: Some fields may be empty if the profile structure differs or elements are not loaded

---

## 🧪 Testing Checklist

- [ ] Backend starts on port 3000
- [ ] Extension loads without errors
- [ ] Can paste 3+ LinkedIn URLs
- [ ] Tabs open automatically
- [ ] Content script extracts data correctly
- [ ] POST requests reach backend successfully
- [ ] Database stores profiles
- [ ] GET `/api/profiles` returns saved data

---

## 📹 Demo Recording Tips

Record a 5-minute video showing:
1. ✅ Starting the backend server
2. ✅ Loading the extension in Chrome
3. ✅ Logging into LinkedIn
4. ✅ Pasting profile URLs in the extension
5. ✅ Watching tabs open and scrape automatically
6. ✅ Checking backend console for POST requests
7. ✅ Viewing database results via `/api/profiles`

---

<div align="center">
  <sub>Built for interview task submission</sub>
</div>
