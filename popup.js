document.addEventListener('DOMContentLoaded', () => {
  const startButton = document.getElementById('startScraping');
  const urlInput = document.getElementById('urlInput');
  const statusDiv = document.getElementById('status');

  const likeCountInput = document.getElementById('likeCount');
  const commentCountInput = document.getElementById('commentCount');
  const startEngagementButton = document.getElementById('startEngagement');
  const engagementStatusDiv = document.getElementById('engagementStatus');

  startButton.addEventListener('click', () => {
    const urls = urlInput.value
      .split('\n')
      .map(url => url.trim())
      .filter(url => url && url.includes('linkedin.com/in/'));

    if (urls.length === 0) {
      showStatus('Please enter at least one valid LinkedIn profile URL', 'error');
      return;
    }

    startButton.disabled = true;
    showStatus(`Starting scraping for ${urls.length} profiles...`, 'processing');

    chrome.runtime.sendMessage(
      { action: 'startScraping', urls: urls },
      (response) => {
        if (response && response.success) {
          showStatus('Scraping started! Check tabs opening automatically.', 'success');
        } else {
          showStatus('Failed to start scraping', 'error');
          startButton.disabled = false;
        }
      }
    );
  });

  function validateEngagementInputs() {
    const likeCount = parseInt(likeCountInput.value);
    const commentCount = parseInt(commentCountInput.value);
    
    const isValid = 
      !isNaN(likeCount) && likeCount >= 0 && likeCount <= 50 &&
      !isNaN(commentCount) && commentCount >= 0 && commentCount <= 20;
    
    startEngagementButton.disabled = !isValid;
  }

  likeCountInput.addEventListener('input', validateEngagementInputs);
  commentCountInput.addEventListener('input', validateEngagementInputs);

  startEngagementButton.addEventListener('click', () => {
    const likeCount = parseInt(likeCountInput.value);
    const commentCount = parseInt(commentCountInput.value);

    if (isNaN(likeCount) || isNaN(commentCount)) {
      showEngagementStatus('Please enter valid numbers', 'error');
      return;
    }

    startEngagementButton.disabled = true;
    showEngagementStatus(`Starting engagement: ${likeCount} likes, ${commentCount} comments...`, 'processing');

    chrome.runtime.sendMessage(
      { 
        action: 'startEngagement', 
        likeCount: likeCount,
        commentCount: commentCount
      },
      (response) => {
        if (response && response.success) {
          showEngagementStatus('Engagement started! Opening LinkedIn feed...', 'success');
        } else {
          showEngagementStatus('Failed to start engagement', 'error');
          startEngagementButton.disabled = false;
        }
      }
    );
  });

  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === 'scrapingProgress') {
      showStatus(message.message, 'processing');
    } else if (message.action === 'scrapingComplete') {
      showStatus('✅ All profiles scraped successfully!', 'success');
      startButton.disabled = false;
      
      setTimeout(() => {
        if (confirm('Scraping complete! Would you like to view the scraped profiles?')) {
          window.open('http://localhost:3000/api/profiles', '_blank');
        }
      }, 500);
    } else if (message.action === 'scrapingError') {
      showStatus(`❌ Error: ${message.error}`, 'error');
      startButton.disabled = false;
    } else if (message.action === 'engagementProgress') {
      showEngagementStatus(message.message, 'processing');
    } else if (message.action === 'engagementComplete') {
      showEngagementStatus(message.message, 'success');
      startEngagementButton.disabled = false;
    } else if (message.action === 'engagementError') {
      showEngagementStatus(`❌ Error: ${message.message}`, 'error');
      startEngagementButton.disabled = false;
    }
  });

  function showStatus(message, type) {
    statusDiv.textContent = message;
    statusDiv.className = `show ${type}`;
  }

  function showEngagementStatus(message, type) {
    engagementStatusDiv.textContent = message;
    engagementStatusDiv.className = `show ${type}`;
  }
});
