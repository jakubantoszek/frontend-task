function get_list_of_articles(){
    var x = 15;
    var val = document.getElementById('num').value;
    if(val != null && val != "")
        x = val;
    console.log(x);

    fetch('https://api.spaceflightnewsapi.net/v3/articles?_limit=' + x).then(function (response) {
        return response.json();
    }).then(function (data){
        show_articles(data, x);    
    }).catch(function (err) {
        console.warn('Something went wrong.', err);
    });
}

function show_articles(data, x){
    var list = document.getElementById('articles');
    list.innerHTML = "";

    for(var i = 0; i < x; i++){
        var link = document.createElement('a');
        link.setAttribute('href', data[i]['url']);
        link.setAttribute('target', '_blank');
        link.appendChild(document.createTextNode(data[i]['title']));

        var element = document.createElement('li');
        element.appendChild(link);
        list.appendChild(element);
    }
}