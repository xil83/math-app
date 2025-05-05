const form = document.getElementById("test-form");
const resultDiv = document.getElementById("result");
const checkButton = document.getElementById("check-button");

let timerInterval;
function startTimer(duration = 300) {
  clearInterval(timerInterval);
  const timerEl = document.getElementById("timer");
  let time = duration;

  function updateTimer() {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    timerEl.textContent = `⏱ ${minutes}:${seconds.toString().padStart(2, '0')}`;
    if (time <= 0) {
      clearInterval(timerInterval);
      timerEl.textContent = "⏱ Czas minął!";
    }
    time--;
  }

  updateTimer();
  timerInterval = setInterval(updateTimer, 1000);
}

function generateTest() {
  form.innerHTML = "";
  resultDiv.innerHTML = "";
  checkButton.style.display = "block";

  const operation = document.getElementById("operation").value;

  form.classList.add("grid"); // dodajemy klasę siatki (patrz style.css)

  for (let i = 0; i < 30; i++) {
    let op = operation === "mix" ? getRandomOperation() : operation;
    const isMissing = Math.random() < 0.5;
    const question = generateQuestion(op, isMissing);

    const div = document.createElement("div");
    div.classList.add("question-cell");

    div.innerHTML = `
      <span>${question.text}</span>
      <input type="number" name="q${i}" data-answer="${question.answer}" required>
      <span class="correction" style="display:none; color: red; margin-left: 10px;"></span>
    `;
    form.appendChild(div);
  }
startTimer();
}

function getRandomOperation() {
  const ops = ["add", "sub", "mul", "div"];
  return ops[Math.floor(Math.random() * ops.length)];
}

function generateQuestion(op, missing) {
  let a = Math.floor(Math.random() * 10) + 1;
  let b = Math.floor(Math.random() * 10) + 1;
  let text = "", answer;

  switch (op) {
    case "add":
      if (missing) {
        answer = a;
        text = `? + ${b} = ${a + b}`;
      } else {
        answer = a + b;
        text = `${a} + ${b} = ?`;
      }
      break;
    case "sub":
      let max = Math.max(a, b), min = Math.min(a, b);
      if (missing) {
        answer = min;
        text = `${max} - ? = ${max - min}`;
      } else {
        answer = max - min;
        text = `${max} - ${min} = ?`;
      }
      break;
    case "mul":
      if (missing) {
        answer = a;
        text = `? × ${b} = ${a * b}`;
      } else {
        answer = a * b;
        text = `${a} × ${b} = ?`;
      }
      break;
    case "div":
      let result = a;
      a = a * b;
      if (missing) {
        answer = b;
        text = `${a} ÷ ? = ${result}`;
      } else {
        answer = result;
        text = `${a} ÷ ${b} = ?`;
      }
      break;
  }

  return { text, answer };
}

function checkTest() {
  let correct = 0;
  const inputs = form.querySelectorAll("input");

  inputs.forEach(input => {
    const userAnswer = parseInt(input.value);
    const correctAnswer = parseInt(input.dataset.answer);
    const correctionEl = input.nextElementSibling;

    if (userAnswer === correctAnswer) {
      correct++;
      input.style.borderColor = "green";
    } else {
      input.style.borderColor = "red";
      correctionEl.style.display = "inline";
      correctionEl.textContent = `Poprawna: ${correctAnswer}`;
    }
  });

  const percent = (correct / 25) * 100;
  let grade;

  if (percent === 100) grade = 6;
  else if (percent >= 90) grade = 5;
  else if (percent >= 75) grade = 4;
  else if (percent >= 60) grade = 3;
  else if (percent >= 50) grade = 2;
  else grade = 1;

  resultDiv.innerHTML = `<h2>Poprawnych odpowiedzi: ${correct}/30 (${percent.toFixed(0)}%)<br>Ocena: <strong>${grade}</strong></h2>`;
}
