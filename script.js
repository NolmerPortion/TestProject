// Desmosの初期化
const elt = document.getElementById('calculator');
const calculator = Desmos.GraphingCalculator(elt, {
  expressions: true,
  settingsMenu: false
});

// キーボードのボタンがクリックされたときの動作
document.getElementById('keyboard').addEventListener('click', function (e) {
  if (e.target.tagName === 'BUTTON') {
    let latex = e.target.getAttribute('data-latex');  // \gamma など

    const current = calculator.getExpressions();
    let target = current.find(expr => expr.id === 'main');

    // latexをそのまま渡すのではなく、Desmosに渡す直前でエスケープする
    latex = latex.replace(/\\/g, '\\\\');  // \ を \\ に置換

    if (!target) {
      calculator.setExpression({ id: 'main', latex });
    } else {
      calculator.setExpression({
        id: 'main',
        latex: target.latex + latex
      });
    }
  }
});
