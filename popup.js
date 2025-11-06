document.addEventListener('DOMContentLoaded', () => {
  const startButton = document.getElementById('startScraping');
  const urlInput = document.getElementById('urlInput');
  const statusDiv = document.getElementById('status');

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
    }
  });

  function showStatus(message, type) {
    statusDiv.textContent = message;
    statusDiv.className = `show ${type}`;
  }
});
