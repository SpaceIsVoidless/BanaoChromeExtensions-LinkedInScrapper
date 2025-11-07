# LinkedIn Scraper + Automator

Chrome extension for LinkedIn profile scraping and feed automation with Node.js backend.

## Features

- **Profile Scraper**: Extract name, bio, location, about, followers, connections from LinkedIn profiles
- **Feed Automation**: Automatically like and comment on LinkedIn feed posts
- **Backend API**: Store scraped profiles in SQLite database
- **Anti-Detection**: Smart scraping techniques to avoid LinkedIn bot detection

## Quick Start

### Backend Setup
```powershell
cd backend
npm install
npm start
```
Server runs on `http://localhost:3000`

### Extension Setup
1. Open `chrome://extensions/`
2. Enable Developer mode
3. Click "Load unpacked"
4. Select the `banao-task1` folder

## Usage

### Profile Scraping
1. Start backend server
2. Log into LinkedIn in Chrome
3. Click extension icon
4. Paste profile URLs (one per line)
5. Click "Start Scraping"

### Feed Automation
1. Log into LinkedIn
2. Click extension icon
3. Enter like count (0-50) and comment count (0-20)
4. Click "Start Engagement"

## API Endpoints

- `POST /api/profiles` - Create/update profile
- `GET /api/profiles` - Get all profiles
- `DELETE /api/profiles/:id` - Delete profile
- `DELETE /api/profiles/cleanup/errors` - Remove error profiles
- `DELETE /api/profiles/all` - Delete all profiles

## Tech Stack

**Extension**: Manifest V3, JavaScript ES6  
**Backend**: Node.js, Express, Sequelize, SQLite3  
**Features**: Chrome APIs (tabs, scripting, notifications)

## Notes

- Must be logged into LinkedIn
- For educational purposes only
- Respects LinkedIn's rate limits with delays
