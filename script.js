const calculator = Desmos.GraphingCalculator(document.getElementById("calculator"));
const latexInput = document.getElementById("latexInput");
const selector = document.getElementById("expressionSelector");
const indicator = document.getElementById("statusIndicator");

function updateSelector() {
  const expressions = calculator.getExpressions();
  const currentId = selector.value;
  selector.innerHTML = "";
  expressions.forEach((e, i) => {
    const opt = document.createElement("option");
    opt.value = e.id;
    opt.textContent = `Line ${i + 1}`;
    selector.appendChild(opt);
  });
  if (expressions.find(e => e.id === currentId)) {
    selector.value = currentId;
  } else if (expressions.length > 0) {
    selector.value = expressions[0].id;
  }
}

function syncToDesmos() {
  const id = selector.value;
  if (!id) return;
  calculator.setExpression({ id, latex: latexInput.value });
}

function updateFromDesmos() {
  const expr = calculator.getExpressions().find(e => e.id === selector.value);
  if (expr && expr.latex !== undefined) {
    latexInput.value = expr.latex;
    indicator.textContent = `Selected: ${selector.options[selector.selectedIndex].text}`;
  }
}

selector.addEventListener("change", updateFromDesmos);

document.getElementById("sendBtn").onclick = syncToDesmos;
document.getElementById("getBtn").onclick = updateFromDesmos;
document.getElementById("clearInputBtn").onclick = () => {
  latexInput.value = "";
  syncToDesmos();
};

calculator.observeEvent("change", () => {
  updateSelector();
  updateFromDesmos();
});

latexInput.addEventListener("input", syncToDesmos);

// Insert text at cursor
function insertAtCursor(text) {
  const start = latexInput.selectionStart;
  const end = latexInput.selectionEnd;
  latexInput.setRangeText(text, start, end, "end");
  syncToDesmos();
  latexInput.focus();
}

// Tab switching
document.querySelectorAll(".tab-button").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-content").forEach(tab => tab.classList.remove("active"));
    document.getElementById(btn.dataset.tab).classList.add("active");
  });
});
document.querySelector(".tab-button[data-tab='letters']").click();

// Alphabet keys
const alphaKeys = "abcdefghijklmnopqrstuvwxyz".split("");
let shift = false;
document.getElementById("shiftToggle").onclick = () => {
  shift = !shift;
  renderAlphabetKeys();
};

function renderAlphabetKeys() {
  const container = document.getElementById("alphabetKeys");
  container.innerHTML = "";
  alphaKeys.forEach(ch => {
    const btn = document.createElement("button");
    const label = shift ? ch.toUpperCase() : ch;
    btn.textContent = label;
    btn.onclick = () => insertAtCursor(label);
    container.appendChild(btn);
  });
}
renderAlphabetKeys();

// Greek keys
const greekMap = [
  ["alpha", "α", "Α"], ["beta", "β", "Β"], ["gamma", "γ", "Γ"], ["delta", "δ", "Δ"],
  ["epsilon", "ε", "Ε"], ["zeta", "ζ", "Ζ"], ["eta", "η", "Η"], ["theta", "θ", "Θ"],
  ["iota", "ι", "Ι"], ["kappa", "κ", "Κ"], ["lambda", "λ", "Λ"], ["mu", "μ", "Μ"],
  ["nu", "ν", "Ν"], ["xi", "ξ", "Ξ"], ["omicron", "ο", "Ο"], ["pi", "π", "Π"],
  ["rho", "ρ", "Ρ"], ["sigma", "σ", "Σ"], ["tau", "τ", "Τ"], ["upsilon", "υ", "Υ"],
  ["phi", "φ", "Φ"], ["chi", "χ", "Χ"], ["psi", "ψ", "Ψ"], ["omega", "ω", "Ω"]
];

let greekShift = false;
document.getElementById("greekShiftToggle").onclick = () => {
  greekShift = !greekShift;
  renderGreekKeys();
};

function renderGreekKeys() {
  const container = document.getElementById("greekKeys");
  container.innerHTML = "";
  greekMap.forEach(([cmd, lower, upper]) => {
    const btn = document.createElement("button");
    btn.textContent = greekShift ? upper : lower;
    btn.onclick = () => insertAtCursor(`\\${greekShift ? cmd.charAt(0).toUpperCase() + cmd.slice(1) : cmd}`);
    container.appendChild(btn);
  });
}
renderGreekKeys();
