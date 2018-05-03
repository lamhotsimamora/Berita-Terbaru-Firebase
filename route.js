var route = _GET('p');


class Routing
{
	constructor()
	{
		this.route =  (route) ? route : false;
	}	

	init()
	{
		if (this.route==false)
		{
			this.index();
		}
		else
		{
			switch(this.route) {
			    case 'about':
			        this.about();
			        break;
			    case 'index':
			        this.index();
			        break;
			    default:
			       this.index();
			        break;
			}
		}
	}

	template(data)
	{
		if (data)
		{
			let content = data.content;
			let title   = data.title;
			let image   = data.image;
			let date    = data.date;
			let id      = data.id;
			let author  = data.author;

			return '<div class="ui segment">'+
	                  '<h3 class="ui left floated header"><div class="image">'
	                  +'<img id="img_'+id+'" width="100" height="100" src="https://fakeimg.pl/250x100/"></div>&nbsp &nbsp &nbsp  &nbsp &nbsp  &nbsp &nbsp &nbsp &nbsp'
	                  	+title+'</h3>'+
	                  '<div class="ui clearing divider"></div>'+
	                  '<p><h4>'+
	                    content+
	                  '</h4><hr><i class="calendar alternate icon"></i>'+date+' | <i class="user plus icon"></i> '+author+'</p>'+
	            '</div></br>';
		}
	}

	about()
	{
		var _about = __({
			url:'about.html'
		});
		Garuda('b_goup').hide();
		_about.request($response=>{
			Garuda('_berita').setContent($response);
			_setTitle("About Developer");
		});
	}

	loading()
	{
		var $template = ' <div class="ui active inverted dimmer"> <div class="ui text loader">Loading</div> </div>'; 
		Garuda('_berita').setContent($template);
	}

	index()
	{
		this.loading();

		var news = __({
		  url    : 'https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=663fe63e6bcb4ea482975abfbcf80db9'
		});
		_setTitle("Berita Terbaru");
		news.request($resp=>{
			var obj = JSON.parse($resp);

			if (obj)
			{
				var articles = obj.articles;

				var prepare = '';

				var image_prepare = [];
				for (let ii = 0; ii < articles.length; ii++) 
				{
					var title    = articles[ii].title;
					var author   = (articles[ii].author==null) ? '' : articles[ii].author;
					var date     = articles[ii].publishedAt;
					var desc     = (articles[ii].description==null) ? '' : articles[ii].description;
					var url      = articles[ii].url;
					var image    = (articles[ii].description==null) ? 'https://fakeimg.pl/250x100' : articles[ii].urlToImage;
					
					var _title = '<a href="'+url+'" target="_blank">'+title+'</a>';


					image_prepare.push(image);

					prepare += this.template({
						content:  desc, 
						title  :  _title,
						date   :  date,
						id     :  ii,
						author :  author
					});
					
				}
				Garuda('_berita').setContent(prepare);

				for (let jj = 0; jj < image_prepare.length; jj++) 
				{
					var _image = __({
					  el  :'img_'+jj,
					  image:image_prepare[jj]
					});
					
					_image.loadImage();
				}

				Garuda('b_goup').show();
			}
		});
	}

	search()
	{
		var query = Garuda('t_search').getValue;

		if (query==='' || query==null)
		{
			Garuda('t_search').focus();
			return;
		}

		this.loading();

		_setTitle('Mencari artikel { '+query+' }');

		var news = __({
		  url    : 'https://newsapi.org/v2/everything?q='+query+'&sortBy=publishedAt&apiKey=663fe63e6bcb4ea482975abfbcf80db9'
		});

		news.request($resp=>{
			var obj = JSON.parse($resp);

			if (obj)
			{
				var articles = obj.articles;

				var prepare = '';

				var image_prepare = [];
				for (let ii = 0; ii < articles.length; ii++) 
				{
					var title    = articles[ii].title;
					var author   = (articles[ii].author==null) ? '' : articles[ii].author;
					var date     = articles[ii].publishedAt;
					var desc     = (articles[ii].description==null) ? '' : articles[ii].description;
					var url      = articles[ii].url;
					var image    = (articles[ii].description==null) ? 'https://fakeimg.pl/250x100' : articles[ii].urlToImage;
					
					var _title = '<a href="'+url+'" target="_blank">'+title+'</a>';


					image_prepare.push(image);

					prepare += this.template({
						content:  desc, 
						title  :  _title,
						date   :  date,
						id     :  ii,
						author :  author
					});
					
				}
				Garuda('_berita').setContent(prepare);

				for (let jj = 0; jj < image_prepare.length; jj++) 
				{
					var _image = __({
					  el  :'img_'+jj,
					  image:image_prepare[jj]
					});
					
					_image.loadImage();
				}

				Garuda('b_goup').show();
			}
		});
	}

}


$route = new Routing();

$route.init();

function goAbout()
{
	$route.about();
	_putUrl({
		title :'About',
		url   :'?p=about'
	});
}

function goUp()
{
	_scrollTo({x:0,y:0});
}

function goIndex()
{
	$route.index();
	_putUrl({
		title :'',
		url   :'?p=index'
	});
}

function enterSearch(e)
{
	if (e.keyCode==13)
	{
		$route.search();
	}
}