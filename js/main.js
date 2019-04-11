'use strict'


document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM Tree loaded')

    function update(name) {
        const LS = window.localStorage;
        const _elem_ = document.getElementById(name)
        _elem_.value = LS.getItem(name) == null ? "not def." : ""
        LS.setitem(name, _elem_.value);
    }



    function main() {
       
        fetchData("https://api.football-data.org/v2/competitions");
        const _your_image_ = document.getElementById("your-image");
        const _btn_search_ = document.getElementById("btn-search");
        const _search_text_ = document.getElementById("search_text");

        _btn_search_.addEventListener("click", function () {
            console.log("serach for something" + _search_text_.value);
        })
        _your_image_.setAttribute("src", gravatar("michael.erdmann@snafu.de", 120));

        ProcessAndRender();
    }

    main();


    // grvaar accss baes on the on th dpcumentst founr at: http://en.gravatar.com/site/implement/
    function gravatar(email, option) {
        // using md5() from here: http://www.myersdaily.org/joseph/javascript/md5-text.html
        const result = "https://www.gravatar.com/avatar/" + md5(email.toLowerCase().trim()) + "?s=" + option;
        console.log( result );
        return result;
    }

    function ProcessAndRender(data) {
        const pageTitle = document.title;

        switch (pageTitle) {
            case "Settings":
                update("google-Id");
                update("Avatar Id");
                break;

        }

    }

    // Needs to be refctored since it hides intention bhind a boolean,
    function fetchData(url) {
        fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    "X-Auth-Key": "bddc8f1b00114b5683e99c5eea4268ac"
                },
                mode: "cors"
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
