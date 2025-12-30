// ===== Date helpers (헤더의 좌/우 이동 기능 포함) =====
function startOfDay(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
function addDays(d, n) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}
function dateKey(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// 영어 요일/월 표시를 두 번째 시안 느낌으로 만들기 위해 en-US 사용
function formatHeader(d) {
  const weekday = d.toLocaleDateString("ko-KR", { weekday: "long" });
  const month = d.getMonth() + 1;
  const day = d.getDate();

  return `${month}월 ${day}일, ${weekday}`;
}

// ===== Storage =====
const STORAGE_PREFIX = "today_todos_v2:";

function loadTodosFor(d) {
  const raw = localStorage.getItem(STORAGE_PREFIX + dateKey(d));
  if (!raw) return [];
  try {
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function saveTodosFor(d, todos) {
  localStorage.setItem(STORAGE_PREFIX + dateKey(d), JSON.stringify(todos));
}

function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}

// ===== State =====
let viewDate = startOfDay(new Date());
let todos = loadTodosFor(viewDate);
let filterMode = "all"; // all | active | done

// ===== DOM =====
const dowLabelEl = document.getElementById("dowLabel");
const dateLabelEl = document.getElementById("dateLabel");
const prevDayBtn = document.getElementById("prevDayBtn");
const nextDayBtn = document.getElementById("nextDayBtn");

const inputEl = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");

const filterAllBtn = document.getElementById("filterAll");
const filterActiveBtn = document.getElementById("filterActive");
const filterDoneBtn = document.getElementById("filterDone");

const countDoneEl = document.getElementById("countDone");
const countTotalEl = document.getElementById("countTotal");

const toggleAllEl = document.getElementById("toggleAll");
const clearDoneBtn = document.getElementById("clearDoneBtn");
const resetDayBtn = document.getElementById("resetDayBtn");

const listEl = document.getElementById("list");
const emptyEl = document.getElementById("empty");

// ===== Render =====
function applyFilter(arr) {
  if (filterMode === "active") return arr.filter(t => !t.done);
  if (filterMode === "done") return arr.filter(t => t.done);
  return arr;
}

function updateHeader() {
  dateLabelEl.textContent = formatHeader(viewDate);
}


function updateCounts() {
  const total = todos.length;
  const done = todos.filter(t => t.done).length;
  countTotalEl.textContent = String(total);
  countDoneEl.textContent = String(done);

  // toggleAll 상태 갱신
  toggleAllEl.checked = total > 0 && done === total;
  toggleAllEl.indeterminate = done > 0 && done < total;
}

function setFilter(mode) {
  filterMode = mode;
  const map = { all: filterAllBtn, active: filterActiveBtn, done: filterDoneBtn };
  [filterAllBtn, filterActiveBtn, filterDoneBtn].forEach(b => b.setAttribute("aria-pressed", "false"));
  map[mode].setAttribute("aria-pressed", "true");
  render();
}

function render() {
  saveTodosFor(viewDate, todos);
  updateHeader();
  updateCounts();

  const shown = applyFilter(todos);
  listEl.innerHTML = "";

  emptyEl.hidden = !(todos.length === 0);

  shown.forEach(t => {
    const row = document.createElement("div");
    row.className = "item" + (t.done ? " done" : "");
    row.dataset.id = t.id;

    row.innerHTML = `
      <button class="leftCheck" type="button" aria-label="완료 토글">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20 6L9 17l-5-5" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>

      <div class="content">
        <div class="title">${escapeHtml(t.text)}</div>
        <div class="meta">
          <span>${t.done ? "완료" : "미완료"}</span>
          <span>${new Date(t.createdAt).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })}</span>
        </div>
      </div>

      <div class="actions">
        <button class="iconBtn" type="button" aria-label="수정">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 20h9" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
          </svg>
        </button>
        <button class="iconBtn danger" type="button" aria-label="삭제">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3 6h18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path d="M8 6V4h8v2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path d="M19 6l-1 14H6L5 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
            <path d="M10 11v6M14 11v6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
    `;

    // 완료 토글 (체크 버튼)
    const checkBtn = row.querySelector(".leftCheck");
    checkBtn.addEventListener("click", () => toggleDone(t.id));

    // 텍스트 영역 탭해도 토글되게(모바일 편의)
    row.querySelector(".content").addEventListener("click", () => toggleDone(t.id));

    // 수정
    row.querySelector('button[aria-label="수정"]').addEventListener("click", () => {
      const current = todos.find(x => x.id === t.id);
      if (!current) return;
      const next = prompt("할 일을 수정하세요:", current.text);
      if (next === null) return;
      const trimmed = next.trim();
      if (!trimmed) return;
      current.text = trimmed;
      current.updatedAt = Date.now();
      render();
    });

    // 삭제
    row.querySelector('button[aria-label="삭제"]').addEventListener("click", () => {
      if (!confirm("이 할 일을 삭제할까요?")) return;
      todos = todos.filter(x => x.id !== t.id);
      render();
    });

    listEl.appendChild(row);
  });
}

// ===== Actions =====
function addTodo(text) {
  const trimmed = text.trim();
  if (!trimmed) return;

  todos.unshift({
    id: uid(),
    text: trimmed,
    done: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });

  inputEl.value = "";
  render();
}

function toggleDone(id) {
  const t = todos.find(x => x.id === id);
  if (!t) return;
  t.done = !t.done;
  t.updatedAt = Date.now();
  render();
}

function setViewDate(d) {
  viewDate = startOfDay(d);
  todos = loadTodosFor(viewDate);
  render();
}

// ===== Events =====
addBtn.addEventListener("click", () => addTodo(inputEl.value));
inputEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTodo(inputEl.value);
});

filterAllBtn.addEventListener("click", () => setFilter("all"));
filterActiveBtn.addEventListener("click", () => setFilter("active"));
filterDoneBtn.addEventListener("click", () => setFilter("done"));

prevDayBtn.addEventListener("click", () => setViewDate(addDays(viewDate, -1)));
nextDayBtn.addEventListener("click", () => setViewDate(addDays(viewDate,  1)));

toggleAllEl.addEventListener("change", () => {
  const checked = toggleAllEl.checked;
  todos = todos.map(t => ({ ...t, done: checked, updatedAt: Date.now() }));
  render();
});

clearDoneBtn.addEventListener("click", () => {
  const before = todos.length;
  todos = todos.filter(t => !t.done);
  if (before !== todos.length) render();
});

resetDayBtn.addEventListener("click", () => {
  if (!confirm("선택한 날짜의 목록을 전부 초기화할까요?")) return;
  todos = [];
  render();
});

// 자정 지나서 '오늘' 기준이 바뀌면(현재 보고 있는 날짜가 오늘일 때) 자동 갱신
let lastTodayKey = dateKey(new Date());
setInterval(() => {
  const nowKey = dateKey(new Date());
  if (nowKey !== lastTodayKey) {
    lastTodayKey = nowKey;
    const isViewingToday = dateKey(viewDate) === nowKey;
    if (isViewingToday) setViewDate(new Date());
  }
}, 30_000);

// init
render();
