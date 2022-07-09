var objectsArray = [];

class Article{
    constructor(data){
        this.id = data['id'];
        this.publishedAt = data['publishedAt'];
        this.title = data['title'];
    }
}

function libraryStartup(){
    showLibrary(1);
}

function showLibrary(callInfo){
    var list = document.getElementById('list-of-articles');
    list.innerHTML = "";
    var savedArticles = JSON.parse(localStorage.getItem("saved"));

    if(savedArticles.length == 0){
        var empty = document.createElement('div');
        empty.setAttribute('id', 'empty');
        empty.innerHTML = "You didn't have any articles in the library.";

        document.body.appendChild(empty);
    }
    else{
        savedArticles.forEach(id=> {
            fetch('https://api.spaceflightnewsapi.net/v3/articles/' + id).then(function (response) {
                return response.json();
            }).then(function (data){
                showArticle(data, list);
                
                if(callInfo == 1) // called by libraryStartup
                    objectsArray.push(new Article(data));
            }).catch(function (err) {
                console.warn('Error.', err);
            });
        });
    }
}

function showArticle(data, list){
    // informations about article
    var article = document.createElement('div');
    article.setAttribute('class', 'article-panel');
    article.setAttribute('id', 'art-' + data['id']);
    
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
    buttons.appendChild(addButton(data['id']));

    article.append(header);
    article.append(info);
    article.append(summary);
    article.append(buttons);
    list.append(article);
}

function addButton(id){
    var removeFromLib = document.createElement('button');
    removeFromLib.setAttribute('class', 'remove-from-library');
    removeFromLib.setAttribute('id', 'but-' + id);

    var onclickFunc = 'removeFromLibrary(' + id + ', 1)';
    removeFromLib.setAttribute('onclick', onclickFunc);
    removeFromLib.innerHTML = "Remove from library";
        
    return removeFromLib;
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

function removeFromLibrary(id, lib){
    // lib = 0 - Articles site, lib = 1 - Library site
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

        if(lib == 0){
            // change button
            var removeButton = document.getElementById("but-" + id);
            removeButton.setAttribute('class', 'add-to-library');
            removeButton.innerHTML = "Add to library";

            var onclickFunc = 'addToLibrary(' + id + ')';
            removeButton.setAttribute('onclick', onclickFunc);
        }
        else{
            // delete element
            var removedArticle = document.getElementById("art-" + id);
            document.getElementById('list-of-articles').removeChild(removedArticle);
            
            if(savedArticles.length == 0){
                var empty = document.createElement('div');
                empty.setAttribute('id', 'empty');
                empty.innerHTML = "You didn't add any articles to library.";

                document.body.appendChild(empty);
            }
        }
    }
}

function sortArticles(){
    sorting = document.getElementById('sorting').value;
    showLibrary();
}