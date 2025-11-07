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

function waitForElement(selector, timeout = 10000) {
  return new Promise((resolve) => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }
    
    const observer = new MutationObserver(() => {
      if (document.querySelector(selector)) {
        observer.disconnect();
        resolve(document.querySelector(selector));
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    setTimeout(() => {
      observer.disconnect();
      resolve(null);
    }, timeout);
  });
}

async function scrapeProfile() {
  try {
    console.log('========================================');
    console.log('🚀 STARTING PROFILE SCRAPE');
    console.log('========================================');
    console.log('Current URL:', window.location.href);
    console.log('Page title:', document.title);
    console.log('Document ready state:', document.readyState);
    
    console.log('⏳ Waiting for main profile section to load...');
    const mainElement = await waitForElement('.pv-text-details__left-panel, .ph5, main', 8000);
    console.log('Main element found:', !!mainElement);
    
    if (!mainElement) {
      console.warn('⚠️ Main element not found, continuing anyway...');
    }
    
    console.log('📜 Scrolling to load all content...');
    try {
      window.scrollTo({ top: 800, behavior: 'smooth' });
      await new Promise(resolve => setTimeout(resolve, 2000));
      window.scrollTo({ top: 1600, behavior: 'smooth' });
      await new Promise(resolve => setTimeout(resolve, 2000));
      window.scrollTo({ top: 0, behavior: 'smooth' });
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('✅ Scrolling complete');
    } catch (scrollErr) {
      console.error('⚠️ Scroll error:', scrollErr);
    }
    
    let name = '';
    
    const pageTitle = document.title;
    console.log('Page title:', pageTitle);
    if (pageTitle && pageTitle !== 'LinkedIn') {
      const titleMatch = pageTitle.match(/^([^|\-]+)/);
      if (titleMatch) {
        const extractedName = titleMatch[1].trim();
        if (extractedName.length > 2 && extractedName !== 'LinkedIn') {
          name = extractedName;
          console.log('✅ Name extracted from page title:', name);
        }
      }
    }
    
    if (!name) {
      console.log('Trying DOM selectors for name...');
      const nameSelectors = [
        'h1.text-heading-xlarge',
        '.pv-text-details__left-panel h1',
        'h1.inline.t-24.v-align-middle.break-words',
        '.ph5 h1',
        'main h1',
        'h1'
      ];
      
      for (const selector of nameSelectors) {
        const elem = document.querySelector(selector);
        if (elem) {
          const text = elem.textContent.trim();
          console.log(`Checking selector "${selector}": "${text}"`);
          if (text && text.length > 2 && !text.includes('LinkedIn') && !text.includes('Profile')) {
            name = text;
            console.log('✅ Name found with selector:', selector, '=', name);
            break;
          }
        }
      }
    }
    
    let headline = '';
    console.log('Looking for headline/bio...');
    
    const topCardArea = document.querySelector('.pv-text-details__left-panel, .ph5');
    if (topCardArea) {
      const h2Elements = topCardArea.querySelectorAll('h2, .text-body-medium');
      for (const elem of h2Elements) {
        const text = elem.textContent.trim();
        if (text && text !== name && text.length > 5 && text.length < 500 &&
            !text.includes('Contact') && !text.includes('followers') && !text.includes('connections')) {
          headline = text;
          console.log('✅ Headline found in top card:', headline.substring(0, 80));
          break;
        }
      }
    }
    
    if (!headline) {
      const headlineSelectors = [
        '.text-body-medium.break-words',
        '.pv-text-details__left-panel .text-body-medium',
        'div.text-body-medium',
        '.pv-top-card--list-bullet span',
        '.mt1.t-18.t-black.t-normal.break-words',
        'div[class*="text-body-medium"]',
        '.pv-top-card div.text-body-medium'
      ];
      
      for (const selector of headlineSelectors) {
        const elems = document.querySelectorAll(selector);
        for (const elem of elems) {
          const text = elem.textContent.trim();
          console.log(`Checking headline selector "${selector}": "${text.substring(0, 80)}..."`);
          if (text && text !== name && text.length > 5 && text.length < 500 &&
              !text.includes('followers') && !text.includes('connections')) {
            headline = text;
            console.log('✅ Headline found');
            break;
          }
        }
        if (headline && headline.length > 5) break;
      }
    }
    
    console.log('Final headline:', headline || 'NONE FOUND');

    let location = '';
    console.log('Looking for location...');
    const locationSelectors = [
      '.text-body-small.inline.t-black--light.break-words',
      'span.text-body-small.inline.t-black--light.break-words',
      '.pv-text-details__left-panel span.text-body-small',
      '.pv-top-card--list li',
      'span[class*="text-body-small"]'
    ];
    
    for (const selector of locationSelectors) {
      const elements = document.querySelectorAll(selector);
      for (const elem of elements) {
        const text = elem.textContent.trim();
        console.log(`Checking location text: "${text}"`);
        if (text && !text.toLowerCase().includes('contact') && 
            !text.toLowerCase().includes('connection') && 
            !text.toLowerCase().includes('follower') &&
            !text.toLowerCase().includes('profile language') &&
            !text.toLowerCase().includes('view') &&
            text.length > 2 && text.length < 100 &&
            (text.includes(',') || text.match(/[A-Z][a-z]+\s[A-Z][a-z]+/))) {
          location = text;
          console.log('✅ Location found:', location);
          break;
        }
      }
      if (location) break;
    }

    let about = '';
    console.log('Looking for about section...');
    try {
      const aboutSection = document.querySelector('#about');
      if (aboutSection) {
        const parentSection = aboutSection.closest('section');
        if (parentSection) {
          let aboutElements = parentSection.querySelectorAll('span.visually-hidden');
          if (aboutElements.length === 0) {
            aboutElements = parentSection.querySelectorAll('.inline-show-more-text span, .inline-show-more-text__text');
          }
          if (aboutElements.length === 0) {
            aboutElements = parentSection.querySelectorAll('div[class*="full-width"] span, div.display-flex span');
          }
          
          for (const elem of aboutElements) {
            const text = elem.textContent.trim();
            if (text.length > 50 && 
                !text.includes('About') && 
                !text.includes('Show all') && 
                !text.includes('…see more') &&
                !text.includes('Show less')) {
              about = text;
              console.log('✅ About found, length:', about.length);
              break;
            }
          }
        }
      }
    } catch (e) {
      console.log('⚠️ Error finding about section:', e);
    }

    let followerCount = 0;
    let connectionCount = 0;
    
    console.log('Looking for followers and connections...');
    
    const topCard = document.querySelector('.pv-top-card, .ph5, main');
    if (topCard) {
      const allSpans = topCard.querySelectorAll('span');
      for (const span of allSpans) {
        const text = span.textContent.trim();
        const lowerText = text.toLowerCase();
        console.log(`Checking span text: "${text}"`);
        if (lowerText.includes('follower') && followerCount === 0) {
          followerCount = extractNumber(text);
          console.log('✅ Followers found:', followerCount);
        }
        if (lowerText.includes('connection') && connectionCount === 0) {
          connectionCount = extractNumber(text);
          console.log('✅ Connections found:', connectionCount);
        }
      }
    }
    
    if (followerCount === 0 || connectionCount === 0) {
      const allText = document.body.innerText;
      const followerMatch = allText.match(/(\d+(?:,\d+)*)\s+followers?/i);
      const connectionMatch = allText.match(/(\d+(?:,\d+)*)\s+connections?/i);
      
      if (followerMatch && followerCount === 0) {
        followerCount = extractNumber(followerMatch[1]);
        console.log('✅ Followers found via text match:', followerCount);
      }
      if (connectionMatch && connectionCount === 0) {
        connectionCount = extractNumber(connectionMatch[1]);
        console.log('✅ Connections found via text match:', connectionMatch);
      }
    }

    if (!name || name.length < 2) {
      name = 'Unknown User';
      console.log('⚠️ Name could not be extracted, using Unknown User');
    }

    const profileData = {
      name: name,
      url: window.location.href.split('?')[0],
      about: about || '',
      bio: headline || '',
      location: location || '',
      follower_count: followerCount,
      connection_count: connectionCount
    };

    console.log('========================================');
    console.log('📊 FINAL SCRAPED PROFILE DATA:');
    console.log('Name:', profileData.name);
    console.log('Bio:', profileData.bio.substring(0, 100));
    console.log('Location:', profileData.location);
    console.log('Followers:', profileData.follower_count);
    console.log('Connections:', profileData.connection_count);
    console.log('About length:', profileData.about.length);
    console.log('========================================');

    chrome.runtime.sendMessage({
      action: 'profileScraped',
      data: profileData
    });

  } catch (error) {
    console.error('❌ Error scraping profile:', error);
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

console.log('⏰ Will start scraping in 2 seconds...');
setTimeout(() => {
  scrapeProfile().catch(err => {
    console.error('❌ Fatal scraping error:', err);
    chrome.runtime.sendMessage({
      action: 'profileScraped',
      data: {
        name: 'Fatal Error',
        url: window.location.href.split('?')[0],
        about: '',
        bio: err.toString(),
        location: '',
        follower_count: 0,
        connection_count: 0
      }
    });
  });
}, 2000);
