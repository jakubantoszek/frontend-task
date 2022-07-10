var limit = 15;
var start = 0;
var timer = null;

function startup(){
    getListOfArticles();
    showNumberOfArticles();
}

function getListOfArticles(){
    var val = document.getElementById('num').value;
    start = 0;
    console.log(window.innerWidth)

    if(val != null && val != ""){
        limit = Math.max(5, val);
    
        var list = document.getElementById('list-of-articles');
        list.innerHTML = "";
    }

    fetch('https://api.spaceflightnewsapi.net/v3/articles?_limit=' + limit).then(function (response) {
        return response.json();
    }).then(function (data){
        showArticles(data, limit);
    }).catch(function (err) {
        console.warn('Error.', err);
    });

    showNumberOfArticles();
}

function infiniteScroll(){
    start = Number(start) + Number(limit); // variables as numbers
    fetch('https://api.spaceflightnewsapi.net/v3/articles?_limit=' + limit + '&_start=' + start).then(function (response) {
        return response.json();
    }).then(function (data){
        showArticles(data, limit);
        showNumberOfArticles();  
    }).catch(function (err) {
        console.warn('Error.', err);
    });
}

window.addEventListener('scroll', function() {
    if(timer !== null) 
        clearTimeout(timer);        
    timer = setTimeout(function() {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight)
            infiniteScroll();
    }, 100);
}, false);


function showArticles(data, limit){
    var list = document.getElementById('list-of-articles');
    
    for(var i = 0; i < limit; i++){
        // informations about article
        var article = document.createElement('div');
        article.setAttribute('class', 'article-panel');
        article.setAttribute('id', 'art-' + data[i]['id']);
        
        var header = document.createElement('div');
        header.setAttribute('class', 'article-header');
        header.innerHTML = data[i]['title'];

        var info = document.createElement('div');
        info.setAttribute('class', 'info');
        info.innerHTML = "news site: " + data[i]['newsSite'] + "</br>published at: " + data[i]['publishedAt'].substring(0, 10) + ", " + data[i]['publishedAt'].substring(11, 19);

        var summary = document.createElement('div');
        summary.setAttribute('class', 'summary');

        var sum = data[i]['summary'];
        if(sum.length > 200){
            sum = sum.substring(0, 197) + "...";
        }
        summary.innerHTML = sum;

        // create buttons
        var buttons = document.createElement('div');
        buttons.setAttribute('class', 'buttons');

        var readBut = document.createElement('button');
        readBut.setAttribute('class', 'read-button');
        readBut.innerHTML = "Read article";

        var readLink = document.createElement('a');
        readLink.setAttribute('href', data[i]['url']);
        readLink.setAttribute('target', '_blank');
        readLink.setAttribute('class', 'button');

        // add article to site
        readLink.appendChild(readBut);
        buttons.appendChild(readLink);
        buttons.appendChild(addOrRemove(data[i]['id']));

        article.append(header);
        article.append(info);
        article.append(summary);
        article.append(buttons);
        list.append(article);
    }
}

function addOrRemove(id){
    var savedArticles = JSON.parse(localStorage.getItem("saved"));
    
    if(savedArticles.includes(id)){
        var removeFromLib = document.createElement('button');
        removeFromLib.setAttribute('class', 'remove-from-library');
        removeFromLib.setAttribute('id', 'but-' + id);

        var onclickFunc = 'removeFromLibrary(' + id + ', 0)';
        removeFromLib.setAttribute('onclick', onclickFunc);
        removeFromLib.innerHTML = "Remove from Library";
        
        return removeFromLib;
    }
    else{
        var addToLib = document.createElement('button');
        addToLib.setAttribute('class', 'add-to-library');
        addToLib.setAttribute('id', 'but-' + id);

        var onclickFunc = 'addToLibrary(' + id + ')';
        addToLib.setAttribute('onclick', onclickFunc);
        addToLib.innerHTML = "Add to Library";

        return addToLib;
    }
}

function showNumberOfArticles(){
    var articlesHeader = document.getElementById('total');

    fetch('https://api.spaceflightnewsapi.net/v3/articles/count').then(function (response){
        return response.json();
    }).then(function (data){
        var fetched = Number(limit) + Number(start);
        articlesHeader.innerHTML = "Fetched articles: " + fetched + "/" + data;
    }).catch(function (err){
        console.warn('Error.', err);
    });
}