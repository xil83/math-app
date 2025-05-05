let num1, num2, correctAnswer;
generateQuestion();

document.getElementById("operation").addEventListener("change", generateQuestion);

function generateQuestion() {
  const operation = document.getElementById("operation").value;
  num1 = Math.floor(Math.random() * 10) + 1;
  num2 = Math.floor(Math.random() * 10) + 1;
  let question = "";

  switch (operation) {
    case "add":
      correctAnswer = num1 + num2;
      question = `${num1} + ${num2} = ?`;
      break;
    case "sub":
      [num1, num2] = [Math.max(num1, num2), Math.min(num1, num2)];
      correctAnswer = num1 - num2;
      question = `${num1} - ${num2} = ?`;
      break;
    case "mul":
      correctAnswer = num1 * num2;
      question = `${num1} × ${num2} = ?`;
      break;
    case "div":
      correctAnswer = num1;
      num1 = num1 * num2; // żeby dzielenie było całkowite
      question = `${num1} ÷ ${num2} = ?`;
      break;
  }

  document.getElementById("question").textContent = question;
  document.getElementById("feedback").textContent = "";
  document.getElementById("answer").value = "";
}

function checkAnswer() {
  const userAnswer = parseInt(document.getElementById("answer").value);
  const feedback = document.getElementById("feedback");

  if (userAnswer === correctAnswer) {
    feedback.textContent = "Brawo! Dobrze!";
    feedback.style.color = "green";
  } else {
    feedback.textContent = `Niestety, poprawna odpowiedź to ${correctAnswer}`;
    feedback.style.color = "red";
  }

  setTimeout(generateQuestion, 2000);
}
