import * as scr from '/scripts.js';

function library_startup(){
    showLibrary();
}

function showLibrary(){
    var savedArticles = JSON.parse(localStorage.getItem("saved"));
    savedArticles.array.forEach(id=> {
        fetch('https://api.spaceflightnewsapi.net/v3/articles/=' + id).then(function (response) {
            return response.json();
        }).then(function (data){
            showArticle(data); 
        }).catch(function (err) {
            console.warn('Error.', err);
        });
    });
}

function showArticle(data){
    // informations about article
    var article = document.createElement('div');
    article.setAttribute('class', 'article-panel');
    article.setAttribute('id', 'a' + data['id']);
    
    var header = document.createElement('div');
    header.setAttribute('class', 'article-header');
    header.innerHTML = data['title'];

    var info = document.createElement('div');
    info.setAttribute('class', 'info');
    info.innerHTML = "news site: " + data['newsSite'] + "</br>published at: " + data['publishedAt'].substring(0, 10) + ", " + data['publishedAt'].substring(11, 19);

    var summary = document.createElement('div');
    summary.setAttribute('class', 'summary');
    summary.innerHTML = data['summary'];

    // create buttons
    var buttons = document.createElement('div');
    buttons.setAttribute('class', 'buttons');

    var readBut = document.createElement('button');
    readBut.setAttribute('class', 'read-button');
    readBut.innerHTML = "Read article";

    var readLink = document.createElement('a');
    readLink.setAttribute('href', data['url']);
    readLink.setAttribute('target', '_blank');
    readLink.setAttribute('class', 'button');

    // add article to site
    readLink.appendChild(readBut);
    buttons.appendChild(readLink);
    buttons.appendChild(scr.addOrRemove(data['id']));

    article.append(header);
    article.append(info);
    article.append(summary);
    article.append(buttons);
    list.append(article);
}

function addToLibrary(id){
    var saved = false;

    // add to library
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

    // change button
    var saveButton = document.getElementById("but-" + id);
    saveButton.setAttribute('class', 'remove-from-library');
    saveButton.innerHTML = "Remove from library";

    var onclickFunc = 'removeFromLibrary(' + id + ')';
    saveButton.setAttribute('onclick', onclickFunc);
}

function removeFromLibrary(id){
    var savedArticles = JSON.parse(localStorage.getItem("saved"));
    console.log(savedArticles);

    const index = savedArticles.indexOf(id);
    if(index == -1){
        console.log("Error, your library doesn't have this element.");
    }
    else{
        // add to library
        savedArticles.splice(index, 1);
        localStorage.setItem("saved", JSON.stringify(savedArticles));

        // change button
        var removeButton = document.getElementById("but-" + id);
        removeButton.setAttribute('class', 'add-to-library');
        removeButton.innerHTML = "Add to library";

        var onclickFunc = 'addToLibrary(' + id + ')';
        removeButton.setAttribute('onclick', onclickFunc);
    }
}