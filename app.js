const mainScreen = document.querySelector('.main-screen')
const pokeName = document.querySelector('.poke-name');
const pokeId = document.querySelector('.poke-id');
const pokeFrontImage = document.querySelector('.poke-front-image');
const pokeBackImage = document.querySelector('.poke-back-image');
const pokeTypeOne = document.querySelector('.poke-type-one');
const pokeTypeTwo = document.querySelector('.poke-type-two');
const pokeHeight = document.querySelector('.poke-height');
const pokeWeight = document.querySelector('.poke-weight');
const pokeListItems = document.querySelectorAll('.list-item');
const pokeLeftButton = document.querySelector('.left-button');
const pokeRightButton = document.querySelector('.right-button');


// CONSTANTS AND VARIABLES

const TYPES = [
    'normal', 'fighting', 'flying', 'poison', 'ground', 'rock', 'bug', 'ghost', 'steel', 'fire'
    , 'water', 'grass', 'electric', 'psychic', 'ice', 'dragon', 'dark', 'fairy'
];

let prevUrl=null;
let nextUrl=null;

// FUNCTIONS

const resetScreen = () => {
    mainScreen.classList.remove('hide');
    for (const type of TYPES){
        if (type !== 'main-screen') {
            mainScreen.classList.remove(type);
        }
    }
}



const fetchPokeList = (url) => {

    // getting data for right side of the pokedex

    fetch(url)
        .then(res => res.json())
        .then(data => {

            const { results, previous, next } = data;
            prevUrl = previous;
            nextUrl = next;

            for(let i = 0; i<pokeListItems.length; i++) {
                const pokeListItem = pokeListItems[i];
                const resultData = results[i];


                if (resultData){
                    const {name, url} = resultData;
                    const urlArray = url.split('/');
                    const id = urlArray[urlArray.length - 2];
                    pokeListItem.textContent = `${id}. ${toTitleCase(name)}`;

                } else{
                    pokeListItem.textContent = '';
                }
            }



        });

}

const fetchPokeData = (id) => {

    // get data for the left side of the pokedex

    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
        .then(res => res.json())
        .then(data => {

            resetScreen();


            const pokeTypes = data['types'];
            const dataFirstType = pokeTypes[0];
            const dataSecondType = pokeTypes[1];
            pokeTypeOne.textContent = toTitleCase(dataFirstType['type']['name']);
            if (dataSecondType){
                pokeTypeTwo.classList.remove('hide');
                pokeTypeTwo.textContent = toTitleCase(dataSecondType['type']['name']);

            } else{
                pokeTypeTwo.classList.add('hide');
            }

            pokeName.textContent = toTitleCase(data['name']);
            pokeId.textContent = "#" + data['id'].toString().padStart(3,'0');
            pokeWeight.textContent = data['weight'];
            pokeHeight.textContent = data['height'];
            pokeFrontImage.src = data['sprites']['front_default'] || '';
            pokeBackImage.src = data['sprites']['back_default'] || '';

            let isFirstType = true;
            mainScreen.classList.add(dataFirstType['type']['name']);
            if (dataSecondType){
                setInterval(() => {
                    if (isFirstType) {
                        mainScreen.classList.remove(dataFirstType['type']['name']);
                        mainScreen.classList.add(dataSecondType['type']['name']);

                    } else {
                        mainScreen.classList.remove(dataSecondType['type']['name']);
                        mainScreen.classList.add(dataFirstType['type']['name']);
                    }
                    isFirstType = !isFirstType;
                }, 3000);

            } else {
                // mainScreen.classList.add(dataFirstType['type']['name']);


            }

        })
        .catch(error =>{
            console.error(error);
        });
}

const handRightButtonClick = () =>{
    if (nextUrl){
        fetchPokeList(nextUrl);
    }

}

const handleLeftButtonClick = () => {
    if (prevUrl){
        fetchPokeList(prevUrl);
    }
}

const handleListItemClick = (e) => {
    if (!e.target) return;
    const listItem = e.target;
    if (!listItem.textContent) return;
    const id = listItem.textContent.split('.')[0];
    fetchPokeData(id);
}

function toTitleCase(str) {
    return str.toLowerCase().split(' ').map(function (word) {
        return (word.charAt(0).toUpperCase() + word.slice(1));
    }).join(' ');
}



// EVENT LISTENERS

pokeLeftButton.addEventListener('click', handleLeftButtonClick);

pokeRightButton.addEventListener('click', handRightButtonClick);

for (const pokeListItem of pokeListItems){
    pokeListItem.addEventListener('click', handleListItemClick);
}

//INITIALIZING THE APP
fetchPokeList("https://pokeapi.co/api/v2/pokemon?offset=0&limit=20")
