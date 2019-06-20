
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
		const container = document.querySelector('.movies');
		let url = 'https://api.the3moviedb.org/3/search/multi?';
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
		container.innerHTML = 'Загрузка...';
		
		fetch(url).then(response => {
			console.log(response);
			return response.json();
		}).then(value => {
			renderPosters (value, container);
		}).catch(error => {
			console.error(error);
		});
	});

}

function renderPosters (response, container) {
	container.innerHTML ='';
		response.results.forEach((movie)=>{
			createPoster(container, movie);
		});
}

function createPoster (container, movie) {
	const poster = document.createElement('div');
	poster.classList.add('poster');
	const img = document.createElement('img');
	img.setAttribute('src', `https://image.tmdb.org/t/p/w300_and_h450_bestv2${movie.poster_path}`);
	img.setAttribute('alt', movie.name || movie.title);
	img.addEventListener('error', () => {
		img.setAttribute( 'src', 'img/no_image.png');
	});
	img.style.width = '300px';
	poster.appendChild(img);
	const title = document.createElement('h3');
	title.innerText = movie.name || movie.title;
	poster.appendChild(title);
	const description = document.createElement('p');
	description.innerText = movie.overview;
	poster.appendChild(description);
	container.appendChild(poster);

}