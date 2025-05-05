// Pobranie elementów DOM
const form = document.getElementById("test-form");
const resultDiv = document.getElementById("result");
const checkButton = document.getElementById("check-button");
const timerEl = document.getElementById("timer"); // Dodano pobranie elementu timera

let timerInterval; // Zmienna do przechowywania interwału timera

/**
 * Uruchamia lub resetuje timer odliczający czas na rozwiązanie testu.
 * @param {number} [duration=300] - Czas trwania w sekundach (domyślnie 5 minut).
 */
function startTimer(duration = 300) {
  clearInterval(timerInterval); // Wyczyszczenie poprzedniego interwału, jeśli istnieje
  let time = duration;

  function updateTimer() {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    // Aktualizacja wyświetlanego czasu
    timerEl.textContent = `⏱ ${minutes}:${seconds.toString().padStart(2, '0')}`;

    // Sprawdzenie, czy czas się skończył
    if (time <= 0) {
      clearInterval(timerInterval);
      timerEl.textContent = "⏱ Czas minął!";
      // Można dodać automatyczne sprawdzanie testu po upływie czasu
      // checkTest();
      // checkButton.disabled = true; // Wyłączenie przycisku sprawdzania
    }
    time--; // Zmniejszenie pozostałego czasu
  }

  updateTimer(); // Natychmiastowe wywołanie, aby pokazać czas początkowy
  timerInterval = setInterval(updateTimer, 1000); // Ustawienie interwału na 1 sekundę
}

/**
 * Generuje nowy test matematyczny na podstawie wybranej operacji.
 */
function generateTest() {
  form.innerHTML = ""; // Wyczyszczenie poprzednich pytań
  resultDiv.innerHTML = ""; // Wyczyszczenie poprzednich wyników
  checkButton.style.display = "block"; // Pokazanie przycisku sprawdzania
  checkButton.disabled = false; // Upewnienie się, że przycisk jest aktywny

  const operation = document.getElementById("operation").value; // Pobranie wybranej operacji

  form.classList.add("grid"); // Dodanie klasy CSS do formularza dla układu siatki

  // Wygenerowanie 30 pytań
  for (let i = 0; i < 30; i++) {
    // Wybór operacji: losowa jeśli 'mix', inaczej wybrana
    let op = operation === "mix" ? getRandomOperation() : operation;
    // Losowe określenie, czy odpowiedź ma być brakującym składnikiem działania
    const isMissing = Math.random() < 0.5;
    // Wygenerowanie pytania
    const question = generateQuestion(op, isMissing);

    // Utworzenie elementu div dla pytania
    const div = document.createElement("div");
    div.classList.add("question-cell"); // Dodanie klasy CSS

    // Ustawienie zawartości HTML dla komórki pytania
    div.innerHTML = `
      <span>${question.text}</span>
      <input type="number" name="q${i}" data-answer="${question.answer}" required>
      <span class="correction" style="display:none; color: red; margin-left: 10px;"></span>
    `;
    form.appendChild(div); // Dodanie komórki do formularza
  }
  startTimer(); // Rozpoczęcie odliczania czasu
}

/**
 * Zwraca losową operację matematyczną ('add', 'sub', 'mul', 'div').
 * @returns {string} Nazwa losowej operacji.
 */
function getRandomOperation() {
  const ops = ["add", "sub", "mul", "div"];
  return ops[Math.floor(Math.random() * ops.length)];
}

/**
 * Generuje pojedyncze pytanie matematyczne.
 * @param {string} op - Typ operacji ('add', 'sub', 'mul', 'div').
 * @param {boolean} missing - Czy odpowiedź ma być brakującym składnikiem działania.
 * @returns {{text: string, answer: number}} Obiekt zawierający tekst pytania i poprawną odpowiedź.
 */
function generateQuestion(op, missing) {
  let a, b, result, text, answer;

  switch (op) {
    case "add":
      // Generowanie liczb dla dodawania w zakresie 0-100
      // a + b <= 100
      a = Math.floor(Math.random() * 101); // a od 0 do 100
      b = Math.floor(Math.random() * (101 - a)); // b od 0 do 100-a
      result = a + b;

      if (missing && Math.random() < 0.5) { // Losowo wybieramy, która liczba jest brakująca (a czy b)
        // Brakuje 'a'
        answer = a;
        text = `? + ${b} = ${result}`;
      } else if (missing) {
        // Brakuje 'b'
        answer = b;
        text = `${a} + ? = ${result}`;
      } else {
        // Brakuje wyniku
        answer = result;
        text = `${a} + ${b} = ?`;
      }
      break;

    case "sub":
      // Generowanie liczb dla odejmowania w zakresie 0-100
      // max - min >= 0 (max i min w zakresie 0-100)
      let max = Math.floor(Math.random() * 101); // max od 0 do 100
      let min = Math.floor(Math.random() * (max + 1)); // min od 0 do max
      result = max - min;

      if (missing && Math.random() < 0.5) { // Losowo wybieramy, czy brakuje odjemnej czy odjemnika
         // Brakuje odjemnika (min)
        answer = min;
        text = `${max} - ? = ${result}`;
      } else if (missing) {
         // Brakuje odjemnej (max) - rzadziej spotykane, ale możliwe
         answer = max;
         text = `? - ${min} = ${result}`;
      }
      else {
        // Brakuje wyniku (różnicy)
        answer = result;
        text = `${max} - ${min} = ?`;
      }
      break;

    case "mul":
      // Mnożenie - zachowujemy mniejsze liczby dla prostoty
      a = Math.floor(Math.random() * 11); // 0 do 10
      b = Math.floor(Math.random() * 11); // 0 do 10
      result = a * b;

      if (missing && Math.random() < 0.5) {
        // Brakuje 'a'
        answer = a;
        // Zapobiegamy dzieleniu przez 0 w pytaniu ? * 0 = 0
        if (b === 0 && result === 0) {
            b = Math.floor(Math.random() * 10) + 1; // Losujemy b od 1 do 10
            result = a * b; // Obliczamy nowy wynik
            text = `? × ${b} = ${result}`;
        } else {
            text = `? × ${b} = ${result}`;
        }
      } else if (missing) {
         // Brakuje 'b'
         answer = b;
         // Zapobiegamy dzieleniu przez 0 w pytaniu a * ? = 0
         if (a === 0 && result === 0) {
            a = Math.floor(Math.random() * 10) + 1; // Losujemy a od 1 do 10
            result = a * b; // Obliczamy nowy wynik
            text = `${a} × ? = ${result}`;
         } else {
            text = `${a} × ? = ${result}`;
         }
      } else {
        // Brakuje wyniku
        answer = result;
        text = `${a} × ${b} = ?`;
      }
      break;

    case "div":
      // Dzielenie - upewniamy się, że wynik jest liczbą całkowitą
      // Dzielna = Dzielnik * Wynik
      b = Math.floor(Math.random() * 10) + 1; // Dzielnik (b) od 1 do 10 (unikamy dzielenia przez 0)
      result = Math.floor(Math.random() * 11); // Wynik (iloraz) od 0 do 10
      a = b * result; // Dzielna (a)

      if (missing && Math.random() < 0.5) {
        // Brakuje dzielnika (b)
        answer = b;
        text = `${a} ÷ ? = ${result}`;
      } else if (missing) {
        // Brakuje dzielnej (a)
        answer = a;
        text = `? ÷ ${b} = ${result}`;
      } else {
        // Brakuje wyniku (ilorazu)
        answer = result;
        text = `${a} ÷ ${b} = ?`;
      }
      break;
  }

  return { text, answer }; // Zwrócenie tekstu pytania i odpowiedzi
}

/**
 * Sprawdza odpowiedzi użytkownika, oznacza poprawne/błędne i wyświetla wynik.
 */
function checkTest() {
  clearInterval(timerInterval); // Zatrzymanie timera po sprawdzeniu
  checkButton.disabled = true; // Wyłączenie przycisku po sprawdzeniu

  let correct = 0; // Licznik poprawnych odpowiedzi
  const inputs = form.querySelectorAll("input"); // Pobranie wszystkich pól input

  inputs.forEach(input => {
    // Sprawdzenie każdego inputu
    const userAnswer = parseInt(input.value); // Odpowiedź użytkownika
    const correctAnswer = parseInt(input.dataset.answer); // Poprawna odpowiedź z atrybutu data
    const correctionEl = input.nextElementSibling; // Element do wyświetlania korekty

    input.disabled = true; // Wyłączenie pola po sprawdzeniu

    // Porównanie odpowiedzi
    if (!isNaN(userAnswer) && userAnswer === correctAnswer) {
      // Poprawna odpowiedź
      correct++;
      input.style.borderColor = "green"; // Zaznaczenie na zielono
      correctionEl.style.display = "none"; // Ukrycie miejsca na korektę
    } else {
      // Błędna odpowiedź lub brak odpowiedzi
      input.style.borderColor = "red"; // Zaznaczenie na czerwono
      correctionEl.style.display = "inline"; // Pokazanie miejsca na korektę
      // Wyświetlenie poprawnej odpowiedzi, jeśli użytkownik coś wpisał, ale błędnie
      if (!isNaN(userAnswer)) {
           correctionEl.textContent = `Poprawna: ${correctAnswer}`;
      } else {
           correctionEl.textContent = `Brak odp. (Poprawna: ${correctAnswer})`;
      }
    }
  });

  // Obliczenie procentu poprawnych odpowiedzi
  const totalQuestions = inputs.length; // Całkowita liczba pytań
  const percent = totalQuestions > 0 ? (correct / totalQuestions) * 100 : 0;
  let grade; // Ocena

  // Ustalenie oceny na podstawie procentu
  if (percent >= 95) grade = 6; // Zmieniono progi dla 6
  else if (percent >= 85) grade = 5; // Zmieniono progi dla 5
  else if (percent >= 70) grade = 4; // Zmieniono progi dla 4
  else if (percent >= 55) grade = 3; // Zmieniono progi dla 3
  else if (percent >= 40) grade = 2; // Zmieniono progi dla 2
  else grade = 1;

  // Wyświetlenie wyniku końcowego
  resultDiv.innerHTML = `<h2>Poprawnych odpowiedzi: ${correct}/${totalQuestions} (${percent.toFixed(0)}%)<br>Ocena: <strong>${grade}</strong></h2>`;
}

// Dodanie nasłuchiwaczy zdarzeń (jeśli nie są dodane w HTML)
// document.getElementById('generate-button').addEventListener('click', generateTest);
// checkButton.addEventListener('click', checkTest);

// Początkowe ukrycie przycisku sprawdzania (jeśli test nie jest generowany od razu)
// checkButton.style.display = "none";
