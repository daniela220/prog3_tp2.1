class Currency {
    constructor(code, name) {
        this.code = code;
        this.name = name;
    }
}

class CurrencyConverter {
    constructor(apiUrl) {
        this.apiUrl = "https://www.frankfurter.app/";
        this.currencies = [];
    }


    //obtiene lista de códigos de monedas disponibles
    async getCurrencies() {
        try{
            const response = await fetch(`${this.apiUrl}/currencies`); 
            const data = await response.json(); //amount, base, date, rates
            this.currencies = Object.entries(data).map( 
                ([code, name]) => new Currency(code, name)
            );
            // Object convierte de json a ["clave","valor"]
        }
        catch(error){
            console.error('Error', error)
        }
    }

    //obtiene conversiòn de moneda
    async convertCurrency(amount, fromCurrency, toCurrency) {
        if (fromCurrency == toCurrency){
            return amount;
        }
        try{
            const response = await fetch(
                `${this.apiUrl}/latest?amount=${amount}&from=${fromCurrency.code}&to=${toCurrency.code}`
            );
            const data = await response.json();
            return data.rates[toCurrency.code];
        }
        catch (error) {
            console.error('Error', error);
            return null;
        }
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    const form = document.getElementById("conversion-form");
    const resultDiv = document.getElementById("result");
    const fromCurrencySelect = document.getElementById("from-currency");
    const toCurrencySelect = document.getElementById("to-currency");

    const converter = new CurrencyConverter("https://api.frankfurter.app");

    await converter.getCurrencies();
    populateCurrencies(fromCurrencySelect, converter.currencies);
    populateCurrencies(toCurrencySelect, converter.currencies);

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const amount = document.getElementById("amount").value;
        const fromCurrency = converter.currencies.find(
            (currency) => currency.code === fromCurrencySelect.value
        );
        const toCurrency = converter.currencies.find(
            (currency) => currency.code === toCurrencySelect.value
        );

        const convertedAmount = await converter.convertCurrency(
            amount,
            fromCurrency,
            toCurrency
        );

        if (convertedAmount !== null && !isNaN(convertedAmount)) {
            resultDiv.textContent = `${amount} ${
                fromCurrency.code
            } son ${convertedAmount.toFixed(2)} ${toCurrency.code}`;
        } else {
            resultDiv.textContent = "Error al realizar la conversión.";
        }
    });

    function populateCurrencies(selectElement, currencies) {
        if (currencies) {
            currencies.forEach((currency) => {
                const option = document.createElement("option");
                option.value = currency.code;
                option.textContent = `${currency.code} - ${currency.name}`;
                selectElement.appendChild(option);
            });
        }
    }
});
/*Recorda:
?: indica comienzo de consulta
c=v
& separa los pares clave valor*


API querty parameters: amount, from, to

ej:{"amount":25.0,"base":"AUD","date":"2024-06-07","rates":{"BRL":87.43}}*/