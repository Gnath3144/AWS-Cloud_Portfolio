// main.js — AWS Portfolio Enhancement Layer
// Typing effect runs only if the legacy .hero-text span element exists.
// All primary logic lives in script.js
document.addEventListener('DOMContentLoaded', () => {
    const targetElement = document.querySelector('.hero-text span');
    if (!targetElement) return; // Guard: element doesn't exist in current layout

    const keywords = [
        'Cloud Infrastructure',
        'AWS Architecture',
        'CI/CD Pipelines',
        'Kubernetes (EKS)',
        'Serverless Pipelines',
        'FinOps & Cost Savings'
    ];
    let count = 0, index = 0;

    (function type() {
        if (count === keywords.length) count = 0;
        const currentText = keywords[count];
        const letter = currentText.slice(0, ++index);
        targetElement.textContent = letter;
        if (letter.length === currentText.length) {
            count++;
            index = 0;
            setTimeout(type, 2200);
        } else {
            setTimeout(type, 90);
        }
    })();
});