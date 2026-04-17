// get myFavList from localStorage if it is eleese get empty list
let myFavList = JSON.parse(localStorage.getItem("myFavourite")) || [];



const input = document.getElementById('formGroupExampleInput');
const searchButton = document.getElementById('style-button');
const outPutBox = document.getElementById('box1');
const listItems = document.getElementById('saved')

// Function to create a wishlist item
function createWishlistItem(savedItem) {
    const wishlistItem = document.createElement('div')
    wishlistItem.innerHTML = savedItem.wishlistItem;

    // Add event listeners to buttons within the wishlist item if needed
    wishlistItem.querySelector('.remove').addEventListener('click', () => {
        wishlistItem.remove();
        removeItemFromLocalStorage(savedItem);
    });

    // ... (add event listeners for other buttons if needed)

    return wishlistItem;
}

// Function to populate the wishlist section
function populateWishlist() {
    listItems.innerHTML = ''; // Clear the existing content
    myFavList.forEach((savedItem) => {
        const wishlistItem = createWishlistItem(savedItem);
        listItems.appendChild(wishlistItem);
    });
}

// Populate the wishlist section when the page loads
populateWishlist();

function updtaLocalStorage() {
    localStorage.setItem("myFavourite", JSON.stringify(myFavList))
}
// Remove Item from local storage
function removeItemFromLocalStorage(itemToRemove) {
    myFavList = myFavList.filter((savedItem) => savedItem !== itemToRemove);
    updtaLocalStorage();
}

function fetchResult(query) {
    console.log("nsjndjnjdjn")
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`)
        .then((response) => response.json())
        .then((data) => {
            outPutBox.innerHTML = '';
            if (data.meals) {
                data.meals.forEach((meal) => {
                    const mealCard = document.createElement('div');
                    mealCard.innerHTML = `<div class="card">
                            <img src="${meal.strMealThumb}" class="card-img-top" alt="${meal.strMeal}">
                            <div class="card-body">
                                <h5 class="card-title">${meal.strMeal}</h5>
                                <button class="btn btn-primary">Favorite</button>
                            </div>
                        </div>`;
                    outPutBox.appendChild(mealCard);
                    searchButton.style.backgroundColor=''
                    searchButton.style.color='';
                    input.value = '';
                    const favouriteButton = mealCard.querySelector('.btn-primary');
                    favouriteButton.addEventListener('click', (e) => {
                        favouriteButton.disabled = true;
                        const wishlistItem = document.createElement('div');
                        wishlistItem.innerHTML = `<div class="card fav-card">
                                <img src="${meal.strMealThumb}" class="card-img-top" alt="${meal.strMeal}">
                                <div class="card-body">
                                    <h5 class="card-title">${meal.strMeal} </h5><button class="button remove">Remove</button>
                                    <button class="button ingredients-button">Ingredients</button>
                                </div>
                                <div id="ingred" ;">
                                    <div class="ingredient-box">
                                        <ul class="list-group list-group-flush" id="ingredient">
                                            <li class="list-group-item disabled" aria-disabled="true">Ingredients:</li>
                            
                                        </ul>
                                    </div>
                                    <div class="ingredient-box">
                                        <ul class="list-group" id="requirement">
                                            <li class="list-group-item disabled" aria-disabled="true">Measure:</li>

                                        </ul>
                                    </div>
                                </div>
                            </div>`;

                        myFavList.push({
                            "wishlistItem": wishlistItem.innerHTML
                        }); 
                        

                        e.preventDefault();
                        listItems.appendChild(wishlistItem);
                        

                        updtaLocalStorage();

                        listItems.addEventListener('click', (e) => {
                            if (e.target.classList.contains('remove')) {
                                const wishlistItem = e.target.closest('.fav-card');
                                if (wishlistItem) {
                                    wishlistItem.remove();
                                    // Remove from myFavList and update localStorage
                                    const itemToRemove = myFavList.find((item) => item.wishlistItem === wishlistItem.innerHTML);
                                    if (itemToRemove) {
                                        removeItemFromLocalStorage(itemToRemove);
                                    }
                                }
                            }
                        });

                        let count = 1;
                        //to insert ingredients and measures
                        while (true) {
                            const ingredlist = meal["strIngredient" + count];

                            if (!ingredlist) {
                                break;
                            }

                            const ingrlist = document.createElement('li');
                            ingrlist.classList.add('list-group-item');
                            ingrlist.innerHTML = ingredlist;
                            wishlistItem.querySelector('#ingredient').appendChild(ingrlist);
                            count++;
                        }

                        let num = 1;
                        while (true) {
                            const measurelist = meal["strMeasure" + num];

                            if (!measurelist) {
                                break;
                            }

                            const measurementlist = document.createElement('li');
                            measurementlist.classList.add('list-group-item');
                            measurementlist.innerHTML = measurelist;
                            wishlistItem.querySelector('#requirement').appendChild(measurementlist);
                            num++;
                        }

                        let flag = false;
                        listItems.addEventListener('click', (e) => {
                            if (e.target.classList.contains('ingredients-button')) {
                                const ingredientsSection = e.target.closest('.fav-card').querySelector('#ingred');
                                if (ingredientsSection) {
                                    if (flag) {
                                        ingredientsSection.style.display = 'flex';
                                        flag = false;
                                    } else {
                                        ingredientsSection.style.display = 'none';
                                        flag = true;
                                    }
                                }
                            }
                        });
                    });
                });
            } else {
                outPutBox.innerHTML = '<p>No meal found</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching', error);
        });
}

// checkig for the item

searchButton.addEventListener('click', function () {
    searchButton.style.cssText='background-color:#02bc43;color:white;'
    var query = input.value;
    if (query.trim() !== '') {
        fetchResult(query);
    } else {
        outPutBox.innerHTML = `<p class="null">Please type something</p>`;
    }
});
var wishListContent = document.getElementById('wish')
var wishlist = document.getElementById('wishlist-container')
flag = true
wishlist.addEventListener('click', (e) => {
    // e.preventDefault()
    e.stopPropagation()
    if (flag == true) {
        wishListContent.style.display = "flex"
        flag = false
    }
    else {
        wishListContent.style.display = "none"
        flag = true
    }
})
// Prevent click events on dropdown
wishListContent.addEventListener('click', (e) => {
    e.stopPropagation();



})
