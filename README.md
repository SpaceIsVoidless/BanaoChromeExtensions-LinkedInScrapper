# LinkedIn Scraper + Automator Chrome Extension# LinkedIn Profile Scraper 🔍



## Project Overview> A full-stack Chrome extension that automatically scrapes LinkedIn profiles and stores data in a database via Node.js backend.

A Chrome extension built to automate LinkedIn interactions, including profile scraping and feed engagement (likes and comments). The project consists of a Chrome extension frontend and a Node.js backend with SQLite database.

---

---

## 🎯 Project Overview

## 📁 File Structure & Explanations

This project consists of:

### **Chrome Extension Files**- **Chrome Extension** - Automatically opens LinkedIn profiles and scrapes data

- **Node.js Backend** - Express API with Sequelize ORM to store profile data

#### `manifest.json`- **SQLite Database** - Stores all scraped LinkedIn profile information

**Purpose:** Chrome extension configuration file  

**What it does:**## ✨ Features

- Defines extension name, version, and description

- Specifies permissions (tabs, scripting, storage, notifications, LinkedIn access)✅ Bulk LinkedIn profile scraping (paste multiple URLs)  

- Declares service worker (background.js) and popup interface✅ Automatic tab management (opens one profile at a time)  

- Sets Manifest V3 requirements✅ Extracts: Name, Bio, Location, About, Followers, Connections  

✅ RESTful API for data storage and retrieval  

#### `popup.html`✅ SQLite database with Sequelize ORM  

**Purpose:** Extension popup user interface  ✅ Desktop notifications on completion  

**What it does:**✅ Dashboard UI for viewing scraped profiles  

- Provides two main sections:

  1. **Profile Scraper** - Input field for LinkedIn profile URLs---

  2. **Feed Engagement** - Input fields for like/comment counts

- Displays status messages and progress updates## 📂 Project Structure

- Styled with modern, responsive design

```

#### `popup.css`banao-task1/

**Purpose:** Styling for the popup interface  ├── manifest.json           # Extension manifest (Manifest V3)

**What it does:**├── popup.html              # Extension popup UI

- Modern gradient design with glass morphism effect├── popup.css               # Popup styling

- Responsive button animations and hover effects├── popup.js                # Popup logic

- Status message styling (success, error, progress)├── background.js           # Background service worker

- Professional typography using system fonts├── contentScript.js        # LinkedIn page scraper

└── backend/

#### `popup.js`    ├── app.js              # Express server

**Purpose:** Popup UI logic and user interactions      ├── package.json        # Node dependencies

**What it does:**    ├── cleanup.js          # Database cleanup utility

- Handles "Start Scraping" button click    ├── dashboard.html      # Profile viewer UI

- Validates and parses LinkedIn profile URLs    ├── config/

- Handles "Start Feed Engagement" button with input validation    │   └── database.js     # Sequelize config

- Displays real-time progress updates    ├── models/

- Communicates with background.js via Chrome messaging API    │   └── Profile.js      # Profile model

    └── routes/

#### `background.js`        └── profileRoutes.js # API routes

**Purpose:** Service worker - orchestrates all extension operations  ```

**What it does:**

- **Profile Scraping:**---

  - Queues multiple profile URLs

  - Opens tabs sequentially## 🚀 Installation & Setup

  - Injects contentScript.js into LinkedIn profiles

  - Sends scraped data to backend API### 1️⃣ Backend Setup

  - Manages tab lifecycle and delays

- **Feed Engagement:**```powershell

  - Opens LinkedIn feed tabcd backend

  - Injects engagement configurationnpm install

  - Injects feedEngagement.js scriptnpm start

  - Handles completion notifications```

- **Message Routing:** Routes messages between popup, content scripts, and backend

The server will run on `http://localhost:3000`

#### `contentScript.js`

**Purpose:** LinkedIn profile scraper  ### 2️⃣ Chrome Extension Setup

**What it does:**

- Injected into LinkedIn profile pages1. Open Chrome and go to `chrome://extensions/`

- Extracts profile data:2. Enable **Developer mode** (top-right toggle)

  - Name (multiple selector fallbacks)3. Click **Load unpacked**

  - Headline/Bio4. Select the `banao-task1` folder (root directory, not the backend folder)

  - Location5. The extension should now appear in your toolbar

  - About section

  - **Follower count** (searches for "follower" text)---

  - **Connection count** (searches for "connection" text)

- Handles dynamic selectors for LinkedIn's varying layouts## 🎮 Usage

- Sends data back to background.js

### Step 1: Start the Backend

#### `feedEngagement.js````powershell

**Purpose:** LinkedIn feed automation script  cd backend

**What it does:**npm start

- **Single-pass automation** - scrolls once while processing```

- Waits for feed to fully load

- Tracks processed posts with Set() to avoid duplicates### Step 2: Log into LinkedIn

- **Likes posts:**- Open LinkedIn in Chrome and log in manually

  - Finds like button- This is required before scraping profiles

  - Checks if already liked

  - Clicks and tracks count### Step 3: Use the Extension

- **Comments on posts:**1. Click the extension icon in Chrome toolbar

  - Clicks comment button2. Paste LinkedIn profile URLs (one per line)

  - Finds visible comment box   ```

  - Types comment with proper HTML formatting   https://www.linkedin.com/in/username1

  - Finds and clicks POST button (excludes emoji/media buttons)   https://www.linkedin.com/in/username2

- **Smart stopping:**   https://www.linkedin.com/in/username3

  - Stops when both targets met   ```

  - Stops after 30 scrolls (safety)3. Click **"Start Scraping"**

  - Stops after 5 loops with no progress4. Watch as tabs open automatically, data is scraped, and sent to the backend

- Sends real-time progress updates to popup5. Each tab closes after successful scraping

6. Get notification when complete!

---

### Step 4: View Stored Data

### **Backend Files**

**Option 1: Dashboard (Recommended)**

#### `backend/server.js`Visit `http://localhost:3000/dashboard` for a beautiful UI

**Purpose:** Express.js REST API server  

**What it does:****Option 2: API**

- Creates HTTP server on port 3000```powershell

- Enables CORS for extension communicationcurl http://localhost:3000/api/profiles

- **Endpoints:**```

  - `POST /api/profiles` - Saves scraped profile data

  - `GET /api/profiles` - Retrieves all profiles---

  - `GET /api/profiles/:id` - Gets specific profile

  - `DELETE /api/profiles/:id` - Deletes profile## 🔌 API Endpoints

- Initializes database on startup

- Error handling and JSON responses| Method | Endpoint | Description |

|--------|----------|-------------|

#### `backend/models/Profile.js`| `POST` | `/api/profiles` | Create/update a profile |

**Purpose:** Sequelize ORM model for profiles  | `GET` | `/api/profiles` | Get all profiles |

**What it does:**| `GET` | `/api/profiles/:id` | Get single profile |

- Defines SQLite database schema:| `DELETE` | `/api/profiles/:id` | Delete a profile |

  ```javascript| `DELETE` | `/api/profiles/cleanup/errors` | Delete all error profiles |

  {

    name: STRING (NOT NULL),### Example POST Request Body:

    url: STRING (UNIQUE),```json

    about: TEXT,{

    bio: STRING,  "name": "John Doe",

    location: STRING,  "url": "https://www.linkedin.com/in/johndoe",

    follower_count: INTEGER (DEFAULT 0),  "bio": "Software Engineer at Tech Corp",

    connection_count: INTEGER (DEFAULT 0)  "about": "Passionate about building great products...",

  }  "location": "San Francisco, CA",

  ```  "follower_count": 1234,

- Handles database operations (Create, Read, Update, Delete)  "connection_count": 500

}

#### `backend/database.js````

**Purpose:** Database connection and initialization  

**What it does:**---

- Creates Sequelize instance with SQLite

- Defines database file path (`./linkedin_profiles.db`)## 🛠️ Tech Stack

- Exports connection for use in models and server

### Chrome Extension

#### `backend/package.json`- **Manifest V3**

**Purpose:** Node.js project configuration  - **HTML5** / **CSS3** / **JavaScript (ES6)**

**What it does:**- Chrome Extension APIs: `tabs`, `scripting`, `runtime`, `notifications`

- Lists dependencies (express, sequelize, sqlite3, cors)

- Defines start script: `node server.js`### Backend

- Project metadata- **Node.js** + **Express.js**

- **Sequelize ORM**

---- **SQLite3** database

- **CORS** enabled

## 🔄 Workflows

---

### **TASK 2: LinkedIn Profile Scraper**

## ⚠️ Important Notes

#### Overview

Scrapes multiple LinkedIn profiles and saves data to SQLite database via REST API.1. **LinkedIn Login Required**: You must be logged into LinkedIn for scraping to work

2. **Rate Limiting**: The extension waits between profiles to avoid rate limits

#### Step-by-Step Flow:3. **LinkedIn's Terms**: This is for educational purposes only. Review LinkedIn's Terms of Service before scraping

4. **Data Accuracy**: Some fields may be empty if the profile structure differs or elements are not loaded

1. **User Input (popup.html)**

   - User pastes LinkedIn profile URLs (one per line or comma-separated)---

   - Clicks "Start Scraping" button

## 🧪 Testing Checklist

2. **Validation (popup.js)**

   - Parses and validates URLs- [x] Backend starts on port 3000

   - Ensures they're LinkedIn profile URLs- [x] Extension loads without errors

   - Sends URL list to background.js- [x] Can paste LinkedIn URLs (1 or more)

- [x] Tabs open automatically

3. **Queue Management (background.js)**- [x] Content script extracts data correctly

   - Receives URL array- [x] POST requests reach backend successfully

   - Initializes queue and processing flag- [x] Database stores profiles

   - Calls `processNextUrl()`- [x] GET `/api/profiles` returns saved data

- [x] Desktop notification on completion

4. **Sequential Processing (background.js)**- [x] Dashboard displays profiles beautifully

   ```

   For each URL:---

   a. Create new tab with LinkedIn profile URL

   b. Wait 6 seconds for page load## 📹 Demo Recording Tips

   c. Inject contentScript.js into tab

   d. Wait for scraping to completeRecord a 5-minute video showing:

   ```1. ✅ Starting the backend server

2. ✅ Loading the extension in Chrome

5. **Data Extraction (contentScript.js)**3. ✅ Logging into LinkedIn

   - Waits 3 seconds for dynamic content4. ✅ Pasting profile URLs in the extension

   - Tries multiple selectors for each field:5. ✅ Watching tabs open and scrape automatically

     - **Name:** `h1.text-heading-xlarge`, etc.6. ✅ Checking backend console for POST requests

     - **Bio:** `.text-body-medium.break-words`7. ✅ Viewing dashboard at `/dashboard`

     - **Location:** `.text-body-small.inline.t-black--light`8. ✅ Showing scraped profiles with full data

     - **About:** Finds `#about` section and extracts long text

     - **Followers/Connections:** Searches all `<span>` elements for text containing "follower" or "connection", extracts numbers---

   - Builds profile object with all data

## 🎓 Project Evolution

6. **Data Transmission (contentScript.js → background.js)**

   - Sends `profileScraped` message with dataThis project evolved from a simple Tab Title Picker to a full-stack LinkedIn Profile Scraper:

   - Includes error handling for failed scrapes

**Key Upgrades:**

7. **API Storage (background.js → backend)**- Upgraded from Tab Title Picker to full LinkedIn scraper

   - Receives scraped data- Chrome extension automatically opens LinkedIn profiles and scrapes data

   - Validates data (skips errors)- Extracts: Name, Bio, Location, About, Followers, Connections

   - Sends POST request to `http://localhost:3000/api/profiles`- Node.js backend with Express + Sequelize + SQLite

   - Backend validates and stores in SQLite- RESTful API endpoints for profile storage and retrieval

- Background service worker for automated tab management

8. **Database Storage (backend/server.js → models/Profile.js)**- Content script for LinkedIn page scraping

   - Sequelize ORM creates/updates record- Dashboard UI for viewing scraped profiles

   - Handles duplicate URLs- Notifications on completion

   - Returns success/error response- Error handling and cleanup functionality



9. **Tab Cleanup & Continuation (background.js)****Interview Task Submission** - Task 2

   - Closes completed tab

   - Waits 2 seconds (rate limiting)---

   - Processes next URL in queue

   - Shows completion notification when done<div align="center">

  <sub>Built for interview task submission</sub>

10. **User Feedback (popup.js)**</div>

    - Displays real-time progress: "Opening: username (3 remaining)"
    - Shows success: "✓ Saved: John Doe"
    - Shows errors if they occur
    - Final message: "All profiles scraped successfully!"

---

### **TASK 3: LinkedIn Feed Engagement Automation**

#### Overview
Automates liking and commenting on LinkedIn feed posts with exact count matching using a fast single-pass algorithm.

#### Step-by-Step Flow:

1. **User Input (popup.html)**
   - User enters like count (e.g., 5)
   - User enters comment count (e.g., 5)
   - Clicks "Start Feed Engagement" button

2. **Validation (popup.js)**
   - Validates inputs are positive numbers
   - Ensures at least one action is requested
   - Sends configuration to background.js

3. **Tab Creation (background.js)**
   - Opens `https://www.linkedin.com/feed/` in new active tab
   - Waits 5 seconds for page load

4. **Configuration Injection (background.js)**
   ```javascript
   // Injects config object into page context
   window.engagementConfig = {
     likeCount: 5,
     commentCount: 5
   }
   ```

5. **Script Injection (background.js)**
   - Injects `feedEngagement.js` into feed tab
   - Script reads config from `window.engagementConfig`

6. **Feed Loading Wait (feedEngagement.js)**
   - Waits up to 20 seconds for feed to load
   - Checks for `.feed-shared-update-v2` posts
   - Requires at least 2 posts to proceed

7. **Single-Pass Automation Loop** (feedEngagement.js)
   ```
   Initialize:
   - processedPosts = Set() (tracks completed posts)
   - likesCompleted = 0
   - commentsCompleted = 0
   - scrollAttempts = 0
   - noProgressCounter = 0
   
   While (targets not met AND scrollAttempts < 30):
     a. Get all visible posts on page
     b. For each post:
        - Skip if already processed
        - Add to processedPosts Set
        - Scroll post into view
        
        IF likesCompleted < TARGET_LIKES:
          - Find like button (aria-label*=React or Like)
          - Check if already liked (aria-pressed=true)
          - Click like button
          - Increment likesCompleted (with double-check)
          - Send progress update to popup
          - Wait 1-2 seconds (human-like delay)
        
        IF commentsCompleted < TARGET_COMMENTS:
          - Find and click comment button
          - Wait 3 seconds for comment box
          - Find visible comment box (.ql-editor)
          - Focus and clear box
          - Set innerHTML: "<p>Great insights! Thanks for sharing.</p>"
          - Dispatch input/change/keyboard events
          - Wait 2.5 seconds for submit button to enable
          - Find POST button (try 4 selectors, exclude emoji buttons)
          - Click POST button
          - Increment commentsCompleted (with double-check)
          - Send progress update to popup
          - Wait 1.5-3 seconds
        
        IF both targets met: BREAK
     
     c. Check progress:
        - If no progress for 5 consecutive loops: STOP
        - Otherwise: continue
     
     d. Scroll down 700px to load more posts
     e. Wait 2.5 seconds for new posts to load
     f. Increment scrollAttempts
   
   End While
   ```

8. **Safety Mechanisms**
   - **Set() tracking:** Prevents processing same post twice
   - **Double-check before increment:** Prevents counter overflow
   - **No progress counter:** Stops if stuck (5 loops)
   - **Max scrolls:** Hard limit of 30 scrolls
   - **Multiple break conditions:** Checks targets at 3 different points

9. **Comment Box Detection** (feedEngagement.js)
   - **Method 1:** Look within post element
   - **Method 2:** Find any visible box on page (height > 0)
   - Uses `offsetParent !== null` to check visibility

10. **POST Button Detection** (feedEngagement.js)
    - Tries 4 CSS selectors in order
    - Fallback: Searches all buttons for:
      - Text exactly "post" OR aria-label contains "post comment"
      - **Excludes:** emoji, media, gif buttons (by aria-label)
      - Ensures button is enabled (!disabled)

11. **Completion** (feedEngagement.js → background.js → popup.js)
    - Sends `engagementComplete` message with final counts
    - background.js shows system notification
    - popup.js displays final message: "✅ Completed: 5 likes, 5 comments"

12. **Error Handling**
    - Failed likes: Moves to next post (doesn't increment counter)
    - Failed comments: Moves to next post
    - Stuck/infinite loop: Stops after 5 loops with no progress
    - No posts found: Stops and reports 0/0

---

## 🛠️ Technical Details

### **Chrome APIs Used**
- `chrome.tabs` - Tab creation and management
- `chrome.scripting` - Content script injection
- `chrome.runtime` - Message passing between components
- `chrome.storage` - Extension data storage
- `chrome.notifications` - System notifications

### **Key Algorithms**

#### Profile Scraping
- **Fallback selector pattern:** Tries multiple selectors until one succeeds
- **Text extraction with validation:** Filters out unwanted text (like "Contact info")
- **Number extraction:** Regex to find and parse follower/connection counts

#### Feed Automation
- **Single-pass processing:** Scrolls down once while processing posts
- **Set-based deduplication:** O(1) lookup to prevent re-processing
- **Progressive scrolling:** Loads posts dynamically as needed
- **Event-driven typing:** Multiple events trigger LinkedIn's validation

### **Performance Optimizations**
- Asynchronous operations with `async/await`
- Smart delays (not too fast to trigger rate limits)
- Tab reuse and cleanup
- Minimal DOM queries with selector caching

---

## 🚀 Setup & Usage

### Prerequisites
```bash
Node.js v14+ installed
Chrome browser
```

### Backend Setup
```bash
cd backend
npm install
npm start
# Server runs on http://localhost:3000
```

### Extension Setup
1. Open Chrome → `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the project folder
5. Extension appears in toolbar

### Usage

#### Profile Scraping
1. Click extension icon
2. Paste LinkedIn profile URLs
3. Click "Start Scraping"
4. Watch progress in popup
5. Check database: `backend/linkedin_profiles.db`

#### Feed Engagement
1. Click extension icon
2. Enter like count (e.g., 5)
3. Enter comment count (e.g., 5)
4. Click "Start Feed Engagement"
5. LinkedIn feed opens automatically
6. Watch automation in action
7. Press F12 → Console for detailed logs

---

## 📊 Database Schema

```sql
CREATE TABLE Profiles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(255) NOT NULL,
  url VARCHAR(255) UNIQUE,
  about TEXT,
  bio VARCHAR(255),
  location VARCHAR(255),
  follower_count INTEGER DEFAULT 0,
  connection_count INTEGER DEFAULT 0,
  createdAt DATETIME,
  updatedAt DATETIME
);
```

---

## 🐛 Troubleshooting

### Scraper Issues
- **Follower/Connection count shows 0:** LinkedIn may have changed selectors, or user's profile privacy settings hide these
- **"Scraping Error" message:** Profile page took too long to load or selectors don't match

### Automation Issues
- **Comments not posting:** Check console (F12) for detailed logs
- **Stopping early:** Check `noProgressCounter` - may need more scrollable content
- **Wrong counts:** Verify console shows exact increment messages

### Backend Issues
- **Connection refused:** Ensure backend is running (`npm start` in backend folder)
- **CORS errors:** Backend must be on `localhost:3000`

---

## 📝 Notes

- **Rate Limiting:** Delays are built-in to avoid LinkedIn rate limits
- **Accuracy:** Follower/connection counts depend on LinkedIn's HTML structure
- **Privacy:** All data stored locally in SQLite database
- **LinkedIn Changes:** Selectors may need updates if LinkedIn changes their HTML

---

## 🎯 Future Enhancements

- Dashboard to view scraped profiles
- Export data to CSV/JSON
- Custom comment templates
- Schedule automation at specific times
- Analytics on engagement success rates

---

**Created by:** Banao Task Assignment  
**Version:** 1.0.0  
**Last Updated:** 2025
