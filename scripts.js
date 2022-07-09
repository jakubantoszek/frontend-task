// #TODO task 3
var x = 15;

function startup(){
    getListOfArticles();
    showNumberOfArticles();
}

function getListOfArticles(){
    var val = document.getElementById('num').value;
    if(val != null && val != "")
        x = val;

    fetch('https://api.spaceflightnewsapi.net/v3/articles?_limit=' + x).then(function (response) {
        return response.json();
    }).then(function (data){
        showArticles(data, x);
        showNumberOfArticles();    
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
        article.setAttribute('id', 'a' + data[i]['id']);
        
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

        var onclickFunc = 'removeFromLibrary(' + id + ')';
        removeFromLib.setAttribute('onclick', onclickFunc);
        removeFromLib.innerHTML = "Remove from library";
        
        return removeFromLib;
    }
    else{
        var addToLib = document.createElement('button');
        addToLib.setAttribute('class', 'add-to-library');

        var onclickFunc = 'saveToLibrary(' + id + ')';
        addToLib.setAttribute('onclick', onclickFunc);
        addToLib.innerHTML = "Add to library";

        return addToLib;
    }
}

function showNumberOfArticles(){
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
    var saved = false;

    if (localStorage.getItem("saved") === null) { // local storage is empty
        var savedArticles = [id];
        localStorage.setItem("saved", JSON.stringify(savedArticles));
    }
    else {
        var savedArticles = JSON.parse(localStorage.getItem("saved"));

        if(savedArticles.includes(id)){
            console.log("Error, your library has this element.");
            return false; // continue only if item is saved
        }
        else{
            savedArticles.push(id);
            localStorage.setItem("saved", JSON.stringify(savedArticles));
        }
    }
}

function removeFromLibrary(id){
    var savedArticles = JSON.parse(localStorage.getItem("saved"));
    console.log(savedArticles);

    const index = savedArticles.indexOf(id);
    if(index == -1){
        console.log("Error, your library doesn't have this element.");
    }
    else{
        savedArticles.splice(index, 1);
        localStorage.setItem("saved", JSON.stringify(savedArticles));
    }
}