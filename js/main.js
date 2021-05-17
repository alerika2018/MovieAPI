

//ALEJANDRA HERNANDEZ
//TERM PROJECT
//************************************* */

//APIs URLs
const apiURL = "https://api.themoviedb.org/3";
const apiPopularMovies = "/discover/movie?sort_by=popularity.desc";
const apiPopularTv = "/discover/tv?sort_by=popularity.desc";
const apiKey = "&api_key=5be9b98c82e6e1a82050ca0a375e2665";
const imgPath = "https://image.tmdb.org/t/p/w200";

let movieData = [];
let tvData = [];
let selectedMovies = [];
let selectedTv = [] ;

getTitles(apiURL + apiPopularMovies + apiKey,moviesContainer,'movie',movieData);
getTitles(apiURL + apiPopularTv + apiKey,tvContainer,'tv',tvData);

async function getTitles(url, container,chkPrefix,dataContainer) {
   //CREAT GRID WITH MOVIES AND TV SHOWS PICTURES
    const res = await fetch(url)
    const data = await res.json();
    
    console.log(data.results);
    if (chkPrefix=="movie"){
        movieData = data.results;
    }
    else{
        tvData = data.results;
    }
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
        const chk = document.createElement('input');
        chk.type = 'checkbox';
        chk.setAttribute('id',`${chkPrefix}_`+ dataContainer[i].id);        
        const idNumber = chkPrefix + "_" + dataContainer[i].id;
        if (chkPrefix=="movie") { 

            chk.setAttribute('onclick',`getInfo(${i},"movie",${idNumber})`); 
        }
        else{
            chk.setAttribute('onclick',`getInfo(${i},"tv",${idNumber})`); 
        }
        chk.setAttribute('style','float: right;');
        newImgContainer.appendChild(chk);
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


getInfo = (index,from,elementId) =>  {
    //FILL ARRAY TO LOAD TABLES
    if (from == "movie"){        
        if (elementId.checked){
            selectedMovies.push(movieData[index]);            
        }    
        else{
            const id = elementId.id.replace("movie_",'');
            let i = selectedMovies.findIndex(e=>{return e.id==parseInt(id)});            
            selectedMovies.splice(i,1);
        }
        // console.log(selectedMovies);
        printTable(selectedMovies,"moviesList",from);
    }
    else{
        //it's from tv
        if (elementId.checked){
            selectedTv.push(tvData[index]);            
        }    
        else{
            const id = elementId.id.replace("tv_",'');
            let i = selectedTv.findIndex(e=>{return e.id==parseInt(id)});            
            selectedTv.splice(i,1);
        }
        printTable(selectedTv,"tvList",from);
    }
}

//PRINT TABLE TO SHOW MOVIES AND TV SHOW INFORMATION
const printTable = (arr,container,from) => {
   //print tables
    const table = document.createElement('table');
    table.setAttribute('class',"table")
    const tableHead = table.insertRow(0);
        const cell1 = tableHead.insertCell(0);
        const cell2 = tableHead.insertCell(1);
        const cell3 = tableHead.insertCell(2);
        cell1.innerHTML = "Movie Title";
        cell2.innerHTML = "Release Date";
        cell3.innerHTML = "Rating";
        cell1.setAttribute('class',"rowHead");
        cell2.setAttribute('class',"rowHead");
        cell3.setAttribute('class',"rowHead");

    for (let i = 0; i < arr.length; i++){
        const row = table.insertRow(i+1);
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        const cell3 = row.insertCell(2);
        cell1.setAttribute('class',"row");
        cell2.setAttribute('class',"row");
        cell3.setAttribute('class',"row");
       
        if (from =="movie"){
            cell1.innerHTML = arr[i].original_title;
            cell2.innerHTML = arr[i].release_date;
            cell3.innerHTML = arr[i].vote_average;
        }
        else{
            cell1.innerHTML = arr[i].name;
            cell2.innerHTML = arr[i].first_air_date;
            cell3.innerHTML = arr[i].vote_average;
        }
    }
    
    const list = document.getElementById(container);
    list.innerHTML="";
    list.appendChild(table);
}
   


