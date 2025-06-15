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

document.querySelectorAll('[data-insert]').forEach(button => {
  button.addEventListener("click", () => {
    const insert = JSON.parse('"' + button.getAttribute("data-insert") + '"');
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

// 初期化
document.querySelector(".tab-button[data-tab='letters']").click();
updateSelector();

// ファイル保存・読み込み関連
document.getElementById("saveBtn").addEventListener("click", () => {
  const expressions = calculator.getExpressions();
  localStorage.setItem("savedExpressions", JSON.stringify(expressions));
  alert("Expressions saved locally.");
});

document.getElementById("loadBtn").addEventListener("click", () => {
  const saved = localStorage.getItem("savedExpressions");
  if (saved) {
    calculator.setExpressions([]);
    const expressions = JSON.parse(saved);
    expressions.forEach(expr => calculator.setExpression(expr));
  }
});

document.getElementById("exportBtn").addEventListener("click", () => {
  const data = JSON.stringify(calculator.getExpressions(), null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "desmos-expressions.json";
  a.click();
  URL.revokeObjectURL(url);
});

document.getElementById("importBtn").addEventListener("click", () => {
  document.getElementById("importFile").click();
});

document.getElementById("importFile").addEventListener("change", event => {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const expressions = JSON.parse(e.target.result);
      calculator.setExpressions([]);
      expressions.forEach(expr => calculator.setExpression(expr));
    } catch (err) {
      alert("Invalid JSON file.");
    }
  };
  reader.readAsText(file);
});
