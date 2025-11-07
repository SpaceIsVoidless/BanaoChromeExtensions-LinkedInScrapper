console.log("LinkedIn Feed Engagement script loaded");

const TARGET_LIKES = (window.engagementConfig || {}).likeCount || 0;
const TARGET_COMMENTS = (window.engagementConfig || {}).commentCount || 0;

console.log("TARGETS:", TARGET_LIKES, "likes,", TARGET_COMMENTS, "comments");

let likesCompleted = 0;
let commentsCompleted = 0;

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function waitForFeedLoad() {
  console.log("Waiting for feed...");
  chrome.runtime.sendMessage({ action: "engagementProgress", message: "Loading feed..." });
  for (let i = 0; i < 20; i++) {
    const posts = document.querySelectorAll(".feed-shared-update-v2");
    if (posts.length >= 2) {
      console.log("Feed loaded with", posts.length, "posts");
      return true;
    }
    await wait(1000);
  }
  return false;
}

async function loadAllPosts(needed) {
  console.log("Loading", needed, "posts...");
  const scrollTimes = Math.ceil(needed / 3);
  for (let i = 0; i < scrollTimes; i++) {
    window.scrollBy({ top: 600, behavior: "smooth" });
    await wait(2000);
  }
  await wait(2000);
  const total = document.querySelectorAll(".feed-shared-update-v2").length;
  console.log("Loaded", total, "posts");
  return total;
}

function scrollToPost(post) {
  const rect = post.getBoundingClientRect();
  if (rect.top < 0 || rect.bottom > window.innerHeight) {
    const scrollTop = window.pageYOffset + rect.top - 150;
    window.scrollTo({ top: scrollTop, behavior: "smooth" });
  }
}

async function likePost(post, postNum) {
  try {
    console.log("LIKE", likesCompleted + 1, "/", TARGET_LIKES, "- Post", postNum);
    scrollToPost(post);
    await wait(1500);
    
    const likeBtn = post.querySelector("button[aria-label*=React]") || post.querySelector("button[aria-label*=Like]");
    if (!likeBtn) {
      console.log("Post", postNum, "- No like button");
      return false;
    }
    
    if (likeBtn.getAttribute("aria-pressed") === "true") {
      console.log("Post", postNum, "- Already liked, skipping");
      return false;
    }
    
    likeBtn.click();
    await wait(1200);
    console.log("SUCCESS: Liked post", postNum);
    return true;
  } catch (err) {
    console.log("Post", postNum, "- Error:", err.message);
    return false;
  }
}

async function commentOnPost(post, postNum) {
  try {
    console.log("COMMENT", commentsCompleted + 1, "/", TARGET_COMMENTS, "- Post", postNum);
    scrollToPost(post);
    await wait(1500);
    
    const commentBtn = post.querySelector("button[aria-label*=Comment]");
    if (!commentBtn) {
      console.log("Post", postNum, "- No comment button");
      return false;
    }
    
    commentBtn.click();
    console.log("Post", postNum, "- Clicked comment button");
    await wait(3000);
    
    // Find the comment box WITHIN the post's comment section
    let commentBox = post.querySelector(".ql-editor[contenteditable=true]");
    
    // If not found in post, find the nearest one after the post
    if (!commentBox) {
      const allBoxes = document.querySelectorAll(".ql-editor[contenteditable=true]");
      for (const box of allBoxes) {
        const boxRect = box.getBoundingClientRect();
        const postRect = post.getBoundingClientRect();
        if (box.offsetParent !== null && boxRect.height > 0 && boxRect.top > postRect.top) {
          commentBox = box;
          break;
        }
      }
    }
    
    if (!commentBox || commentBox.offsetParent === null) {
      console.log("Post", postNum, "- Comment box not visible");
      return false;
    }
    
    console.log("Post", postNum, "- Found comment box, typing...");
    commentBox.innerHTML = "";
    commentBox.focus();
    await wait(500);
    
    commentBox.textContent = "Great insights! Thanks for sharing.";
    commentBox.dispatchEvent(new Event("input", { bubbles: true }));
    commentBox.dispatchEvent(new Event("change", { bubbles: true }));
    
    await wait(2500);
    
    // Find submit button that's NEAR this comment box
    let submitBtn = null;
    const allSubmitBtns = document.querySelectorAll("button.comments-comment-box__submit-button:not([disabled])");
    
    for (const btn of allSubmitBtns) {
      const btnRect = btn.getBoundingClientRect();
      const boxRect = commentBox.getBoundingClientRect();
      // Submit button should be close to comment box (within 200px)
      if (Math.abs(btnRect.top - boxRect.top) < 200 && !btn.disabled) {
        submitBtn = btn;
        break;
      }
    }
    
    if (!submitBtn) {
      console.log("Post", postNum, "- Submit button not found or disabled");
      console.log("Comment box text:", commentBox.textContent);
      return false;
    }
    
    console.log("Post", postNum, "- Clicking submit...");
    submitBtn.click();
    await wait(3000);
    
    console.log("SUCCESS: Commented on post", postNum);
    return true;
  } catch (err) {
    console.log("Post", postNum, "- Error:", err.message);
    return false;
  }
}

async function runAutomation() {
  console.log("STARTING AUTOMATION");
  chrome.runtime.sendMessage({ action: "engagementProgress", message: "Starting..." });
  
  await waitForFeedLoad();
  await wait(2000);
  
  const totalNeeded = Math.max(TARGET_LIKES, TARGET_COMMENTS) + 5;
  await loadAllPosts(totalNeeded);
  
  console.log("Scrolling to top...");
  window.scrollTo({ top: 0, behavior: "smooth" });
  await wait(3000);
  
  const allPosts = Array.from(document.querySelectorAll(".feed-shared-update-v2"));
  console.log("Total posts available:", allPosts.length);
  
  if (allPosts.length === 0) {
    chrome.runtime.sendMessage({ action: "engagementComplete", likedCount: 0, commentedCount: 0 });
    return;
  }
  
  // PHASE 1: SELECT POSTS FOR LIKES
  let postsToLike = [];
  if (TARGET_LIKES > 0) {
    console.log("\n=== SELECTING POSTS FOR LIKES ===");
    chrome.runtime.sendMessage({ action: "engagementProgress", message: "Selecting posts to like..." });
    
    for (let i = 0; i < allPosts.length && postsToLike.length < TARGET_LIKES; i++) {
      const post = allPosts[i];
      scrollToPost(post);
      await wait(800);
      
      const likeBtn = post.querySelector("button[aria-label*=React]") || post.querySelector("button[aria-label*=Like]");
      if (likeBtn && likeBtn.getAttribute("aria-pressed") !== "true") {
        postsToLike.push({ post: post, index: i + 1 });
        console.log("Selected post", i + 1, "for liking -", postsToLike.length, "/", TARGET_LIKES);
      }
    }
    console.log("Selected", postsToLike.length, "posts for likes");
  }
  
  // PHASE 2: SELECT POSTS FOR COMMENTS
  let postsToComment = [];
  if (TARGET_COMMENTS > 0) {
    console.log("\n=== SELECTING POSTS FOR COMMENTS ===");
    chrome.runtime.sendMessage({ action: "engagementProgress", message: "Selecting posts to comment..." });
    
    for (let i = 0; i < allPosts.length && postsToComment.length < TARGET_COMMENTS; i++) {
      const post = allPosts[i];
      scrollToPost(post);
      await wait(800);
      
      const commentBtn = post.querySelector("button[aria-label*=Comment]");
      if (commentBtn) {
        postsToComment.push({ post: post, index: i + 1 });
        console.log("Selected post", i + 1, "for commenting -", postsToComment.length, "/", TARGET_COMMENTS);
      }
    }
    console.log("Selected", postsToComment.length, "posts for comments");
  }
  
  // Scroll back to top
  console.log("\nScrolling back to top...");
  window.scrollTo({ top: 0, behavior: "smooth" });
  await wait(3000);
  
  // PHASE 3: EXECUTE LIKES
  if (postsToLike.length > 0) {
    console.log("\n=== EXECUTING LIKES ===");
    chrome.runtime.sendMessage({ action: "engagementProgress", message: "Starting likes..." });
    
    for (let i = 0; i < postsToLike.length; i++) {
      const { post, index } = postsToLike[i];
      const success = await likePost(post, index);
      
      if (success) {
        likesCompleted++;
        console.log("Liked post", index, "-", likesCompleted, "/", TARGET_LIKES);
        chrome.runtime.sendMessage({ action: "engagementProgress", message: "Liked " + likesCompleted + "/" + TARGET_LIKES });
        
        if (i < postsToLike.length - 1) {
          await wait(2000 + Math.random() * 2000);
        }
      }
    }
    console.log("Likes complete:", likesCompleted, "/", TARGET_LIKES);
  }
  
  // PHASE 4: EXECUTE COMMENTS
  if (postsToComment.length > 0) {
    console.log("\n=== EXECUTING COMMENTS ===");
    chrome.runtime.sendMessage({ action: "engagementProgress", message: "Starting comments..." });
    
    for (let i = 0; i < postsToComment.length; i++) {
      const { post, index } = postsToComment[i];
      const success = await commentOnPost(post, index);
      
      if (success) {
        commentsCompleted++;
        console.log("Commented on post", index, "-", commentsCompleted, "/", TARGET_COMMENTS);
        chrome.runtime.sendMessage({ action: "engagementProgress", message: "Commented " + commentsCompleted + "/" + TARGET_COMMENTS });
        
        if (i < postsToComment.length - 1) {
          await wait(4000 + Math.random() * 3000);
        }
      }
    }
    console.log("Comments complete:", commentsCompleted, "/", TARGET_COMMENTS);
  }
  
  console.log("\n=== AUTOMATION COMPLETE ===");
  console.log("Final: Likes", likesCompleted, "/", TARGET_LIKES, "| Comments", commentsCompleted, "/", TARGET_COMMENTS);
  chrome.runtime.sendMessage({ action: "engagementComplete", likedCount: likesCompleted, commentedCount: commentsCompleted });
}

console.log("Starting in 3 seconds...");
setTimeout(() => runAutomation(), 3000);
