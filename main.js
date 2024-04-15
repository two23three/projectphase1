let url = 'https://api.coincap.io/v2/assets'
const form = document.getElementById('form')
const showTopCoins = document.getElementById('showTopCoins');

document.addEventListener('DOMContentLoaded', () => {
    

form.addEventListener('submit', (event) => {
    event.preventDefault()

    const id = document.getElementById('search').value
     displayCoins(id)

})
showTopCoins.addEventListener('click', async() => {
    await displayTop10()

})

//this function gets the data of the coins from the api
//it is usee to get data of any coin in the api
const displayCoins = async (id) => {
   // create objects to hold the crypto data
   
    try {
        response = await getCoins(id)
        const data =  response.data
        
        const container = document.getElementById('crypto-container')
        container.innerHTML =''

        const nameElement = document.createElement('h2')
        nameElement.textContent = data.name

        const imageElement = document.createElement('img')
        imageElement.src = imgurl = `https://assets.coincap.io/assets/icons/${data.symbol.toLowerCase()}@2x.png`
       
        const symbolElement = document.createElement('p')
        symbolElement.textContent = `Symbol: ${data.symbol}`

        const priceElement = document.createElement('p')
        priceElement.textContent = `Price in USD: ${data.priceUsd}`
        
    
         const kshPrice = await convertToksh(data.priceUsd);
         const kshPriceElement = document.createElement('p');
         kshPriceElement.textContent = `Price in KES: ${kshPrice.toFixed(2)}`;
      //add the elements into the container
         container.append(nameElement, imageElement, symbolElement, priceElement, kshPriceElement)
        
         await displayHistoryOfCoin(id);
    } catch (error) {
        
      console.error("error",error)
    } 
}


//this function gets the data of the coins from the api
const getCoins= async(id)=>{


    try {
        const response = await fetch(`${url}/${id}`)
        if (!response.ok) {
            throw new Error('Failed to fetch')
        }
        return response.json()
}catch (error) {
    console.error("error getting coins",error)
 } //debug statement
}

// this function displays the top ten coins
const displayTop10 = async () => {

    try {
        //if you wanted to display more than 10 coins then you can change the limit
        const response = await fetch(`${url}?limit=10&order=rank`);
        
        //if the response is not ok then an error is shown
        
        if (!response.ok) {
            throw new Error('Failed to fetch');
        }
        const data = await response.json();
        const coins = data.data;
        const container = document.getElementById('crypto-container');
        container.innerHTML = '';
      //for each coin it creates elements to display their properties
        coins.forEach( async (coin) => {
            const coinName = document.createElement('h2');
            coinName.textContent = coin.name

            const imageElement = document.createElement('img')
            imageElement.src = imgurl = `https://assets.coincap.io/assets/icons/${coin.symbol.toLowerCase()}@2x.png`

            const symbolElement = document.createElement('p')
            symbolElement.textContent = `Symbol: ${coin.symbol}`

            const priceElement = document.createElement('p')
            priceElement.textContent = `Price in USD: ${coin.priceUsd}`

            const coinCointainer = document.createElement('div')
            coinCointainer.classList.add('coin')
             
              //this part converts the price of the coin to kes using the convertToksh function
              const kshPrice = await convertToksh(coin.priceUsd);
              const kshPriceElement = document.createElement('p');
              kshPriceElement.textContent = `Price in KES: ${kshPrice.toFixed(2)}`;
  
            coinCointainer.append(coinName, imageElement, symbolElement, priceElement, kshPriceElement)
            container.appendChild(coinCointainer)
        })
    } catch (error) {
        // debug statement
        console.error("error displaying top 10",error);
    }

}

//this function handles the conversion of the price in usd to ksh
const convertToksh = async(priceUsd) => {
    try {
        //accses another api to get cnversion rates
        const exchangeRateResponse = await fetch(' https://open.er-api.com/v6/latest/USD');
   
        if (!exchangeRateResponse.ok) {
        throw new Error('Failed to fetch');
    }
    const data = await exchangeRateResponse.json();
   
    const kshRate = data.rates.KES
    // convert the price in usd to ksh
    const kshPrice = priceUsd * kshRate  
    return kshPrice

    } catch (error) {
       //debug statement
        console.error("error converting to ksh",error);
        throw error;
    }
}
// get the elements required for the next function

const displayHistoryOfCoin = async (id) => {
    try {
          // this part helps us get the cost of the cryptocurrency each day for the past 12 months
          const endDate = new Date();
          const startDate = new Date(endDate); // Start date is initially the same as end date
          startDate.setMonth(startDate.getMonth() - 12); // Adjust start date to 12 months ago
          //while using the api the highest time able to be retrieved is 1day 
          // Convert dates to timestamps
          const startDateTimestamp = startDate.getTime();
          const endDateTimestamp = endDate.getTime();
  
          // Construct URL with start and end timestamps
          const response = await fetch(`${url}/${id}/history?interval=d1&start=${startDateTimestamp}&end=${endDateTimestamp}`);
  
       
        if (!response.ok) {
            throw new Error('Failed to fetch')
         }

         const data = await response.json();
         const historicalData = data.data;
         //log the historical data to the console for error checking
         // Calculate the average price for each month
     const monthlyPrices = {};
       
     
     const historyButton = document.getElementById('show-history-button');
     historyButton.addEventListener('click',async () => {
     
     
        historicalData.forEach(entry => {
            
        // create a date object a date object based on the entry time provided by api
        const date = new Date(entry.time);
            const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
            //extract the month and year from the date onject
            if (!monthlyPrices[monthYear]) {
              // if the month and year is not in the object then add it  
                
                monthlyPrices[monthYear] = [];
            }
            // if the month and year is in the object then add the price to the array
            monthlyPrices[monthYear].push({
                date: entry.date,
                priceUsd: entry.priceUsd
            });
        });
        
        const historyContainer = document.getElementById('history-container');
        // Display the price for each month
        historyContainer.innerHTML = '';
       // clear the content of the history container when another coin is selected
        Object.entries(monthlyPrices).forEach(([monthYear, prices]) => {
            const averagePrice = prices.reduce((total, priceEntry) => total + parseFloat(priceEntry.priceUsd), 0) / prices.length;
            console.log(`Average price for ${monthYear}: $${averagePrice.toFixed(2)}`);
    
        const monthData = document.createElement('p');
        monthData.textContent = `Average price for ${monthYear}: $${averagePrice.toFixed(2)}`;
        historyContainer.appendChild(monthData);
        });  
        });
        } catch (error) {
        console.error('error fetching historical data:', error);
        
    }
    
}
//clicking the show history button twice will hide the history container
let display= 0
let div = document.getElementById('history-container')
let button = document.getElementById('show-history-button')
button.addEventListener('click', () => {

if (display == 1){
    div.style.display = 'block';
    display=0
}else{
    div.style.display = 'none';
    display=1
}

})

})
