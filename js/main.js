let restaurants;
let neighborhoods;
let cuisines;
var device = '';
var newMap;
var markers = [];
var wwwRoot = '';
var buttonEl;  // for button of first restaurant in page
var captionEl; // for header element
var firstRestaurantEl;
var fullLoad = false; //variable to hang the state of loading process

/**
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', (event) => {

  initMap(); // added
  fetchNeighborhoods();
  fetchCuisines();
  // get elements that focused before map when using Tab key

});

// window.addEventListener('load',function(){
//   console.log('event load');
//   fullLoad = true;
//
//
// });
//
// defineDevice = () => {
//   let  screenWidth = window.innerWidth;
//   if (screenWidth < 768) {
//     device = 'mobile';
//   }
//   else if (screenWidth<=1024) {
//     device = 'tablet';
//   };
//   // console.log("-"+device+"+");
//   return device;
// }
//
// defineDevice();

// function intercept Tab key press Event

document.addEventListener('keydown',tabIndexCatch);

function tabIndexCatch(event) {
  console.log(`key pressed`);
  /// in case Tab pressed during loading page.
  if(event.keyCode == 9){ // in case TAB key pressed
    console.log(`TAB pressed`);
    if (buttonEl){ //if restaurants list complete
      console.log(`if buttonEl case`);
      if (captionEl == document.activeElement){ //if cursor on capition of page
        console.log(`capition in focus`);
        buttonEl.focus();//cursor jump to first button element
      }
    }else{//if restaurants list still loading prevent TAB key
      console.log(`buttoneEl not exist`);
      preventDefault();
    }
  }

  //
  // if (!buttonEl) {
  //   event.preventDefault();
  //   return;
  // }
  // console.log(`keypressed, captionEl: ${captionEl.tagName} active: ${document.activeElement.tagName}`)
  // // condition in case of Header is active and Tab is pressed
  // if ((event.keyCode == 9)&&(captionEl == document.activeElement)) {
  //   event.preventDefault();
  //   console.log(`keyCode = 9, captionEl: ${captionEl.tagName} active: ${document.activeElement.tagName}`);
  //
  //   //jump to button of first restaurant.
  //   buttonEl.focus();
  // }
};


/**
 * Fetch all neighborhoods and set their HTML.
 */
fetchNeighborhoods = () => {
  DBHelper.fetchNeighborhoods((error, neighborhoods) => {
    if (error) { // Got an error
      console.error(error);
    } else {
      self.neighborhoods = neighborhoods;
      fillNeighborhoodsHTML();
    }
  });
}

/**
 * Set neighborhoods HTML.
 */
fillNeighborhoodsHTML = (neighborhoods = self.neighborhoods) => {
  const select = document.getElementById('neighborhoods-select');
  neighborhoods.forEach(neighborhood => {
    const option = document.createElement('option');
    option.innerHTML = neighborhood;
    option.value = neighborhood;
    select.append(option);
  });
}

/**
 * Fetch all cuisines and set their HTML.
 */
fetchCuisines = () => {
  DBHelper.fetchCuisines((error, cuisines) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      self.cuisines = cuisines;
      fillCuisinesHTML();
    }
  });
}

/**
 * Set cuisines HTML.
 */
fillCuisinesHTML = (cuisines = self.cuisines) => {
  const select = document.getElementById('cuisines-select');

  cuisines.forEach(cuisine => {
    const option = document.createElement('option');
    option.innerHTML = cuisine;
    option.value = cuisine;
    select.append(option);
  });
}

/**
 * Initialize leaflet map, called from HTML.
 */
initMap = () => {
  self.newMap = L.map('map', {
        center: [40.722216, -73.987501],
        zoom: 12,
        scrollWheelZoom: false
      });
  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.jpg70?access_token={mapboxToken}', {
    mapboxToken: mapKey,
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
      '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
      'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox.streets'
  }).addTo(newMap);

  updateRestaurants();
}
/* window.initMap = () => {
  let loc = {
    lat: 40.722216,
    lng: -73.987501
  };
  self.map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: loc,
    scrollwheel: false
  });
  updateRestaurants();
} */

/**
 * Update page and map for current restaurants.
 */
updateRestaurants = () => {
  const cSelect = document.getElementById('cuisines-select');
  const nSelect = document.getElementById('neighborhoods-select');

  const cIndex = cSelect.selectedIndex;
  const nIndex = nSelect.selectedIndex;

  const cuisine = cSelect[cIndex].value;
  const neighborhood = nSelect[nIndex].value;

  DBHelper.fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, (error, restaurants) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      resetRestaurants(restaurants);
      fillRestaurantsHTML();
    }
  })
}

/**
 * Clear current restaurants, their HTML and remove their map markers.
 */
resetRestaurants = (restaurants) => {
  // Remove all restaurants
  self.restaurants = [];
  const ul = document.getElementById('restaurants-list');
  ul.innerHTML = '';

  // Remove all map markers
  if (self.markers) {
    self.markers.forEach(marker => marker.remove());
  }
  self.markers = [];
  self.restaurants = restaurants;
}

/**
 * Create all restaurants HTML and add them to the webpage.
 */
fillRestaurantsHTML = (restaurants = self.restaurants) => {
  const ul = document.getElementById('restaurants-list');
  restaurants.forEach(restaurant => {
    ul.append(createRestaurantHTML(restaurant));
  });
  addMarkersToMap();

  //Block for Tabindex issue
  var navEl = document.getElementsByTagName('nav')[0];
  captionEl = document.getElementsByTagName('h2')[0].getElementsByTagName('a')[0];
  var restaurantsListEl = document.getElementById('restaurants-list');
  firstRestaurantEl = restaurantsListEl.getElementsByTagName('li')[0];
  buttonEl = firstRestaurantEl.getElementsByTagName('a')[0];
  console.log(`got button element: ${buttonEl}`);
}

/**
 * Create restaurant HTML.
 */
createRestaurantHTML = (restaurant) => {
  const li = document.createElement('li');

  const image = document.createElement('img');
  image.className = 'restaurant-img';
  // image.src = DBHelper.imageUrlForRestaurant(restaurant);
  // <img srcset="elva-fairy-320w.jpg 320w,
  //            elva-fairy-480w.jpg 480w,
  //            elva-fairy-800w.jpg 800w"
  //    sizes="(max-width: 320px) 280px,
  //           (max-width: 480px) 440px,
  //           800px"
  //    src="elva-fairy-800w.jpg" alt="Elva dressed as a fairy">
  let originalPic = DBHelper.imageUrlForRestaurant(restaurant);
  let originalPicLength = originalPic.length-4;
  let nameWithoutExt = originalPic.slice(0,originalPicLength);
  let tabletPic = nameWithoutExt + '-tablet.jpg';
  let mobilePic = nameWithoutExt + '-mobile.jpg';
  image.srcset = `${mobilePic} 2.5x, ${tabletPic} 2x, ${originalPic} 1x`;
  console.log(`DPR:${window.devicePixelRatio}`);
  // image.sizes = `(max-width:600px) 450px, (max-width:1024px) 600px, 800px`;
  image.src = DBHelper.imageUrlForRestaurant(restaurant);
  image.alt = restaurant.altDescription;
  console.log(`srcset= ${image.srcset}`);
  li.append(image);

  const name = document.createElement('h2');
  name.innerHTML = restaurant.name;
  li.append(name);

  const neighborhood = document.createElement('p');
  neighborhood.innerHTML = restaurant.neighborhood;
  li.append(neighborhood);

  const address = document.createElement('p');
  address.innerHTML = restaurant.address;
  li.append(address);

  const more = document.createElement('a');
  more.innerHTML = 'View Details';
  more.href = DBHelper.urlForRestaurant(restaurant);
  li.append(more)

  return li
}

/**
 * Add markers for current restaurants to the map.
 */
addMarkersToMap = (restaurants = self.restaurants) => {
  restaurants.forEach(restaurant => {
    // Add marker to the map
    const marker = DBHelper.mapMarkerForRestaurant(restaurant, self.newMap);
    marker.on("click", onClick);
    function onClick() {
      window.location.href = marker.options.url;
    }
    self.markers.push(marker);
  });

}
/* addMarkersToMap = (restaurants = self.restaurants) => {
  restaurants.forEach(restaurant => {
    // Add marker to the map
    const marker = DBHelper.mapMarkerForRestaurant(restaurant, self.map);
    google.maps.event.addListener(marker, 'click', () => {
      window.location.href = marker.url
    });
    self.markers.push(marker);
  });
} */
