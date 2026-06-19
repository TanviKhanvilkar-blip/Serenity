// Menu section logic
function showSection(section) {
  document.querySelectorAll('div[id]').forEach(div => div.classList.add('hidden'));
  document.getElementById(section).classList.remove('hidden');
  if(section === "journaling") loadJournal();
  if(section === "mood") {displayMoodLog(); displayMoodHistory();}
  if(section === "chat") {
    // Show Botpress chat when AI Therapist section is opened
    if(window.botpressWebChat) {
      window.botpressWebChat.sendEvent({ type: 'show' });
    }
  }
}

// JOURNALING
function saveJournal() {
  const entry = document.getElementById("journalInput").value.trim();
  if(!entry) return;
  const now = new Date();
  const saved = JSON.parse(sessionStorage.getItem("journalEntries") || "[]");
  saved.push({ text: entry, time: now.toLocaleString() });
  sessionStorage.setItem("journalEntries", JSON.stringify(saved));
  document.getElementById("journalInput").value = "";
  loadJournal();
}

function loadJournal() {
  const saved = JSON.parse(sessionStorage.getItem("journalEntries") || "[]");
  const journalList = document.getElementById("journalList");
  journalList.innerHTML = saved.map(e => `<li class="p-2 bg-white border rounded"><span class="italic text-gray-500">${e.time}:</span> ${e.text}</li>`).reverse().join('');
}

function clearJournal() {
  sessionStorage.removeItem("journalEntries");
  loadJournal();
}

// MOOD TRACKING
function logMood(mood) {
  const now = new Date();
  const today = now.toISOString().slice(0,10);
  let dayLog = JSON.parse(sessionStorage.getItem("moodLog-"+today) || "[]");
  dayLog.push({ mood, time: now.toLocaleTimeString() });
  sessionStorage.setItem("moodLog-"+today, JSON.stringify(dayLog));
  let allDays = JSON.parse(sessionStorage.getItem("allMoodDays") || "[]");
  if (!allDays.includes(today)) { allDays.push(today); sessionStorage.setItem("allMoodDays", JSON.stringify(allDays)); }
  displayMoodLog(); displayMoodHistory();
}

function displayMoodLog() {
  const today = new Date().toISOString().slice(0,10);
  const dayLog = JSON.parse(sessionStorage.getItem("moodLog-"+today) || "[]");
  const log = document.getElementById("moodLog");
  log.innerHTML = dayLog.length==0 ? '<li class="italic text-gray-500">No moods logged yet today</li>' :
    dayLog.map(e => `<li class="p-1">${e.time}: <span class="font-bold">${e.mood}</span></li>`).reverse().join('');
}

function displayMoodHistory() {
  const allDays = JSON.parse(sessionStorage.getItem("allMoodDays") || "[]").slice(-7);
  let table = '<table class="min-w-full text-sm"><tr><th class="border px-2">Date</th><th class="border px-2">Moods</th></tr>';
  for(let day of allDays.reverse()) {
    const log = JSON.parse(sessionStorage.getItem("moodLog-"+day) || "[]");
    const moodsStr = log.map(e => `${e.mood} (${e.time})`).join(', ');
    table += `<tr><td class="border px-2">${day}</td><td class="border px-2">${moodsStr}</td></tr>`;
  }
  table += '</table>';
  document.getElementById("moodHistory").innerHTML = table;
}

// SELF HELP STRATEGIES
function showStrategy(type) {
  let content = "";
  if(type==="breathing") {
    content = `<h4 class="font-bold mb-2">Deep Breathing Exercise</h4>
      <p>Breathe in calmly for 4 seconds, hold for 2, out for 6. Repeat 5 times. <br><br>
      <button class="bg-blue-100 text-blue-700 px-2 py-1 my-2 rounded" onclick="guidedBreathing()">Start Guided Breathing</button></p>
      <div id="breatheGuide" class="mt-2"></div>`;
  } else if (type==="gratitude") {
    content = `<h4 class="font-bold mb-2">Gratitude Journaling</h4>
      <p>List 3 things you feel grateful for today. <br>
      <textarea id="gratitudeInput" class="w-full border mt-2 p-2"></textarea><br>
      <button class="bg-green-400 mt-2 px-3 py-1 rounded" onclick="saveGratitude()">Save</button>
      <div id="gratitudeSaved" class="mt-2 text-green-700"></div></p>`;
  } else if (type==="affirmation") {
    content = `<h4 class="font-bold mb-2">Positive Affirmation</h4>
      <p>Click for today's affirmation: <br>
      <button class="bg-pink-200 mt-2 px-3 py-1 rounded" onclick="showAffirmation()">Show Affirmation</button>
      <div id="affirmationMsg" class="mt-2 text-pink-700"></div></p>`;
  } else if (type==="grounding") {
    content = `<h4 class="font-bold mb-2">5-4-3-2-1 Grounding</h4>
      <ol class="list-decimal ml-4 text-gray-600">
        <li>Name 5 things you can see</li>
        <li>Name 4 things you can touch</li>
        <li>Name 3 things you can hear</li>
        <li>Name 2 things you can smell</li>
        <li>Name 1 thing you can taste</li>
      </ol>
      <p class="mt-2">Take a moment to perform each step for yourself and regain calm.</p>`;
  }
  document.getElementById("strategyContent").innerHTML = content;
  document.getElementById("strategyModal").classList.remove("hidden");
}

function closeStrategy() { document.getElementById("strategyModal").classList.add("hidden"); }

function guidedBreathing() {
  const guide = document.getElementById("breatheGuide");
  let sequence = ["Breathe in...","Hold...","Breathe out...","Relax..."];
  let duration = [4000,2000,6000,2000];
  let step = 0;
  function nextStep() {
    if (step>=sequence.length) { guide.innerHTML = '<span class="text-green-600 font-bold">Done!</span>'; return; }
    guide.innerHTML = `<span class="text-blue-600 font-bold">${sequence[step]}</span>`;
    setTimeout(()=>{step++;nextStep();}, duration[step]);
  }
  nextStep();
}

function saveGratitude() {
  const val = document.getElementById('gratitudeInput').value;
  sessionStorage.setItem("todayGratitude", val);
  document.getElementById('gratitudeSaved').innerText = "Saved! Take a moment to feel thankful.";
}

function showAffirmation() {
  const affirmations = ["You are enough.", "This too shall pass.", "You have overcome 100% of your struggles so far.", "You are stronger than you think."];
  document.getElementById('affirmationMsg').innerText = affirmations[Math.floor(Math.random()*affirmations.length)];
}
