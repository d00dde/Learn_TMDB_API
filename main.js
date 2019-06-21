
let options = {
	apiKey: 'ead41c3eaac089640f31601bd088ab4e',
	language: 'ru',
	page: '1',
	includeAdult: '', //Boolean
	region: '',
	period: 'week'
}

window.onload = () => {
	const formSearch = document.querySelector ('#form-search');
	const searchText = document.querySelector('.search-text').value;
	const container = document.querySelector('.movies');
	formSearch.addEventListener ('submit', (event) => {
		event.preventDefault();
		
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
		container.innerHTML = 'Загрузка...';

		GETResponse (url, renderPosters, container);
	});

	const urlTrends = `https://api.themoviedb.org/3/trending/all/${options.period}?api_key=${options.apiKey}&language=${options.language}`;
	GETResponse (urlTrends, renderPosters, container);
}

function GETResponse (url, resolve, container, type) {
	fetch(url).then(response => {
		return response.json();
	}).then(value => {
		resolve(value, container, type);
	}).catch(error => {
		container.innerHTML = 'Упс, что-то пошло не так.';
		console.error(error);
	});
}

function renderPosters (response, container) {
	container.innerHTML ='';
	if(response.results.length)
		response.results.forEach((movie)=>{
			createPoster(container, movie);
		});
	else container.innerHTML = 'Простите, но ничего не найдено.';
}

function createPoster (container, movie) {
	if(movie.media_type === 'person') return;
	const poster = document.createElement('div');
	poster.classList.add('poster');
	const img = document.createElement('img');
	img.setAttribute('src', `https://image.tmdb.org/t/p/w300_and_h450_bestv2${movie.poster_path}`);
	img.setAttribute('alt', movie.name || movie.title);
	img.setAttribute('data-title', movie.name || movie.title);
	img.setAttribute('data-type', movie.name ? 'tv': movie.title ? 'movie' :'');
	img.setAttribute('data-id', movie.id);
	img.addEventListener('error', () => {
		img.setAttribute( 'src', 'img/no_image.png');
	});
	img.style.width = '300px';
	img.style.cursor = 'pointer';

	img.addEventListener('click', function () {
		const urlMovie = `https://api.themoviedb.org/3/${img.dataset.type}/${img.dataset.id}?api_key=${options.apiKey}&language=${options.language}`;
		GETResponse (urlMovie, renderSolo, container, img.dataset.type);
	});
	poster.appendChild(img);
	const title = document.createElement('h3');
	title.innerText = movie.name || movie.title;
	poster.appendChild(title);
	container.appendChild(poster);
}

function renderSolo (movie, container, type) {
	container.innerHTML = '';
	const solo = document.createElement('div');
	solo.classList.add('solo');
	const img = document.createElement('img');
	img.setAttribute('src', `https://image.tmdb.org/t/p/w500${movie.poster_path}`);
	solo.appendChild(img);
	const title = document.createElement('h2');
	title.innerText = movie.title || movie.name;
	solo.appendChild(title);
	const overview = document.createElement('p');
	overview.innerText = movie.overview;
	solo.appendChild(overview);
	const voteAverage = document.createElement('h3');
	voteAverage.innerText = `Рейтинг: ${movie.vote_average}`;
	solo.appendChild(voteAverage);
	if(movie.budget){	
		const budget = document.createElement('h3');
		budget.innerText = `Бюджет: $${(' '+movie.budget).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ')}`;
		solo.appendChild(budget);
	}
	if(movie.homepage) {
		const homepage = document.createElement('a');
		homepage.innerText = movie.original_title || movie.original_name;
		homepage.setAttribute('href', movie.homepage);
		solo.appendChild(homepage);
	}
	container.appendChild(solo);
	const urlVideos = `https://api.themoviedb.org/3/${type}/${movie.id}/videos?api_key=${options.apiKey}&language=${options.language}`
	GETResponse (urlVideos, (value, container)=>{
		const a = document.createElement('a');
		console.log(value);
		//a.setAttribute('href', `https://api.themoviedb.org/3/movie/${value.results[0].id}`);
		a.innerText = value.name;			//TODO
		solo.appendChild(a);
		//a.setAttribute('href', movie.homepage);

	}, container);
	const urlRecomend = `https://api.themoviedb.org/3/${type}/${movie.id}/recommendations?api_key=${options.apiKey}&language=${options.language}`
	GETResponse (urlRecomend, (value, container)=>{
		console.log(value);	
	}, container);
}

