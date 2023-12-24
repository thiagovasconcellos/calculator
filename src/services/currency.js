const fetchCurrencyData = async (selectedCurrency, conversionCurrency) => {
  const apiUrl = `https://economia.awesomeapi.com.br/json/last/${selectedCurrency}-${conversionCurrency}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    const key = `${selectedCurrency}${conversionCurrency}`;
    const currencyData = data[key];

    return {
      ask: currencyData.ask,
      date: Date.now()
    };
  } catch (error) {
    console.error("Erro ao buscar dados de cotação:", error);
    return null;
  }
};

export default fetchCurrencyData;
