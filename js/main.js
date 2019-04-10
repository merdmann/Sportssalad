'use strict'

document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM Tree loaded')
    //var config = new Map();

    var searchableContents = new Map;

    const LS = window.localStorage;
    const googleId = LS.getItem('googleId');
    
    console.log( googleId );

    LS.setItem("googleId", "hallo")



    function main() {
    	RestoreData();

        _your_image_.setAttribute("src", gravatar("michael.erdmann@snafu.de",120));
        
        //fetchData("http://api.football-data.org/v2/competitions/PL/matches/?matchday=22");
        const _your_image_  = document.getElementById("your-image");
        const _btn_search_  = document.getElementById( "btn-search");
        const _search_text_ = document.getElementById("search_text");
        
        _btn_search_.addEventListener("click", function(){console.log("serach for something" + _search_text_.value);})
        
 
        _your_image_.setAttribute("src", gravatar("michael.erdmann@snafu.de",120));

    }

    main();

    
 // grvaar accss baes on the on th dpcumentst founr at: http://en.gravatar.com/site/implement/
 function gravatar(email, option) {
	// using md5() from here: http://www.myersdaily.org/joseph/javascript/md5-text.html

    return "https://www.gravatar.com/avatar/"+ md5(email.toLowerCase().trim()) + "?s=" + option;
}

    
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
                    'Content-Type': 'application/json',
                     "X-API-Key"  : "wqmgqOHo1JMAkYIfh3sJr4FlUN3PCokyojEziJBK"
                    
            }, mode: "cors"})
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
