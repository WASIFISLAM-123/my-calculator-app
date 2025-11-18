 let currentOperand = '0';
        let previousOperand = '';
        let operation = null;

        function updateDisplay() {
            const currentElement = document.getElementById('current');
            const previousElement = document.getElementById('previous');
            
            currentElement.textContent = currentOperand;
            
            if (operation) {
                previousElement.textContent = `${previousOperand} ${getOperatorSymbol(operation)}`;
            } else {
                previousElement.textContent = '';
            }
        }

        function getOperatorSymbol(op) {
            const symbols = {
                '+': '+',
                '-': '-',
                '*': '×',
                '/': '÷',
                '%': '%'
            };
            return symbols[op] || op;
        }

        function appendNumber(number) {
            if (number === '.' && currentOperand.includes('.')) return;
            if (currentOperand === '0' && number !== '.') {
                currentOperand = number;
            } else {
                currentOperand += number;
            }
            updateDisplay();
            addButtonFeedback();
        }

        function chooseOperator(op) {
            if (currentOperand === '') return;
            if (previousOperand !== '') {
                calculate();
            }
            operation = op;
            previousOperand = currentOperand;
            currentOperand = '';
            updateDisplay();
            addButtonFeedback();
        }

        function calculate() {
            if (operation === null || currentOperand === '') return;
            
            const display = document.getElementById('display');
            display.classList.add('calculating');
            setTimeout(() => display.classList.remove('calculating'), 500);
            
            const prev = parseFloat(previousOperand);
            const current = parseFloat(currentOperand);
            let result;

            switch (operation) {
                case '+':
                    result = prev + current;
                    break;
                case '-':
                    result = prev - current;
                    break;
                case '*':
                    result = prev * current;
                    break;
                case '/':
                    if (current === 0) {
                        showError('Cannot divide by zero');
                        clearAll();
                        return;
                    }
                    result = prev / current;
                    break;
                case '%':
                    result = prev % current;
                    break;
                default:
                    return;
            }

            // Round to avoid floating point errors //
            result = Math.round(result * 100000000) / 100000000;
            
            currentOperand = result.toString();
            operation = null;
            previousOperand = '';
            updateDisplay();
        }

        function clearAll() {
            currentOperand = '0';
            previousOperand = '';
            operation = null;
            updateDisplay();
            addButtonFeedback();
        }

        function deleteDigit() {
            if (currentOperand.length === 1 || currentOperand === '0') {
                currentOperand = '0';
            } else {
                currentOperand = currentOperand.slice(0, -1);
            }
            updateDisplay();
            addButtonFeedback();
        }

        function showError(message) {
            const currentElement = document.getElementById('current');
            const originalText = currentElement.textContent;
            currentElement.textContent = 'Error';
            currentElement.style.color = '#ef4444';
            
            setTimeout(() => {
                currentElement.style.color = '#212529';
            }, 1500);
        }

        function addButtonFeedback() {

        }

        // Keyboard support Added event listener for keydown events //
        document.addEventListener('keydown', function(e) {
            e.preventDefault();
            
            if (e.key >= '0' && e.key <= '9') appendNumber(e.key);
            if (e.key === '.') appendNumber('.');
            if (e.key === '+') chooseOperator('+');
            if (e.key === '-') chooseOperator('-');
            if (e.key === '*') chooseOperator('*');
            if (e.key === '/') chooseOperator('/');
            if (e.key === '%') chooseOperator('%');
            if (e.key === 'Enter' || e.key === '=') calculate();
            if (e.key === 'Escape') clearAll();
            if (e.key === 'Backspace') deleteDigit();
        });

        // Initialize display //
        updateDisplay();