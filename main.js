
let options = {
	apiKey: 'ead41c3eaac089640f31601bd088ab4e',
	language: 'ru',
	page: '1',
	includeAdult: '', //Boolean
	region: ''
}

window.onload = () => {
	const formSearch = document.querySelector ('#form-search');
	formSearch.addEventListener ('submit', (event) => {
		event.preventDefault();
		const searchText = document.querySelector('.search-text').value;
		let url = 'https://api.themoviedb.org/3/search/multi?';
		url += `api_key=${options.apiKey}`;
		if(options.language)
			url += `&language=${options.language}`;
		url += `&query=${searchText}`;
		if(options.page)
			url += `&page=${options.page}`;
		if(options.includeAdult)
			url += `&include_adult=${options.includeAdult}`;
		if(options.region)
			url += `&region=${options.region}`;
		requestGET(url);
	});
}

function requestGET (url) {
	const request = new XMLHttpRequest();
	request.open('GET', url);
	request.addEventListener('readystatechange',() => {
		if(request.readyState == 4) {
			if(request.status == 200) {
				const response = JSON.parse(request.responseText);
				console.log(response);
				renderMovies(response);
			}
			else console.error('Ошибка ответа: '+ request.status);
		}
	});
	request.send();
}

function renderMovies (response) {
	const container = document.querySelector('.movies');
	container.innerHTML ='';
		response.results.forEach((movie)=>{
			let poster = document.createElement('div');
			poster.style.background = `url(https://image.tmdb.org/t/p/w300_and_h450_bestv2${movie.poster_path})`;
			poster.style.width = '300px';
			poster.style.height = '450px';
			container.appendChild(poster);
		});
}