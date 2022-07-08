// #TODO task 3
var x = 15;

function startup(){
    getListOfArticles();
    showNoOfArticles();
}

function getListOfArticles(){
    var val = document.getElementById('num').value;
    if(val != null && val != "")
        x = val;

    fetch('https://api.spaceflightnewsapi.net/v3/articles?_limit=' + x).then(function (response) {
        return response.json();
    }).then(function (data){
        showArticles(data, x);
        showNoOfArticles();    
    }).catch(function (err) {
        console.warn('Error.', err);
    });
}

function showArticles(data, x){
    var list = document.getElementById('list-of-articles');
    list.innerHTML = "";

    for(var i = 0; i < x; i++){
        // informations about article
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

        // create buttons
        var buttons = document.createElement('div');
        buttons.setAttribute('class', 'buttons');

        var readBut = document.createElement('button');
        readBut.setAttribute('class', 'read-button');
        readBut.innerHTML = "Read article";

        var readLink = document.createElement('a');
        readLink.setAttribute('href', data[i]['url']);
        readLink.setAttribute('target', '_blank');

        var addToLib = document.createElement('button');
        addToLib.setAttribute('class', 'add-to-library');
        var onclickFunc = 'saveToLibrary(' + data[i]['id'] + ')';
        addToLib.setAttribute('onclick', onclickFunc);
        addToLib.innerHTML = "Add to library";

        // add articles to site
        readLink.appendChild(readBut);
        buttons.appendChild(readLink);
        buttons.appendChild(addToLib);

        article.append(header);
        article.append(info);
        article.append(summary);
        article.append(buttons);
        list.append(article);
    }
}

function showNoOfArticles(){
    var articlesHeader = document.getElementById('total');

    fetch('https://api.spaceflightnewsapi.net/v3/articles/count').then(function (response){
        return response.json();
    }).then(function (data){
        articlesHeader.innerHTML = "Fetched articles: " + x + "/" + data;
    }).catch(function (err){
        console.warn('Error.', err);
    });
}

function saveToLibrary(id){
    if (localStorage.getItem("saved") === null) {
        var savedArticles = [id];
        localStorage.setItem("saved", JSON.stringify(savedArticles));
        console.log(savedArticles);
    }
    else{
        var savedArticles = JSON.parse(localStorage.getItem("saved"));
        savedArticles.push(id);
        localStorage.setItem("saved", JSON.stringify(savedArticles));
        console.log(savedArticles);
    }
}