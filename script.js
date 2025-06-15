document.addEventListener("DOMContentLoaded", () => {
  const elt = document.getElementById('calculator');
  const calculator = Desmos.GraphingCalculator(elt);

  let shift = false;

  const greekLetters = [
    ['alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'eta', 'theta', 'iota', 'kappa',
     'lambda', 'mu', 'nu', 'xi', 'omicron', 'pi', 'rho', 'sigma', 'tau', 'upsilon',
     'phi', 'chi', 'psi', 'omega'],
    ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta', 'Iota', 'Kappa',
     'Lambda', 'Mu', 'Nu', 'Xi', 'Omicron', 'Pi', 'Rho', 'Sigma', 'Tau', 'Upsilon',
     'Phi', 'Chi', 'Psi', 'Omega']
  ];

  const keyboardDiv = document.getElementById('keyboard');

  function renderKeyboard() {
    keyboardDiv.innerHTML = '';
    const letters = shift ? greekLetters[1] : greekLetters[0];
    letters.forEach(letter => {
      const button = document.createElement('button');
      button.textContent = letter;
      button.dataset.latex = `\\${letter}`;
      button.addEventListener('click', () => {
        const selected = calculator.getSelectedExpression();
        const latexCode = button.dataset.latex;

        if (selected && selected.id) {
          // 既存の選択された式に追記
          calculator.setExpression({
            id: selected.id,
            latex: (selected.latex ?? '') + latexCode
          });
        } else {
          // 新規行を作成し、選択状態にセット
          const id = `expr${Date.now()}`;
          calculator.setExpression({ id, latex: latexCode });

          // 少し遅らせて選択状態を強制（UIとのタイミングずれ対策）
          setTimeout(() => {
            calculator.setSelectedExpression({ id });
          }, 10);
        }
      });
      keyboardDiv.appendChild(button);
    });
  }

  renderKeyboard();

  document.getElementById('shiftBtn').addEventListener('click', () => {
    shift = !shift;
    document.getElementById('shiftBtn').textContent = shift ? 'ON' : 'OFF';
    renderKeyboard();
  });
});
