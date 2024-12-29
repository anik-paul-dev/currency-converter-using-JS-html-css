const apiUrl = "https://open.er-api.com/v6/latest/";
let historyList = [];

async function fetchCurrencies() {
  try {
    const response = await fetch(apiUrl + "USD");
    const data = await response.json();
    const currencies = Object.keys(data.rates);

    const fromCurrency = document.getElementById("fromCurrency");
    const toCurrency = document.getElementById("toCurrency");

    currencies.forEach(currency => {
      const option = document.createElement("option");
      option.value = currency;
      option.textContent = currency;
      fromCurrency.appendChild(option.cloneNode(true));
      toCurrency.appendChild(option);
    });
  } catch (error) {
    alert("Error fetching currency data. Please try again later.");
  }
}

async function convertCurrency(event) {
  event.preventDefault();

  const amount = parseFloat(document.getElementById("amount").value);
  const fromCurrency = document.getElementById("fromCurrency").value;
  const toCurrency = document.getElementById("toCurrency").value;

  if (isNaN(amount) || amount <= 0) {
    alert("Please enter a valid amount.");
    return;
  }

  try {
    const response = await fetch(`${apiUrl}${fromCurrency}`);
    const data = await response.json();

    if (data.rates[toCurrency]) {
      const rate = data.rates[toCurrency];
      const result = (amount * rate).toFixed(2);
      document.getElementById("result").textContent = `${amount} ${fromCurrency} = ${result} ${toCurrency}`;

      // Save to history
      const historyItem = `${amount} ${fromCurrency} = ${result} ${toCurrency}`;
      historyList.push(historyItem);
      updateHistory();
    } else {
      alert("Currency not supported.");
    }
  } catch (error) {
    alert("Error fetching conversion rate. Please try again later.");
  }
}

function updateHistory() {
  const historyElement = document.getElementById("history");
  historyElement.innerHTML = "";

  historyList.slice(-10).forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    li.className = "list-group-item";
    historyElement.appendChild(li);
  });
}

document.getElementById("currency-form").addEventListener("submit", convertCurrency);

// Initialize on page load
fetchCurrencies();
