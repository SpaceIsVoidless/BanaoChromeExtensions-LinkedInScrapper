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

function scrollToPost(post) {
  const rect = post.getBoundingClientRect();
  if (rect.top < 0 || rect.bottom > window.innerHeight) {
    const scrollTop = window.pageYOffset + rect.top - 150;
    window.scrollTo({ top: scrollTop, behavior: "smooth" });
  }
}

async function runAutomation() {
  console.log("STARTING AUTOMATION");
  chrome.runtime.sendMessage({ action: "engagementProgress", message: "Starting..." });
  await waitForFeedLoad();
  await wait(2000);
  console.log("Single-pass automation...");
  let processedPosts = new Set();
  let scrollAttempts = 0;
  const maxScrolls = 30;
  let noProgressCounter = 0;
  while ((likesCompleted < TARGET_LIKES || commentsCompleted < TARGET_COMMENTS) && scrollAttempts < maxScrolls) {
    const startLikes = likesCompleted;
    const startComments = commentsCompleted;
    const allPosts = Array.from(document.querySelectorAll(".feed-shared-update-v2"));
    let foundNewPost = false;
    console.log("Scan", scrollAttempts + 1, "| Posts:", allPosts.length, "| Likes:", likesCompleted + "/" + TARGET_LIKES, "| Comments:", commentsCompleted + "/" + TARGET_COMMENTS);
    for (const post of allPosts) {
      if (likesCompleted >= TARGET_LIKES && commentsCompleted >= TARGET_COMMENTS) break;
      if (processedPosts.has(post)) continue;
      processedPosts.add(post);
      foundNewPost = true;
      const postNum = processedPosts.size;
      scrollToPost(post);
      await wait(1000);
      
      if (likesCompleted < TARGET_LIKES) {
        const likeBtn = post.querySelector("button[aria-label*=React]") || post.querySelector("button[aria-label*=Like]");
        if (likeBtn && likeBtn.getAttribute("aria-pressed") !== "true") {
          console.log("About to like post", postNum, "- current:", likesCompleted + "/" + TARGET_LIKES);
          if (likesCompleted < TARGET_LIKES) {
            likeBtn.click();
            await wait(1000);
            likesCompleted++;
            console.log("LIKED post", postNum, "-", likesCompleted + "/" + TARGET_LIKES);
            chrome.runtime.sendMessage({ action: "engagementProgress", message: "Liked " + likesCompleted + "/" + TARGET_LIKES });
            await wait(1000 + Math.random() * 1000);
          }
        }
      } else {
        console.log("Skipping like on post", postNum, "- already have", likesCompleted + "/" + TARGET_LIKES);
      }
      
      if (commentsCompleted < TARGET_COMMENTS) {
        const commentBtn = post.querySelector("button[aria-label*=Comment]");
        if (commentBtn) {
          console.log("About to comment on post", postNum, "- current:", commentsCompleted + "/" + TARGET_COMMENTS);
          if (commentsCompleted < TARGET_COMMENTS) {
            console.log("Clicking comment button on post", postNum);
            commentBtn.click();
            await wait(3000);
            let commentBox = post.querySelector(".ql-editor[contenteditable=true]");
            if (!commentBox) {
              const allBoxes = document.querySelectorAll(".ql-editor[contenteditable=true]");
              for (const box of allBoxes) {
                if (box.offsetParent !== null && box.getBoundingClientRect().height > 0) {
                  commentBox = box;
                  break;
                }
              }
            }
            console.log("Comment box found:", !!commentBox);
            if (commentBox && commentBox.offsetParent !== null) {
              commentBox.innerHTML = "";
              commentBox.focus();
              await wait(400);
              commentBox.innerHTML = "<p>Great insights! Thanks for sharing.</p>";
              commentBox.dispatchEvent(new Event("input", { bubbles: true }));
              commentBox.dispatchEvent(new Event("change", { bubbles: true }));
              await wait(2000);
              
              const commentContainer = commentBox.closest('.comments-comment-box') || commentBox.closest('form');
              let submitBtn = null;
              
              if (commentContainer) {
                const buttons = commentContainer.querySelectorAll('button');
                for (const btn of buttons) {
                  const text = btn.innerText || btn.textContent;
                  if (text && text.trim() === "Comment" && !btn.disabled && btn.offsetParent !== null) {
                    submitBtn = btn;
                    console.log("Found Comment button with text:", text);
                    break;
                  }
                }
              }
              
              if (!submitBtn) {
                const allButtons = document.querySelectorAll('button');
                for (const btn of allButtons) {
                  const text = btn.innerText || btn.textContent;
                  if (text && text.trim() === "Comment" && !btn.disabled && btn.offsetParent !== null) {
                    const rect = btn.getBoundingClientRect();
                    if (rect.width > 0 && rect.height > 0) {
                      submitBtn = btn;
                      console.log("Found Comment button globally");
                      break;
                    }
                  }
                }
              }
              
              console.log("Submit button found:", !!submitBtn, "| Disabled:", submitBtn ? submitBtn.disabled : "N/A");
              if (submitBtn && !submitBtn.disabled) {
                submitBtn.click();
                console.log("Comment button CLICKED on post", postNum);
                await wait(2500);
                if (commentsCompleted < TARGET_COMMENTS) {
                  commentsCompleted++;
                  console.log("COMMENTED post", postNum, "-", commentsCompleted + "/" + TARGET_COMMENTS);
                  chrome.runtime.sendMessage({ action: "engagementProgress", message: "Commented " + commentsCompleted + "/" + TARGET_COMMENTS });
                  await wait(1500 + Math.random() * 1500);
                }
              } else {
                console.log("SKIPPING - Comment button not found or disabled");
              }
            }
          }
        }
      } else {
        console.log("Skipping comment on post", postNum, "- already have", commentsCompleted + "/" + TARGET_COMMENTS);
      }
    }
    if (likesCompleted === startLikes && commentsCompleted === startComments) {
      noProgressCounter++;
      console.log("No progress made, counter:", noProgressCounter);
      if (noProgressCounter >= 5) {
        console.log("Breaking - no progress after 5 attempts");
        break;
      }
    } else {
      noProgressCounter = 0;
    }
    if (likesCompleted >= TARGET_LIKES && commentsCompleted >= TARGET_COMMENTS) {
      console.log("Breaking - targets reached!");
      break;
    }
    scrollAttempts++;
    if (!foundNewPost || (likesCompleted < TARGET_LIKES || commentsCompleted < TARGET_COMMENTS)) {
      window.scrollBy({ top: 700, behavior: "smooth" });
      await wait(2500);
    }
  }
  console.log("COMPLETE - Likes:", likesCompleted + "/" + TARGET_LIKES, "Comments:", commentsCompleted + "/" + TARGET_COMMENTS);
  chrome.runtime.sendMessage({ action: "engagementComplete", likedCount: likesCompleted, commentedCount: commentsCompleted });
}

console.log("Starting in 3 seconds...");
setTimeout(() => runAutomation(), 3000);
