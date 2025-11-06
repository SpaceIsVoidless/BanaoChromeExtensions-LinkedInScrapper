console.log('Content script loaded on:', window.location.href);

function extractText(selector) {
  const element = document.querySelector(selector);
  return element ? element.textContent.trim() : '';
}

function extractNumber(text) {
  if (!text) return 0;
  const match = text.match(/[\d,]+/);
  return match ? parseInt(match[0].replace(/,/g, '')) : 0;
}

async function scrapeProfile() {
  try {
    console.log('Starting to scrape profile...');
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    let name = '';
    const nameSelectors = [
      'h1.text-heading-xlarge',
      'h1.inline.t-24.v-align-middle.break-words',
      '.pv-text-details__left-panel h1',
      'h1'
    ];
    
    for (const selector of nameSelectors) {
      name = extractText(selector);
      if (name && name.length > 2) {
        console.log('Name found with selector:', selector, '=', name);
        break;
      }
    }
    
    let headline = '';
    const headlineSelectors = [
      '.text-body-medium.break-words',
      '.pv-text-details__left-panel .text-body-medium',
      'div.text-body-medium'
    ];
    
    for (const selector of headlineSelectors) {
      headline = extractText(selector);
      if (headline && headline !== name && headline.length > 5) {
        console.log('Headline found with selector:', selector, '=', headline);
        break;
      }
    }

    let location = '';
    const locationSelectors = [
      '.text-body-small.inline.t-black--light.break-words',
      'span.text-body-small.inline.t-black--light.break-words'
    ];
    
    for (const selector of locationSelectors) {
      const text = extractText(selector);
      if (text && !text.toLowerCase().includes('contact') && !text.toLowerCase().includes('connection') && text.length > 2) {
        location = text;
        console.log('Location found with selector:', selector, '=', location);
        break;
      }
    }

    let about = '';
    try {
      const aboutSection = document.querySelector('#about');
      if (aboutSection) {
        const parentSection = aboutSection.closest('section');
        if (parentSection) {
          const aboutElements = parentSection.querySelectorAll('span');
          for (const elem of aboutElements) {
            const text = elem.textContent.trim();
            if (text.length > 50 && !text.includes('About') && !text.includes('Show all')) {
              about = text;
              console.log('About found, length:', about.length);
              break;
            }
          }
        }
      }
    } catch (e) {
      console.log('Error finding about section:', e);
    }

    let followerCount = 0;
    let connectionCount = 0;
    
    const allSpans = document.querySelectorAll('span.t-black--light, span.t-bold');
    
    for (const span of allSpans) {
      const text = span.textContent.trim();
      if (text.toLowerCase().includes('follower')) {
        followerCount = extractNumber(text);
        console.log('Followers found:', followerCount, 'from text:', text);
      }
      if (text.toLowerCase().includes('connection')) {
        connectionCount = extractNumber(text);
        console.log('Connections found:', connectionCount, 'from text:', text);
      }
    }

    const profileData = {
      name: name || 'Unknown User',
      url: window.location.href.split('?')[0],
      about: about || '',
      bio: headline || '',
      location: location || '',
      follower_count: followerCount,
      connection_count: connectionCount
    };

    console.log('Final scraped profile data:', profileData);

    chrome.runtime.sendMessage({
      action: 'profileScraped',
      data: profileData
    });

  } catch (error) {
    console.error('Error scraping profile:', error);
    chrome.runtime.sendMessage({
      action: 'profileScraped',
      data: {
        name: 'Scraping Error',
        url: window.location.href.split('?')[0],
        about: '',
        bio: error.message,
        location: '',
        follower_count: 0,
        connection_count: 0
      }
    });
  }
}

console.log('Will start scraping in 2 seconds...');
setTimeout(scrapeProfile, 2000);
