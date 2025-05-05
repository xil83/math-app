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
      // checkTest(); // Odkomentuj, aby włączyć automatyczne sprawdzanie
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
 * NOWA LOGIKA: Wynik dodawania/odejmowania musi być w zakresie 1-10.
 * @param {string} op - Typ operacji ('add', 'sub', 'mul', 'div').
 * @param {boolean} missing - Czy odpowiedź ma być brakującym składnikiem działania.
 * @returns {{text: string, answer: number}} Obiekt zawierający tekst pytania i poprawną odpowiedź.
 */
function generateQuestion(op, missing) {
  let a, b, result, text, answer, max, min;

  switch (op) {
    case "add":
      // Cel: a + b = result, gdzie 1 <= result <= 10
      result = Math.floor(Math.random() * 10) + 1; // Wynik od 1 do 10

      // Generujemy 'a' tak, aby było mniejsze lub równe 'result'
      // i potencjalnie większe, ale tak by 'b' było nieujemne
      // Aby uzyskać większe liczby jak 88+7=95, ta logika nie działa
      // Potrzebujemy podejścia odwrotnego: ustalamy wynik (1-10), jedną liczbę (np. 0-99)
      // i obliczamy drugą, upewniając się, że jest nieujemna.

      // Nowe podejście:
      result = Math.floor(Math.random() * 10) + 1; // Wynik od 1 do 10
      // Losujemy jedną z liczb (np. 'a') w szerszym zakresie, np. 0-99
      // Ale musimy zapewnić, że druga liczba ('b') też będzie sensowna (nieujemna)
      // Jeśli a + b = result (mały), to a i b muszą być małe.
      // Przykład 88+7=? ma wynik 95, co nie pasuje do 1-10.
      // Przykład 88+?=95 -> ?=7 (wynik 95, nie 7)
      // Przykład ?+7=95 -> ?=88 (wynik 95, nie 7)

      // OK, zrozumiałem inaczej. Chodzi o to, że *jedna* z liczb w działaniu jest mała (1-10),
      // a druga duża (do 100), a *wynik* może być duży?
      // Przykład: 88 + 7 = ? (wynik 95) -> tu 7 jest w zakresie 1-10
      // Przykład: 93 - 6 = ? (wynik 87) -> tu 6 jest w zakresie 1-10
      // Przykład: 76 - ? = 70 (wynik 70) -> tu szukana liczba (6) jest w zakresie 1-10

      // Zaimplementujmy to założenie: jedna liczba mała (1-10), druga duża (0-100).

      let smallNum = Math.floor(Math.random() * 10) + 1; // Liczba od 1 do 10
      let largeNum = Math.floor(Math.random() * 101); // Liczba od 0 do 100

      // Losowo przypisz smallNum i largeNum do a i b
      if (Math.random() < 0.5) {
          a = largeNum;
          b = smallNum;
      } else {
          a = smallNum;
          b = largeNum;
      }
      result = a + b; // Wynik może być > 100, ale to chyba OK? Upewnijmy się, że <= 100.

      // Poprawka: Upewnijmy się, że wynik a+b <= 100
      smallNum = Math.floor(Math.random() * 10) + 1; // 1 do 10
      largeNum = Math.floor(Math.random() * (101 - smallNum)); // 0 do 100-smallNum

      if (Math.random() < 0.5) {
          a = largeNum;
          b = smallNum;
      } else {
          a = smallNum;
          b = largeNum;
      }
      result = a + b; // Gwarantowany wynik <= 100

      if (missing && Math.random() < 0.5) { // Brakuje 'a'
        answer = a;
        text = `? + ${b} = ${result}`;
      } else if (missing) { // Brakuje 'b'
        answer = b;
        text = `${a} + ? = ${result}`;
      } else { // Brakuje wyniku
        answer = result;
        text = `${a} + ${b} = ?`;
      }
      break;

    case "sub":
      // Cel: max - min = result, gdzie szukana/podana liczba jest w zakresie 1-10
      // Przykład: 93 - 6 = ? (6 jest małe)
      // Przykład: 76 - ? = 70 (? = 6, małe)
      // Przykład: ? - 6 = 87 (? = 93) (6 jest małe)

      smallNum = Math.floor(Math.random() * 10) + 1; // Liczba od 1 do 10
      // Potrzebujemy drugiej liczby, aby wynik odejmowania był sensowny (nieujemny)
      // max - min = result >= 0

      // Podejście 1: Ustalamy małą liczbę jako 'min' (odjemnik)
      min = smallNum;
      // Losujemy wynik (może być duży?)
      // result = Math.floor(Math.random() * (101 - min)); // Wynik od 0 do 100-min
      // max = min + result;

      // Podejście 2: Ustalamy małą liczbę jako 'result' (różnica)
      // result = smallNum;
      // min = Math.floor(Math.random() * (101 - result)); // min od 0 do 100-result
      // max = min + result;

      // Podejście 3: Generujemy max i min tak, aby jedno z nich LUB różnica była mała.
      // To wydaje się najbardziej zgodne z przykładami.

      // Generujemy max i min w zakresie 0-100, z zastrzeżeniem max >= min
      max = Math.floor(Math.random() * 101); // 0 do 100
      min = Math.floor(Math.random() * (max + 1)); // 0 do max
      result = max - min;

      // Sprawdzamy, czy warunek "małej liczby" jest spełniony (min lub result <= 10)
      // Jeśli nie, generujemy ponownie. To może być nieefektywne.

      // Spróbujmy inaczej: wymuśmy, aby min LUB result było małe.
      if (Math.random() < 0.5) {
          // Wymuś mały odjemnik (min)
          min = Math.floor(Math.random() * 10) + 1; // 1 do 10
          max = Math.floor(Math.random() * (101 - min)) + min; // min do 100
      } else {
          // Wymuś małą różnicę (result)
          result = Math.floor(Math.random() * 10) + 1; // 1 do 10
          min = Math.floor(Math.random() * (101 - result)); // 0 do 100-result
          max = min + result;
      }
      result = max - min; // Oblicz wynik dla pewności

      if (missing && Math.random() < 0.5) { // Brakuje odjemnika (min)
        answer = min;
        text = `${max} - ? = ${result}`;
      } else if (missing) { // Brakuje odjemnej (max)
        answer = max;
        text = `? - ${min} = ${result}`;
      } else { // Brakuje wyniku (różnicy)
        answer = result;
        text = `${max} - ${min} = ?`;
      }
      break;

    case "mul":
      // Mnożenie - bez zmian (małe liczby)
      a = Math.floor(Math.random() * 11); // 0 do 10
      b = Math.floor(Math.random() * 11); // 0 do 10
      result = a * b;

      if (missing && Math.random() < 0.5) { // Brakuje 'a'
        answer = a;
        if (b === 0 && result === 0) { // Unikaj ? * 0 = 0
            b = Math.floor(Math.random() * 10) + 1;
            result = a * b;
        }
        text = `? × ${b} = ${result}`;
      } else if (missing) { // Brakuje 'b'
         answer = b;
         if (a === 0 && result === 0) { // Unikaj 0 * ? = 0
            a = Math.floor(Math.random() * 10) + 1;
            result = a * b;
         }
         text = `${a} × ? = ${result}`;
      } else { // Brakuje wyniku
        answer = result;
        text = `${a} × ${b} = ?`;
      }
      break;

    case "div":
      // Dzielenie - bez zmian (wynik całkowity, małe liczby)
      b = Math.floor(Math.random() * 10) + 1; // Dzielnik (b) od 1 do 10
      result = Math.floor(Math.random() * 11); // Wynik (iloraz) od 0 do 10
      a = b * result; // Dzielna (a)

      if (missing && Math.random() < 0.5) { // Brakuje dzielnika (b)
        answer = b;
        text = `${a} ÷ ? = ${result}`;
      } else if (missing) { // Brakuje dzielnej (a)
        answer = a;
        text = `? ÷ ${b} = ${result}`;
      } else { // Brakuje wyniku (ilorazu)
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
  if (percent >= 95) grade = 6;
  else if (percent >= 85) grade = 5;
  else if (percent >= 70) grade = 4;
  else if (percent >= 55) grade = 3;
  else if (percent >= 40) grade = 2;
  else grade = 1;

  // Wyświetlenie wyniku końcowego
  resultDiv.innerHTML = `<h2>Poprawnych odpowiedzi: ${correct}/${totalQuestions} (${percent.toFixed(0)}%)<br>Ocena: <strong>${grade}</strong></h2>`;
}

// Dodanie nasłuchiwaczy zdarzeń (jeśli nie są dodane w HTML przez atrybuty onclick)
// Upewnij się, że masz przycisk z id="generate-button" w HTML, jeśli chcesz go użyć
// const generateButton = document.getElementById('generate-button');
// if (generateButton) {
//     generateButton.addEventListener('click', generateTest);
// }
// checkButton.addEventListener('click', checkTest); // Zakładając, że przycisk checkButton istnieje

// Początkowe ukrycie przycisku sprawdzania (jeśli test nie jest generowany od razu po załadowaniu strony)
// checkButton.style.display = "none";
