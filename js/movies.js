
//ALEJANDRA HERNANDEZ
//TERM PROJECT
//************************************* */

/* URLs FOR API */
const apiURL = "https://api.themoviedb.org/3";
const apiGenres = "/genre/movie/list?";
const apiKey = "&api_key=5be9b98c82e6e1a82050ca0a375e2665";
const apiKeyUS = "?api_key=5be9b98c82e6e1a82050ca0a375e2665&language=en-US";
const imgPath = "https://image.tmdb.org/t/p/w200";
const apiMovies2021 = "/discover/movie?primary_release_year=2021&sort_by=vote_average.desc";
const apiMoviesTheatres = "/movie/now_playing?";

let arrMoviesTheatres = [];
getMovies(apiURL + apiMoviesTheatres + apiKey, arrMoviesTheatres,moviesContainer);
getGenres(apiURL + apiGenres + apiKey);


//FUNCTION TO LOAD 
async function getMovies(url, dataContainer,container){
  const res = await fetch(url);
  const data = await res.json();
  dataContainer = data.results;

  let row = 1;
  let col = 1;
  let rowNext=0;
  const totalCols = 5;

  for (let i=0; i < dataContainer.length; i++) {
 
      const newImgContainer = document.createElement('div');
      const newImg = document.createElement('img');
      const url= imgPath + dataContainer[i].poster_path;   
      
      const style = `grid-column: ${col}/${col+1}; grid-row: ${row}/${row+1}; background-image: url(${url});`;  
      newImgContainer.setAttribute('style',style);
      newImgContainer.setAttribute('class','gridChildrenDynamic');
      
      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.setAttribute('id',dataContainer[i].id);
      radio.setAttribute("name", "videoRadioButton");
      //CALL API TO GET VIDEOS CODES
      let resVideo = await fetch(apiURL + `/movie/${dataContainer[i].id}/videos` + apiKeyUS );
      let dataVideos =  await resVideo.json();
      let arrVideos = dataVideos.results;

      if (arrVideos.length>0){
      radio.setAttribute('onclick',`getVideo("${arrVideos[0].key}")`); 
      }
     
      radio.setAttribute('style','float: right;');
      newImgContainer.appendChild(radio);
      container.appendChild(newImgContainer);
      if (col==totalCols){
          row++;
          col=1;
      }
      else{
          col++;
      }  
  }
  const grid = `grid-template-columns:${totalCols}; grid-template-rows: ${row};`;
     
  container.setAttribute('style',grid) 
  container.setAttribute('class','gridParentDynamic');
}

//CALL VIDEO FROM YOUTUBE
const getVideo = (key) => {
  const iFrame = document.createElement('iframe')
  iFrame.setAttribute('class','videoMovieFrame');
  const url = `https://www.youtube.com/embed/${key}?autoplay=1`;
  iFrame.setAttribute('src',url);
  const totalChildren = movieVideo.childElementCount;
  if (totalChildren>0){ 
    for (let i=0;i<totalChildren;i++) {
      movieVideo.removeChild(movieVideo.firstChild);    
    }
  }
  const buttonX = document.createElement('button');
  buttonX.setAttribute('onclick','closeVideo()');
  buttonX.setAttribute('class','buttonX');
  buttonX.innerText = "X";
  movieVideo.appendChild(buttonX);  
  movieVideo.appendChild(iFrame);
}

//&page=1
btnSearchMovies.addEventListener ('click',()=> 
  {
    if (ddlGeneresList.options[ddlGeneresList.selectedIndex].value == 0){
      alert("Please select a genere");
      return;
    }
    filterMovies("1")
  }
)

async function filterMovies(pageNumber){

  filteredMovies.removeChild(filteredMovies.firstChild); 
  filteredMovies.removeChild(filteredMovies.firstChild);
  filteredMovies.removeChild(filteredMovies.lastChild); 

 

  pagination();
  
  const apiPage = "&page="+pageNumber;
  const page = "&page=" + pageNumber;
  const idGenere = ddlGeneresList.options[ddlGeneresList.selectedIndex].id;
  const year = txtReleaseDate.value;

  let apiGenere = "";
  let apiReleaseYear = "";
  const h1 = document.createElement('h1')
  const hr = document.createElement('hr')
  filteredMovies.insertBefore(hr, filteredMovies.firstChild);

    
  if (idGenere!=0){
    apiGenere = "with_genres=" + idGenere
    h1.innerText = "Genere: " + ddlGeneresList.options[ddlGeneresList.selectedIndex].value;
    filteredMovies.insertBefore(h1, filteredMovies.firstChild);
  }
  if (year!=""){
    h1.innerText += " Released year: " + year; 
    apiReleaseYear = "&primary_release_year="+year;
  }

  const url = apiURL + "/discover/movie?" + apiGenere + apiReleaseYear + apiKey + "&language=en-US" + apiPage;
   
  const res = await fetch(url);
  const data = await res.json();
  const arrFIlter = data.results;

  let row = 1;
  let col = 1;
  const totalCols = 5;

  for (let i=0; i < arrFIlter.length; i++) {
 
      const newImgContainer = document.createElement('div');
      const newImg = document.createElement('img');
      const url= imgPath + arrFIlter[i].poster_path;   
      
      const style = `grid-column: ${col}/${col+1}; grid-row: ${row}/${row+1}; background-image: url(${url});`;  
      newImgContainer.setAttribute('style',style);
      newImgContainer.setAttribute('class','gridChildrenDynamic');
      
      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.setAttribute('id',arrFIlter[i].id);
      radio.setAttribute("name", "videoRadioButton");
      let resVideo = await fetch(apiURL + `/movie/${arrFIlter[i].id}/videos` + apiKeyUS );
      let dataVideos =  await resVideo.json();
      let arrVideos = dataVideos.results;

      if (arrVideos.length>0){
        radio.setAttribute('onclick',`getVideo("${arrVideos[0].key}")`); 
      }
     
      radio.setAttribute('style','float: right;');
      newImgContainer.appendChild(radio);
      filteredMoviesContainer.appendChild(newImgContainer);
      if (col==totalCols){
          row++;
          col=1;
      }
      else{
          col++;
      }  
  }
  const grid = `grid-template-columns:${totalCols}; grid-template-rows: ${row};`;
  filteredMoviesContainer.setAttribute('style',grid);
  filteredMoviesContainer.setAttribute('class','gridParentDynamic')
  filteredMovies.setAttribute('class','movies');
}

const pagination = () => {
  /*Pagination*/
  const divPages = document.createElement('div')
  const btnPage1 =  document.createElement('button')
  const btnPage2 =  document.createElement('button')
  const btnPage3 =  document.createElement('button')
  const btnPage4 =  document.createElement('button')
  const btnPage5 =  document.createElement('button')
  btnPage1.innerText = "1"
  btnPage2.innerText = "2"
  btnPage3.innerText = "3"
  btnPage4.innerText = "4"
  btnPage5.innerText = "5"
  btnPage1.setAttribute('onclick', "filterMovies(1)")
  btnPage2.setAttribute('onclick', "filterMovies(2)")
  btnPage3.setAttribute('onclick', "filterMovies(3)")
  btnPage4.setAttribute('onclick', "filterMovies(4)")
  btnPage5.setAttribute('onclick', "filterMovies(5)")
  btnPage1.setAttribute('class','buttonX')
  btnPage2.setAttribute('class','buttonX')
  btnPage3.setAttribute('class','buttonX')
  btnPage4.setAttribute('class','buttonX')
  btnPage5.setAttribute('class','buttonX')
  btnPage1.setAttribute('id','btnPage1')
  btnPage2.setAttribute('id','btnPage2')
  btnPage3.setAttribute('id','btnPage3')
  btnPage4.setAttribute('id','btnPage4')
  btnPage5.setAttribute('id','btnPage5')
  divPages.appendChild(btnPage1)
  divPages.appendChild(btnPage2)
  divPages.appendChild(btnPage3)
  divPages.appendChild(btnPage4)
  divPages.appendChild(btnPage5)
  divPages.setAttribute('class',"divPages")
  filteredMovies.insertBefore(divPages, filteredMovies.children[2]);
}

const closeVideo = () => {
  const totalChildren = movieVideo.childElementCount;
  if (totalChildren>0){ 
    for (let i=0;i<totalChildren;i++) {
      movieVideo.removeChild(movieVideo.firstChild);
    }
  }
}

// LOAD GENERES LIST
async function getGenres(url) {
    const res = await fetch(url);
    const data = await res.json();
    
    let arrGenres = [];
    arrGenres= data.genres;

    const option = document.createElement('option');
    option.id = 0;
    option.textContent = "Select";

    for (let i=0; i<arrGenres.length; i++){
        const option = document.createElement('option');
        option.id = arrGenres[i].id;
        option.textContent = arrGenres[i].name;
        ddlGeneresList.appendChild(option);
    }    
  }