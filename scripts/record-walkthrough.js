import { chromium } from 'playwright-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const VIDEO_DIR = path.resolve('./videos');
const OUTPUT_VIDEO_NAME = 'vocasaathi_prototype_walkthrough.webm';

async function setupPageOverlay(page) {
  await page.evaluate(() => {
    if (document.getElementById('vs-overlay-container')) return;

    // Overlay styles & container
    const container = document.createElement('div');
    container.id = 'vs-overlay-container';
    container.innerHTML = `
      <style>
        #vs-captions-overlay {
          position: fixed;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 9999999;
          background: rgba(15, 23, 42, 0.94);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.16);
          box-shadow: 0 20px 45px -8px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(16, 185, 129, 0.25);
          border-radius: 18px;
          padding: 14px 26px;
          width: 860px;
          max-width: 92%;
          color: white;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          pointer-events: none;
          display: flex;
          align-items: center;
          gap: 18px;
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          opacity: 1;
        }
        #vs-caption-badge {
          background: linear-gradient(135deg, #059669 0%, #10b981 100%);
          color: #ffffff;
          font-weight: 800;
          font-size: 11px;
          letter-spacing: 0.08em;
          padding: 6px 14px;
          border-radius: 8px;
          text-transform: uppercase;
          white-space: nowrap;
          box-shadow: 0 4px 14px rgba(16, 185, 129, 0.4);
          display: flex;
          align-items: center;
          gap: 6px;
        }
        #vs-caption-title {
          font-size: 16px;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: -0.01em;
          margin-bottom: 2px;
          line-height: 1.25;
        }
        #vs-caption-desc {
          font-size: 13px;
          font-weight: 400;
          color: #cbd5e1;
          line-height: 1.4;
        }
        #vs-cursor {
          position: fixed;
          top: 0;
          left: 0;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: rgba(16, 185, 129, 0.75);
          border: 2px solid #ffffff;
          box-shadow: 0 0 18px rgba(16, 185, 129, 0.9), 0 2px 8px rgba(0,0,0,0.3);
          pointer-events: none;
          z-index: 10000000;
          transform: translate(-50%, -50%);
          transition: width 0.15s ease, height 0.15s ease, background 0.15s ease;
        }
        #vs-cursor.clicking {
          width: 32px;
          height: 32px;
          background: rgba(245, 158, 11, 0.9);
          box-shadow: 0 0 24px rgba(245, 158, 11, 1);
        }
      </style>
      <div id="vs-cursor"></div>
      <div id="vs-captions-overlay">
        <div id="vs-caption-badge">VOCASAATHI</div>
        <div style="flex: 1;">
          <div id="vs-caption-title">VocaSaathi Prototype</div>
          <div id="vs-caption-desc">Helping families choose skills with confidence.</div>
        </div>
      </div>
    `;
    document.body.appendChild(container);

    // Track mouse position on window
    window.addEventListener('mousemove', (e) => {
      const cursor = document.getElementById('vs-cursor');
      if (cursor) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
      }
    });
  });
}

async function updateCaption(page, badge, title, desc) {
  await page.evaluate(({ badge, title, desc }) => {
    const badgeEl = document.getElementById('vs-caption-badge');
    const titleEl = document.getElementById('vs-caption-title');
    const descEl = document.getElementById('vs-caption-desc');
    const overlay = document.getElementById('vs-captions-overlay');

    if (overlay) {
      overlay.style.opacity = '0';
      overlay.style.transform = 'translateX(-50%) translateY(8px)';
      setTimeout(() => {
        if (badgeEl) badgeEl.textContent = badge;
        if (titleEl) titleEl.textContent = title;
        if (descEl) descEl.textContent = desc;
        overlay.style.opacity = '1';
        overlay.style.transform = 'translateX(-50%) translateY(0)';
      }, 180);
    }
  }, { badge, title, desc });
}

async function moveMouseSmooth(page, targetX, targetY, steps = 18) {
  await page.mouse.move(targetX, targetY, { steps });
}

async function clickSmooth(page, selectorOrCoords, pauseAfter = 1000) {
  let x, y;
  if (typeof selectorOrCoords === 'string') {
    const el = await page.$(selectorOrCoords);
    if (!el) {
      console.warn('Selector not found:', selectorOrCoords);
      return;
    }
    const box = await el.boundingBox();
    if (!box) return;
    x = box.x + box.width / 2;
    y = box.y + box.height / 2;
  } else {
    x = selectorOrCoords.x;
    y = selectorOrCoords.y;
  }

  await moveMouseSmooth(page, x, y, 16);
  await page.evaluate(() => {
    const c = document.getElementById('vs-cursor');
    if (c) c.classList.add('clicking');
  });
  await page.mouse.click(x, y);
  await new Promise(r => setTimeout(r, 120));
  await page.evaluate(() => {
    const c = document.getElementById('vs-cursor');
    if (c) c.classList.remove('clicking');
  });
  await new Promise(r => setTimeout(r, pauseAfter));
}

async function smoothScroll(page, totalDistance, durationMs = 1500) {
  const steps = 30;
  const stepDistance = totalDistance / steps;
  const stepTime = durationMs / steps;

  for (let i = 0; i < steps; i++) {
    await page.evaluate((d) => window.scrollBy({ top: d, behavior: 'auto' }), stepDistance);
    await new Promise(r => setTimeout(r, stepTime));
  }
}

async function recordWalkthrough() {
  if (!fs.existsSync(VIDEO_DIR)) fs.mkdirSync(VIDEO_DIR, { recursive: true });

  console.log('Starting Playwright with Chrome...');
  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true
  });

  const context = await browser.newContext({
    recordVideo: {
      dir: VIDEO_DIR,
      size: { width: 1600, height: 900 }
    },
    viewport: { width: 1600, height: 900 }
  });

  const page = await context.newPage();

  // Ensure overlay re-attaches on every page navigation
  page.on('load', async () => {
    try {
      await setupPageOverlay(page);
    } catch (e) {}
  });

  // -------------------------------------------------------------
  // SCENE 1: LANDING PAGE & VALUE PROPOSITION
  // -------------------------------------------------------------
  console.log('Scene 1: Loading Homepage...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await setupPageOverlay(page);
  await updateCaption(
    page,
    '01 / OVERVIEW',
    'VocaSaathi — Helping Families Choose Skills with Confidence',
    'Evidence-backed vocational career guidance specifically addressing parental anxiety and degree stigma.'
  );
  await moveMouseSmooth(page, 800, 320, 20);
  await new Promise(r => setTimeout(r, 2200));

  console.log('Scene 1: Scrolling through value pillars...');
  await updateCaption(
    page,
    '01 / OVERVIEW',
    'Three Core Pillars: Evidence AI, Resistance Tracking & Human Escalation',
    'Moving beyond generic advice with audited wage ladders, resistance measurement, and certified counsellor desks.'
  );
  await smoothScroll(page, 550, 1800);
  await new Promise(r => setTimeout(r, 2000));
  await smoothScroll(page, 450, 1600);
  await new Promise(r => setTimeout(r, 1800));

  // Scroll back to top
  await smoothScroll(page, -1000, 1400);
  await new Promise(r => setTimeout(r, 800));

  // -------------------------------------------------------------
  // SCENE 2: VOCATIONAL TRADE DIRECTORY & NSQF LADDERS
  // -------------------------------------------------------------
  console.log('Scene 2: Navigating to Explore Trades...');
  await updateCaption(
    page,
    '02 / TRADE DIRECTORY',
    'Navigating to Empirical Trade Intelligence Directory',
    'Exploring certified NSQF trades, median salaries, and regional placement rates.'
  );
  await clickSmooth(page, 'a[href="/explore/trades"]', 1600);
  await setupPageOverlay(page);

  await updateCaption(
    page,
    '02 / TRADE DIRECTORY',
    'Transparent Placement Rates & Salary Progression Ladders',
    'Each trade is benchmarked with real MSME contractor wage slabs, apprenticeship stipends, and hiring sectors.'
  );
  await smoothScroll(page, 400, 1600);
  await new Promise(r => setTimeout(r, 1800));

  // Hover over Solar PV or Electrician card
  const tradeCards = await page.$$('a[href*="/explore/trades/"], div.rounded-2xl');
  if (tradeCards.length > 0) {
    const box = await tradeCards[0].boundingBox();
    if (box) {
      await moveMouseSmooth(page, box.x + box.width / 2, box.y + box.height / 2, 20);
      await new Promise(r => setTimeout(r, 1400));
    }
  }

  // -------------------------------------------------------------
  // SCENE 3: MULTI-TRADE HEAD-TO-HEAD COMPARISON
  // -------------------------------------------------------------
  console.log('Scene 3: Navigating to Trade Comparison...');
  await smoothScroll(page, -400, 1000);
  await updateCaption(
    page,
    '03 / COMPARISON ENGINE',
    'Side-by-Side Trade Decision Matrix',
    'Enabling families to evaluate two trades simultaneously on ROI, curriculum duration, and lateral degree progression.'
  );
  await clickSmooth(page, 'a[href="/compare"]', 1600);
  await setupPageOverlay(page);

  await updateCaption(
    page,
    '03 / COMPARISON ENGINE',
    'Electrician & Wireman vs. Solar PV Installer',
    'Direct comparison of apprentice stipends, break-even timelines, and career growth potential.'
  );
  await smoothScroll(page, 450, 1600);
  await new Promise(r => setTimeout(r, 2200));
  await smoothScroll(page, 400, 1500);
  await new Promise(r => setTimeout(r, 2000));
  await smoothScroll(page, -850, 1200);

  // -------------------------------------------------------------
  // SCENE 4: FAMILY CONTEXT INTAKE & BILINGUAL TOGGLE
  // -------------------------------------------------------------
  console.log('Scene 4: Navigating to Counselling Intake...');
  await updateCaption(
    page,
    '04 / FAMILY INTAKE',
    'Capturing Household Realities & Parental Anxieties',
    'Counselling begins with deep demographic context: household income bracket, education, and specific family doubts.'
  );
  await clickSmooth(page, 'a[href="/counselling/session"], a[href="/counselling"]', 1600);
  await setupPageOverlay(page);

  // Demonstrate language toggle to Marathi in navbar
  console.log('Scene 4: Demonstrating Marathi localization...');
  await updateCaption(
    page,
    '04 / BILINGUAL INCLUSIVITY',
    'Full Regional Accessibility: English & Marathi Language Support',
    'Families can engage seamlessly in Marathi or English for low-literacy clarity and confidence.'
  );

  const marathiBtn = await page.$('button:has-text("मराठी")');
  if (marathiBtn) {
    await clickSmooth(page, 'button:has-text("मराठी")', 1800);
    await new Promise(r => setTimeout(r, 1200));
    // Switch back to English for presentation consistency
    await clickSmooth(page, 'button:has-text("English")', 1500);
  }

  // -------------------------------------------------------------
  // SCENE 5: AI COUNSELLING SESSION & DYNAMIC RESISTANCE METER
  // -------------------------------------------------------------
  console.log('Scene 5: Interactive Counselling Session...');
  if (!page.url().includes('/session')) {
    await page.goto('http://localhost:3000/counselling/session', { waitUntil: 'networkidle' });
    await setupPageOverlay(page);
  }

  await updateCaption(
    page,
    '05 / RESISTANCE TRACKER',
    'Empirical Objection Handling with Live Resistance Meter',
    'Session initializes with measured parental hesitation (72% - High Hesitation) across salary and degree stigma.'
  );
  await new Promise(r => setTimeout(r, 2200));

  // Find a suggestion button (e.g. Starting Salary & Growth)
  const salarySuggestion = await page.$('button:has-text("Starting Salary"), button:has-text("पगार")');
  if (salarySuggestion) {
    console.log('Clicking quick suggestion prompt...');
    await updateCaption(
      page,
      '05 / OBJECTION RESOLUTION',
      'Family Asks: Starting Salary & Long-Term Growth',
      'VocaSaathi retrieves verified district wage data and NSQF progression steps to counter financial uncertainty.'
    );
    const box = await salarySuggestion.boundingBox();
    if (box) {
      await clickSmooth(page, { x: box.x + box.width / 2, y: box.y + box.height / 2 }, 2500);
    }
  }

  // Wait for AI response to load and resistance meter to update
  await new Promise(r => setTimeout(r, 3000));
  await updateCaption(
    page,
    '05 / RESISTANCE DROP',
    'Resistance Decreases as Verified Evidence is Presented',
    'The Resistance Meter dynamically drops as evidence cards, wage benchmarks, and lateral polytechnic entry routes reassure parents.'
  );
  await smoothScroll(page, 350, 1400);
  await new Promise(r => setTimeout(r, 2200));

  // -------------------------------------------------------------
  // SCENE 6: HUMAN COUNSELLOR ESCALATION & WORKFLOW DESK
  // -------------------------------------------------------------
  console.log('Scene 6: Navigating to Counsellor Desk...');
  await updateCaption(
    page,
    '06 / HUMAN ESCALATION',
    'Human-in-the-Loop: Certified Counsellor Case Queue',
    'When high resistance persists or complex household tensions arise, cases seamlessly escalate with complete transcripts.'
  );
  await clickSmooth(page, 'a[href="/counsellor"]', 1600);
  await setupPageOverlay(page);

  await updateCaption(
    page,
    '06 / HUMAN ESCALATION',
    'Actionable Case Summaries & Recommended Discussion Points',
    'Counsellors review detected objections, initial vs current resistance, and suggested interventions before family follow-up.'
  );
  await smoothScroll(page, 400, 1600);
  await new Promise(r => setTimeout(r, 2200));

  // Click on a case in the list
  const caseButtons = await page.$$('button:has-text("CASE-MH-"), div.cursor-pointer');
  if (caseButtons.length > 1) {
    const box = await caseButtons[1].boundingBox();
    if (box) {
      await clickSmooth(page, { x: box.x + box.width / 2, y: box.y + box.height / 2 }, 1500);
    }
  }
  await smoothScroll(page, -400, 1000);

  // -------------------------------------------------------------
  // SCENE 7: SCHEME ADMINISTRATOR ANALYTICS & RESISTANCE HOTSPOTS
  // -------------------------------------------------------------
  console.log('Scene 7: Navigating to Administrator Analytics...');
  await updateCaption(
    page,
    '07 / SCHEME INTELLIGENCE',
    'Administrator Governance & Parental Resistance Heatmaps',
    'Macro analytics providing scheme administrators real-time visibility into district objections, trade demand, and conversion.'
  );
  await clickSmooth(page, 'a[href="/admin"]', 1600);
  await setupPageOverlay(page);

  await updateCaption(
    page,
    '07 / SCHEME INTELLIGENCE',
    'Maharashtra District Heatmap & Objection Analytics',
    'Highlighting specific parental concerns: Starting Salary (35%), Degree Stigma (24%), and Workplace Safety.'
  );
  await smoothScroll(page, 450, 1800);
  await new Promise(r => setTimeout(r, 2400));
  await smoothScroll(page, 450, 1800);
  await new Promise(r => setTimeout(r, 2200));
  await smoothScroll(page, -900, 1400);

  // -------------------------------------------------------------
  // SCENE 8: OUTRO
  // -------------------------------------------------------------
  console.log('Scene 8: Returning to Home for Outro...');
  await updateCaption(
    page,
    'VOCASAATHI',
    'Helping Families Choose Skills with Confidence',
    'Bridging the critical trust deficit between vocational education and Indian households.'
  );
  await clickSmooth(page, 'a[href="/"]', 1800);
  await setupPageOverlay(page);
  await updateCaption(
    page,
    'VOCASAATHI',
    'Helping Families Choose Skills with Confidence',
    'Smart India Hackathon Prototype • Evidence-First AI • Family-Centered Counselling'
  );
  await new Promise(r => setTimeout(r, 3200));

  // Finish recording
  console.log('Closing page and finalizing video recording...');
  await page.close();
  await context.close();
  await browser.close();

  // Find generated video file
  const videoFiles = fs.readdirSync(VIDEO_DIR).filter(f => f.endsWith('.webm'));
  console.log('Generated video files:', videoFiles);

  // Rename latest file to standard name
  if (videoFiles.length > 0) {
    // Find latest modified webm
    const sorted = videoFiles.map(f => ({
      name: f,
      time: fs.statSync(path.join(VIDEO_DIR, f)).mtimeMs
    })).sort((a, b) => b.time - a.time);

    const latest = sorted[0].name;
    const finalPath = path.join(VIDEO_DIR, OUTPUT_VIDEO_NAME);
    if (fs.existsSync(finalPath)) fs.unlinkSync(finalPath);
    fs.copyFileSync(path.join(VIDEO_DIR, latest), finalPath);
    console.log(`Successfully exported video to: ${finalPath}`);

    // Also copy to artifacts directory if available
    const artifactDir = "C:\\Users\\Sanika Chowdhary\\.gemini\\antigravity\\brain\\65915d96-7678-4526-89ab-721815236574";
    if (fs.existsSync(artifactDir)) {
      const artifactVideoPath = path.join(artifactDir, OUTPUT_VIDEO_NAME);
      fs.copyFileSync(finalPath, artifactVideoPath);
      console.log(`Copied video to artifacts directory: ${artifactVideoPath}`);
    }
  }

  console.log('Recording process complete!');
}

recordWalkthrough().catch(err => {
  console.error('Recording failed:', err);
  process.exit(1);
});
