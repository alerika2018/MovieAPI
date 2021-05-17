//ALEJANDRA HERNANDEZ
//TERM PROJECT
//************************************* */

/* URLs FOR API */
const apiURL = "https://api.themoviedb.org/3";
const apiTrending = "/trending/tv/week?"
const apiKey = "api_key=5be9b98c82e6e1a82050ca0a375e2665";
const apiKeyUS = "?api_key=5be9b98c82e6e1a82050ca0a375e2665&language=en-US"
let apiPage = "&page=";
const imgPath = "https://image.tmdb.org/t/p/w200";

let arrTvShows = [];
const arrFIlter = [] ;

getTvShows (apiURL + apiTrending + apiKey + apiPage + "1",trendingTvContainer,arrTvShows);

//LOAD THE TRENDING TV SHOWS
async function getTvShows(url, container,dataContainer){
    const res = await fetch(url);
    const data = await res.json();
    dataContainer = data.results;

    let row = 1;
    let col = 1;
    const totalCols = 5;

  for (let i=0; i < dataContainer.length; i++) { 
    const newImgContainer = document.createElement('div');
    const url= imgPath + dataContainer[i].poster_path;  
    const style = `grid-column: ${col}/${col+1}; grid-row: ${row}/${row+1}; background-image: url(${url});`;  
    newImgContainer.setAttribute('style',style);
    newImgContainer.setAttribute('class','gridChildrenDynamic');
    
    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.setAttribute('id',dataContainer[i].id);
    radio.setAttribute("name", "videoRadioButton");

    //CALL API TO GET VIDEOS CODES
    let resVideo = await fetch(apiURL + `/tv/${dataContainer[i].id}/videos` + apiKeyUS );
    let dataVideos =  await resVideo.json();
    let arrVideos = dataVideos.results;

    if (arrVideos.length>0){
        const overview = dataContainer[i].overview;
        const original_name = dataContainer[i].original_name;
        radio.setAttribute('onclick',`getVideo("${arrVideos[0].key}","${overview}","${original_name}")`); 
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
    const grid = `grid-template-columns:${totalCols}; grid-template-rows: ${row}; `;
    container.setAttribute('style',grid) 
    container.setAttribute('class','gridParentDynamic');
}

//SEARCH FOR TV SHOWS
async function  searchTv (url,container,containerParent, dataContainer)  {

    container.removeChild(container.firstChild); 
    container.removeChild(container.firstChild);
    const res = await fetch(url);
    const data = await res.json();
    dataContainer = data.results;

    const h1 = document.createElement('h1')
    const hr = document.createElement('hr')  
    if (dataContainer.length==0){
        h1.innerText = "No results found";
    }
    else{         
         h1.innerText = "Search results";            
    } 
    container.insertBefore(hr, container.firstChild);
    container.insertBefore(h1, container.firstChild);  

    let row = 1;
    let col = 1;
    const totalCols = 5;
  
    for (let i=0; i < dataContainer.length; i++) { 
        const newImgContainer = document.createElement('div');
        const newImg = document.createElement('img');
        let style="";
        let imageUrl="";
        if(dataContainer[i].poster_path != null){
            imageUrl= imgPath + dataContainer[i].poster_path; 
        }
        else{
            imageUrl = '../images/notFound.jpg';
        }
        style = `grid-column: ${col}/${col+1}; grid-row: ${row}/${row+1}; background-image: url(${imageUrl}); `;  
        newImgContainer.setAttribute('style',style);
        newImgContainer.setAttribute('class','gridChildrenDynamic');        
        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.setAttribute('id',dataContainer[i].id);
        radio.setAttribute("name", "videoRadioButton");
        //CALL API TO GET VIDEOS CODES
        let resVideo = await fetch(apiURL + `/tv/${dataContainer[i].id}/videos` + apiKeyUS );
        let dataVideos =  await resVideo.json();
        let arrVideos = dataVideos.results;    
        if (arrVideos.length>0){
            const overview = dataContainer[i].overview;
            const original_name = dataContainer[i].original_name;
            radio.setAttribute('onclick',`getVideo("${arrVideos[0].key}","${overview}","${original_name}")`); 
        }      
        radio.setAttribute('style','float: right;');
        newImgContainer.appendChild(radio);
        containerParent.appendChild(newImgContainer);
        if (col==totalCols){
            row++;
            col=1;
        }
        else{
            col++;
        }  
    }

    const grid = `grid-template-columns:${totalCols}; grid-template-rows: ${row}; `;
    containerParent.setAttribute('style',grid) 
    containerParent.setAttribute('class','gridParentDynamic')
    container.setAttribute('class','movies');
  }


  btnSearchTvShows.addEventListener('click',()=>{
    const tvName = txtTvShowName.value;
    if (tvName==""){
        alert("What Tv Show do you wish to search?");
        return;
    }
    const url = apiURL + "/search/tv?" + apiKey + "&query=" + tvName;
    searchTv (url,filteredMovies, filteredMoviesContainer, arrFIlter);
  })

  const changePage = (pageNumber) => {
    getTvShows (apiURL + apiTrending + apiKey + apiPage + pageNumber,trendingTvContainer,arrTvShows);
  }

  //CALL VIDEO FROM OYUTUBE
  const getVideo = (key,overview,original_name) => {
    cleanChildrenVideo();
    const h3 = document.createElement('h3');
    const h4 = document.createElement('h4');
    h4.innerText = "Overview";    
    h3.innerText = original_name;
    const ptvDescription = document.createElement('p');
    ptvDescription.setAttribute('id','ptvDescription');
    ptvDescription.innerText = overview;
    tvDescriptionContainer_item2.appendChild(h3);
    tvDescriptionContainer_item2.appendChild(h4);
    tvDescriptionContainer_item2.appendChild(ptvDescription);
    const iFrame = document.createElement('iframe')
    iFrame.setAttribute('class','videoTVFrame');
    const url = `https://www.youtube.com/embed/${key}?autoplay=1&allowfullscreen=1`;
    iFrame.setAttribute('src',url);  
    const buttonX = document.createElement('button');
    buttonX.setAttribute('onclick','closeVideo()');
    buttonX.setAttribute('class','buttonX');
    buttonX.innerText = "X";
    tvVideo.appendChild(buttonX);    
    tvVideo.appendChild(iFrame);
  }

  const closeVideo = () => {
    cleanChildrenVideo();
  }

  //REMOVE CHILDRENS FROM VIDEO DIV
  const cleanChildrenVideo = () => {
    let totalChildren = tvVideo.childElementCount;
    if (totalChildren>0){ 
      for (let i=0;i<totalChildren;i++) {
        tvVideo.removeChild(tvVideo.firstChild);
      }
    }
    tvDescriptionContainer_item2.removeChild(tvDescriptionContainer_item2.firstChild);
    totalChildren = tvDescriptionContainer_item2.childElementCount;
    if (totalChildren>0){ 
        for (let i=0;i<totalChildren;i++) {
            tvDescriptionContainer_item2.removeChild(tvDescriptionContainer_item2.firstChild);
        }
    }
  }
