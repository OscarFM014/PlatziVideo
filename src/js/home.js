//Variables
console.log('hola mundo!');
const dontChange = "Leonidas";
let change = "@LeonidasEsteban"

//Function with that change
function cambiarNombre(nuevoNombre) {
  change = nuevoNombre
}

//Promise
//After 5 segundos
const getUserAll = new Promise(function (todoBien, todoMal) {
  setTimeout(function () {

    todoBien("Se acabo el tiempo");
  }, 5000);
})

//After 3 segundoss
const getUser = new Promise(function (todoBien, todoMal) {
  setTimeout(function () {

    todoBien("Se acabo el tiempo");
  }, 3000);

})


// getUser
//   .then(function () {
//     console.log("Todo bien");
//   })
//   .catch(function (tiempoMal) {
//     console.log(tiempoMal);
//   })


//Promise.race: check the first promise
Promise.all([
  getUser,
  getUserAll,
])
  .then(function (message) {
    console.log(message);
  })
  .catch(function (message) {
    console.log(message);
  });


$.ajax('https://randomuser.me/api/', {
  method: 'GET',
  success: function (data) {
    console.log(data);
  },
  error: function (error) {
    console.log(error);
  }
});

fetch('https://randomuser.me/api/')
  .then(function (response) {
    console.log(response);
    return response.json()
  })
  .then(function (user) {
    console.log('user', user.results[0].name.first);
  })
  .catch(function () {
    console.log("Fallo");
  });


//Function to get the json
(async function load() {
  // await
  // action
  // terror
  // animation


  async function getData(url) {
    const response = await fetch(url);

    const data = await response.json();
    if (data.data.movie_count > 0) {
      return data;
    }
    throw new Error('No se encontro en ningun resultado');
  }

  const $form = document.getElementById('form');
  const $home = document.getElementById('home');
  const $featuringContainer = document.getElementById('featuring');


  function setAttributes($element, atributes) {
    //Example
    //atribute = src
    for (const atribute in atributes) {
      $element.setAttribute(atribute, atributes[atribute]);
    }


  }

  const BASE_API = 'https://yts.mx/api/v2/';
  function featuringTemplate(peli) {
    return (`
    <div class="featuring">
    <div class="featuring-image">
      <img src="${peli.medium_cover_image}" width="70" height="100" alt="">
    </div>
    <div class="featuring-content">
      <p class="featuring-title">Pelicula encontrada</p>
      <p class="featuring-album">${peli.title}</p>
    </div>
  </div>
    `
    )
  }
  $form.addEventListener('submit', async (event) => {
    event.preventDefault();
    $home.classList.add('search-active')
    const $loader = document.createElement('img');
    setAttributes($loader, {
      src: 'src/images/loader.gif',
      height: 50,
      width: 50,
    })
    $featuringContainer.append($loader);

    const data = new FormData($form);
    try {
      const {
        data: {
          movies: pelis
        }
      } = await getData(`${BASE_API}list_movies.json?limit=1&query_term=${data.get('name')}`);
      const HTMLString = featuringTemplate(pelis[0]);
      $featuringContainer.innerHTML = HTMLString;
    } catch (error) {
      alert(error.message);
      $loader.remove();
      $home.classList.remove('search-active');
    }

  })

  async function cacheExist(category) {
    const listName = `${category}List`;
    const cacheList = window.localStorage.getItem(listName);
    if (cacheList) {
      return JSON.parse(cacheList);
    }
    // getData(`${BASE_API}list_movies.json?genre=action`);
    const { data: { movies: data } } = await getData(`${BASE_API}list_movies.json?genre=${category}`);
    window.localStorage.setItem(listName, JSON.stringify(data))
    return data;

  }
  const actionList = await cacheExist('action');
  const dramaList = await cacheExist('drama');
  const animationList = await cacheExist('animation');
  //Iterar para Templates 
  //Cuidar espacios dentro de esta seccion
  function videoItemTemplate(movie, category) {
    return (
      `<div class= "primaryPlaylistItem" data-id="${movie.id}" data-category=${category}>
          <div class="primaryPlaylistItem-image">
            <img src="${movie.medium_cover_image}">
          </div>
        <h4 class="primaryPlaylistItem-title">
            ${movie.title}
        </h4>
      </div>`
    )
  }

  //Create Template on HTML document
  function createTemplate(HTMLString) {
    const html = document.implementation.createHTMLDocument();
    html.body.innerHTML = HTMLString;
    return html.body.children[0];
  }

  //Event

  function addEventClick($element) {
    $element.addEventListener('click', () => {
      // alert('click')
      showModal($element)
    })
  }



  //Append the template on the principal html document in a specific div
  //console.log(videoItemTemplate('src/images/covers/bitcoin.jpg', 'bitcoin')); 
  function renderMovieList(list, $container, category) {
    // actionList.data.movies
    $container.children[0].remove();
    list.forEach((movie) => {
      const HTMLString = videoItemTemplate(movie, category);
      const movieElement = createTemplate(HTMLString);
      $container.append(movieElement);
      addEventClick(movieElement);
    })
  }
  /* getData('https://yts.mx/api/v2/list_movies.json?genre=horror')
    .then(function (data) {
      horrorUrl = data;
    }); */
  //console.log(actionList, dramaList, animationList);
  //selector
  //const $home = $('.home .list #item');




  const $actionContainer = document.querySelector('#action');
  renderMovieList(actionList, $actionContainer, 'action');
  //window.localStorage.setItem('actionList', JSON.stringify(actionList));

  const $dramaContainer = document.getElementById('drama');
  renderMovieList(dramaList, $dramaContainer, 'drama');
  //window.localStorage.setItem('dramaList', JSON.stringify(dramaList));

  const $animationContainer = document.getElementById('animation');
  renderMovieList(animationList, $animationContainer, 'animation');
  //window.localStorage.setItem('animationList', JSON.stringify(animationList));
  // const $home = $('.home .list #item');
  const $modal = document.getElementById('modal');
  const $overlay = document.getElementById('overlay');
  const $hideModal = document.getElementById('hide-modal');

  const $modalTitle = $modal.querySelector('h1');
  const $modalImage = $modal.querySelector('img');
  const $modalDescription = $modal.querySelector('p');



  function findById(list, id) {
    return list.find(movie => movie.id === parseInt(id, 10))
  }

  function findMovie(id, category) {
    switch (category) {
      case 'action': {
        return findById(actionList, id)
      }
      case 'drama': {
        return findById(dramaList, id)
      }
      default: {
        return findById(animationList, id)
      }
    }
  }



  function showModal($element) {
    $overlay.classList.add('active');
    $modal.style.animation = 'modalIn .8s forwards';
    const id = $element.dataset.id;
    const category = $element.dataset.category;
    const data = findMovie(id, category);
    $modalTitle.textContent = data.title;
    $modalImage.setAttribute('src', data.medium_cover_image);
    $modalDescription.textContent = data.description_full;

  }

  $hideModal.addEventListener('click', hideModal);
  function hideModal() {
    $overlay.classList.remove('active');
    $modal.style.animation = 'modalOut 0.8s forwards';
  }

})()