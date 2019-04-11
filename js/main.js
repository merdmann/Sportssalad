'use strict'


document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM Tree loaded')

    // grvatar access to pictures based on http://en.gravatar.com/site/implement/ and using md5.
    function gravatar(email, option) {
        const result = "https://www.gravatar.com/avatar/" + md5(email.toLowerCase().trim()) + "?s=" + option;
        console.log(result);
        return result;
    }
    //
    // This function is expetd to update the settings page nd to palce th
    // input fields.
    //
    function update(name) {   
        console.log("update("+name+")");
        const LS = window.localStorage;
        let _elem_ = document.getElementById(name)
        if (_elem_.value != "") {
            _elem_.value = LS.getItem(name);
            console.log(LS.getItem(name));
            
        }
        else {
            console.log("value=" + _elem_.value)
            LS.setItem(name, _elem_.value)
            console.log(LS.getItem(name));
        }
    }

    //
    // This is the main driver performin initial request of data
    //
    function main() {
        const pageTitle = document.title;

        console.log("main :"+ pageTitle);
        
        switch (pageTitle) {
            case "Settings":
                update("google-id");
                update("avatar-id");
                let _btn_test_it_ = document.getElementById('btn-test-it');
                _btn_test_it_.addEventListener("click", function (){console.log("click") })
                break;
            case "Sports Salad":
                fetchData("https://api.football-data.org/v2/competitions/CL/matches");

                const _your_image_ = document.getElementById("your-image");
                const _btn_search_ = document.getElementById("btn-search");
                const _search_text_ = document.getElementById("search_text");

                _btn_search_.addEventListener("click", function () {
                    console.log("serach for something" + _search_text_.value);
                })

                // when logged in  in show your face on the screen.
                _your_image_.setAttribute("src", gravatar("michael.erdmann@snafu.de", 120));
                break;
                
            default:
                console.log("Default" + pageTitle );
        }
    }
    

    // do the per page rendering of the received data
    function ProcessAndRender(data) {
        let pageTitle = document.title;

        console.log("ProcessAndRender nbr of data items: " + data.length +" for " + pageTitle+ ")");
     

        switch (pageTitle) {
            case "Settings":
                update("google-id");
                update("avatar-id");
                break;

        }
    }


    // fetches data 
    function fetchData(url) {
        console.log("fetching" + url);
        fetch(url, {
                headers: {
                    "X-Auth-Token": "bddc8f1b00114b5683e99c5eea4268ac"
                },
                //mode: "cors"
            })
            .then(function (response) {
                document.body.style.cursor = 'wait'
                console.log(response)
                return response.json()
            })
            .then(function (myJson) {
                document.body.style.cursor = 'auto'
                console.log(myJson)
                ProcessAndRender(myJson)
            })
            .catch(err => console.log(err))
    }
    
    main();
}) // DOMContentLoaded handler

