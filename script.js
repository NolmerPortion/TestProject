// script.js for ver.1.5

const calculator = Desmos.GraphingCalculator(document.getElementById("calculator"));
const latexInput = document.getElementById("latexInput");
const selector = document.getElementById("expressionSelector");
const indicator = document.getElementById("statusIndicator");
const autoformatToggle = document.getElementById("autoformatToggle");

let autoformatEnabled = true;
autoformatToggle.addEventListener("change", () => {
  autoformatEnabled = autoformatToggle.value === "on";
});

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

latexInput.addEventListener("input", (e) => {
  if (autoformatEnabled) {
    const value = latexInput.value;
    const pos = latexInput.selectionStart;

    if (value[pos - 1] === "*") {
      latexInput.value = value.slice(0, pos - 1) + "\\cdot" + value.slice(pos);
      latexInput.setSelectionRange(pos + 4, pos + 4);
    } else if (value[pos - 1] === "(") {
      latexInput.value = value.slice(0, pos - 1) + "\\left(\\right)" + value.slice(pos);
      latexInput.setSelectionRange(pos + 6, pos + 6);
    }
  }
  syncToDesmos();
});

document.querySelectorAll('[data-insert]').forEach(button => {
  button.addEventListener("click", () => {
    const insert = button.getAttribute("data-insert");
    const start = latexInput.selectionStart;
    const end = latexInput.selectionEnd;
    latexInput.setRangeText(insert, start, end, "end");
    syncToDesmos();
    latexInput.focus();
  });
});

document.querySelectorAll(".tab-button").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-content").forEach(tab => tab.classList.remove("active"));
    document.getElementById(btn.dataset.tab).classList.add("active");
  });
});

document.querySelector(".tab-button[data-tab='letters']").click();
updateSelector();
