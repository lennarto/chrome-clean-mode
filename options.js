// Dark-mode options: per-extension include/exclude list only.

const listEl = document.getElementById("list");
const saveBtn = document.getElementById("save");
const selectAllBtn = document.getElementById("selectAll");
const selectNoneBtn = document.getElementById("selectNone");
const statusEl = document.getElementById("status");

let rows = []; // [{id, checkboxEl}, ...]

function extRow(ext, includedByDefault) {
  const row = document.createElement("div");
  row.className = "ext";

  const cb = document.createElement("input");
  cb.type = "checkbox";
  cb.checked = includedByDefault;

  const name = document.createElement("div");
  name.innerHTML = `<div class="name">${ext.name || "(no name)"}</div>
                    <div class="id">${ext.id}</div>`;

  const meta = document.createElement("div");
  meta.innerHTML = [
    ext.enabled ? `<span class="badge">enabled</span>` : `<span class="badge">disabled</span>`,
    `<span class="badge">${ext.type}</span>`
  ].join(" ");

  row.appendChild(cb);
  row.appendChild(name);
  row.appendChild(meta);

  listEl.appendChild(row);
  rows.push({ id: ext.id, checkboxEl: cb });
}

function setStatus(msg) {
  statusEl.textContent = msg;
  if (msg) setTimeout(() => (statusEl.textContent = ""), 1500);
}

async function load() {
  const { excludeIds = [] } = await chrome.storage.local.get(["excludeIds"]);
  const exclude = new Set(excludeIds);

  const selfId = chrome.runtime.id;
  const all = await chrome.management.getAll();
  const candidates = all.filter((it) => it.type === "extension" && it.id !== selfId);

  listEl.innerHTML = "";
  rows = [];
  for (const ext of candidates) {
    const included = !exclude.has(ext.id);
    extRow(ext, included);
  }
}

async function save() {
  const excludeIds = rows.filter(r => !r.checkboxEl.checked).map(r => r.id);
  await chrome.storage.local.set({ excludeIds });
  setStatus("Saved");
}

selectAllBtn.addEventListener("click", () => rows.forEach(r => (r.checkboxEl.checked = true)));
selectNoneBtn.addEventListener("click", () => rows.forEach(r => (r.checkboxEl.checked = false)));
saveBtn.addEventListener("click", save);

document.addEventListener("DOMContentLoaded", load);
