const input = document.querySelector("input");
const debouncedValue = document.getElementById("debouncedValue");
const inputValue = document.getElementById("value");

input.addEventListener("input", updateValue);

const handler = updateValueDebounced(updateValue1, 2000);
input.addEventListener("input", handler);

function updateValue(e) {
  console.log("updating value");
  inputValue.textContent = e.target.value;
}

function updateValue1(e) {
  debouncedValue.textContent = e.target.value;
}

function updateValueDebounced(fn, delay) {
  let timeoutId;
  console.log(" debounced call");
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

// debounce seacrh Practice

const searchInput = document.getElementById("searchInput");
const results = document.getElementById("results");

searchInput.addEventListener("input", debounce(handleSearch, 1000));

function handleSearch(event) {
  const query = event.target.value;
  // Simulate an API call with a timeout
  console.log("Searching for:", query);
  setTimeout(() => {
    const fakeResults = [
      "apple",
      "banana",
      "orange",
      "grape",
      "watermelon",
      "kiwi",
      "mango",
      "mango smoothie",
      "strawberry",
    ].filter((item) => item.includes(query.toLowerCase()));
    displayResults(fakeResults);
  }, 300);
}

function displayResults(items) {
  results.innerHTML = "";
  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    results.appendChild(li);
  });
}

function debounce(fn, delay) {
  let timeoutId;
  console.log("+++++++++debounce call+++++++++");
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

// Debounce keypress and keyup events
const inputField = document.querySelector("input");

const debouncedKeyPressHandler = debounce(handleKeyPress, 500);
const debouncedKeyUpHandler = debounce(handleKeyUp, 500);

inputField.addEventListener("keypress", debouncedKeyPressHandler);
inputField.addEventListener("keyup", debouncedKeyUpHandler);

function handleKeyPress(event) {
  console.log("Key Pressed:", event.key);
  // You can add your logic here for keypress event
}

function handleKeyUp(event) {
  console.log("Key Released:", event.key);
  // You can add your logic here for keyup event
}

const throttle = (func, limit) => {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};


const container = document.getElementById("throttle-container");
// const handleScroll = function () {
//   console.log("scrolling...");
// };

const handleScroll = throttle(() => {
  const scrollTop = window.scrollY;
  console.log("Scroll position:", scrollTop);

  // Expensive calculations
  if (scrollTop > 500) {
    console.log("User scrolled past 500px");
  }
}, 500);

container.addEventListener("scroll", handleScroll);
