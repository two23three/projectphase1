let url = 'https://api.coincap.io/v2/assets'
const form = document.getElementById('form')
let imgurl ='https://assets.coincap.io/assets/icons/{}@2x.png'
document.addEventListener('DOMContentLoaded', () => {
    

form.addEventListener('submit', (event) => {
    event.preventDefault()

    const id = document.getElementById('search').value

     fetch(`${url}/${id}`)
    .then(response=> response.json())

const getCoins=(id)=>{

    fetch(`${url}/${id}`)
    .then(response=> response.json())
    .then(data=> {
        console.log(data.data)
    })

    fetch (`imgurl/${symbol}@2x.png`)
}
getCoins(`${id}`)

})




})