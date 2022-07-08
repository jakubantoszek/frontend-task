// #TODO task 3
var x = 15;

function startup(){
    get_list_of_articles();
    show_no_of_articles();
}

function get_list_of_articles(){
    var val = document.getElementById('num').value;
    if(val != null && val != "")
        x = val;

    fetch('https://api.spaceflightnewsapi.net/v3/articles?_limit=' + x).then(function (response) {
        return response.json();
    }).then(function (data){
        show_articles(data, x);
        show_no_of_articles();    
    }).catch(function (err) {
        console.warn('Error.', err);
    });
}

function show_articles(data, x){
    var list = document.getElementById('list-of-articles');
    list.innerHTML = "";

    for(var i = 0; i < x; i++){
        var article = document.createElement('div');
        article.setAttribute('class', 'article-panel');
        
        var header = document.createElement('div');
        header.setAttribute('class', 'article-header');
        header.innerHTML = data[i]['title'];

        var info = document.createElement('div');
        info.setAttribute('class', 'info');
        info.innerHTML = "news site: " + data[i]['newsSite'] + "</br>published at: " + data[i]['publishedAt'].substring(0, 10) + ", " + data[i]['publishedAt'].substring(11, 19);

        var summary = document.createElement('div');
        summary.setAttribute('class', 'summary');
        summary.innerHTML = data[i]['summary'];

        article.append(header);
        article.append(info);
        article.append(summary);
        list.append(article);
    }
}

function show_no_of_articles(){
    var articles_header = document.getElementById('total');

    fetch('https://api.spaceflightnewsapi.net/v3/articles/count').then(function (response){
        return response.json();
    }).then(function (data){
        articles_header.innerHTML = "Fetched articles: " + x + "/" + data;
    }).catch(function (err){
        console.warn('Error.', err);
    });
}