'use strict'

document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM Tree loaded')

    var searchableContents = new Map;

    function main() {
        fetchData("https://api.myjson.com/bins/udbm5")
        
         console.log("Setting up search");
         const btnBookSearch = document.getElementById("btn-book-search");
         const searchString = document.getElementById("search-string");
    
         searchString.addEventListener("keyup", function(event) {
            // Number 13 is the "Enter" key on the keyboard
            console.log("do search:"+searchString.value);
            event.preventDefault();
            search(searchString.value);
         })
    }
    
    main();
    
    //
    // find a key which contains the value and return the objet data
    //
    function search(value){
        let result = [];
        console.log("search for"+value);

        let keys = [];
        for (let key of searchableContents)
            if( key.indexOf( value ) > 0 )
                 keys.push(key);
            console.log(keys);
        console.log(result);
        return result;
    }


    //
    // THis function is expected to simplify process of building dsynamically data
    // sructures.
    //
    function addElement(parent, elem, className, id, value) {
        var element = document.createElement(elem);
        if (className !== "") {
            var classes = className.split(" ");
            
            if( classes.length > 0 ) {
                classes.forEach( function(item) {
                    element.classList.add(item) 
                })
            }
        }

        if (id !== "")
            element.setAttribute(id, value);

        parent.appendChild(element)

        return element;
    }

    function uniqId(item, id) {
        return item + "-" + id;
    }

    // place a card newr the given location 
    function placeCard(location) {
        const root = document.getElementById(location);

        const div0 = addElement(root, "div", "card", "style", "width: 18rem")
        
        const div1 = addElement(div0, "div", "flip-card book", "style", "flex-basis: auto; border:thin")
        const div2 = addElement(div1, "div", "flip-card-inner", "", "")
        const div3 = addElement(div2, "div", "flip-card-front", "", "")
        const img = addElement(div3, "img", "", "id", uniqId(location, "book-front-cover"))
        img.setAttribute("style", "width:80%");
        const div4 = addElement(div3, "div", "flip-card-back", "");
        const h1 = addElement(div3, "h3", "", "id", uniqId(location, "book-autor-name"));
        const p = addElement(div3, "p", "", "", "");
        const div5 = addElement(div0, "div", "card-body", "", "");
        const h5 = addElement(div0, "h5", "card-title", "id", uniqId(location, "book-title"));
        const pp = addElement(div0, "p", "card-text", "id", uniqId(location, "card-text"));
        const a = addElement(div0, "a", "btn", "id", uniqId(location, "more-info"));
        a.classList.add("btn-primary");
        root.appendChild(div0);

        return root;
    }

    function SearchKey( elem ) {
        return elem.descripcion & elem.titulo;
    }

    function Show(location, elem) {
        const frontCover = elem.portada;
        const moreInfo = elem.detallee;
        const title = elem.titolo;

        //console.log( elem )
        console.log( "Show:" + elem.titulo );
        searchableContents.set( SearchKey(elem), elem );

        placeCard(location);

        const _book_front_cover_ = document.getElementById(uniqId(location, "book-front-cover"));
        _book_front_cover_.setAttribute("src", frontCover); // put the image

        const _book_autor_name_ = document.getElementById(uniqId(location, "book-autor-name"));
        _book_autor_name_.innerHTML = elem.descripcion;
        const _book_title_ = document.getElementById(uniqId(location, "book-title"));
        _book_title_.innerHTML = elem.titulo;
        const _more_info_ = document.getElementById(uniqId(location, "more-info"));
        _more_info_.setAttribute("href", elem.detallee);

        //var _book_description_ = document.getElementById(uniqId( location, "book-description"));
        //  _book_description_.innerHTML = elem.description;
    };

    function ProcessAndRender(data) {
        const books = data["books"]

        books.forEach(function (item) {
            Show("card", item);
        })
    }

    // Needs to be refctored since it hides intention bhind a boolean,
    function fetchData(url) {
        fetch(url, {
                headers: {
                    'Content-Type': 'application/json'
                    /* "X-API-Key": "wqmgqOHo1JMAkYIfh3sJr4FlUN3PCokyojEziJBK" */
                }
                /* mode: "cors" */
            })
            .then(function (response) {
                document.body.style.cursor = 'wait'
                return response.json()
            })
            .then(function (myJson) {
                //console.log(myJson);
                document.body.style.cursor = 'auto'

                ProcessAndRender(myJson)
            })
            .catch(err => console.log(err))
    }

}) // DOMContentLoaded handler
