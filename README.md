# LinkedIn Automator

Chrome extension for LinkedIn automation with backend storage.

## Setup

**Backend:**
```bash
cd backend
npm install
npm start
```

**Extension:**
1. Open `chrome://extensions/`
2. Enable Developer mode
3. Load unpacked → Select project folder

## Features

- Profile scraping with data extraction
- Feed engagement (likes & comments)
- RESTful API with SQLite storage

## Usage

Open extension popup and choose:
- **Scraper**: Paste URLs, click start
- **Automation**: Set counts, click engage

## Tech

Manifest V3 | Node.js | Express | Sequelize | SQLite
