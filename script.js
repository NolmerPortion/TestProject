// Desmos初期化
const elt = document.getElementById('calculator');
const calculator = Desmos.GraphingCalculator(elt, {
  expressions: true,
  settingsMenu: false
});

// ギリシャ文字入力機能
document.getElementById('keyboard').addEventListener('click', function (e) {
  if (e.target.tagName === 'BUTTON') {
    const latex = e.target.getAttribute('data-latex');
    const current = calculator.getExpressions();
    let target = current.find(expr => expr.id === 'main');

    // 新しく作るか、既存の式に追加
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
