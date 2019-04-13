'use strict'


document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM Tree loaded')

    const _your_image_ = document.getElementById("your-image");
    const _btn_search_ = document.getElementById("btn-search");
    const _search_text_ = document.getElementById("search-text");

    
    // grvatar access to pictures based on http://en.gravatar.com/site/implement/ and using md5.
    function gravatar(email, option) {
        const result = "https://www.gravatar.com/avatar/" + md5(email.toLowerCase().trim()) + "?s=" + option;
        console.log(result);
        return result;
    }
    //
    // This function is expectd to update the settings page and to place th
    // input fields.
    //
    function update(name) {
        const LS = window.localStorage;
        console.log("update(" + name + ")");
        let _elem_ = document.getElementById(name)
        if (_elem_.value !== "" && _elem !== null) {
            _elem_.value = LS.getItem(name);
            console.log(LS.getItem(name));
        } else {
            console.log("value=" + _elem_.value)
            LS.setItem(name, _elem_.value);
        }
    }

    //
    // This is the main driver performing an initial request of data after the page has been
    // rendered.
    //
    function main(data) {
        const pageTitle = document.title;
        const LS = window.localStorage;

        console.log("main :" + pageTitle);

        switch (pageTitle) {
            case "Settings":
                update("google-id");
                update("avatar-id");
                
                // install the handklers for butoms
                let _btn_test_it_ = document.getElementById('btn-test-it');
                _btn_test_it_.addEventListener("click", function () {
                    LS.setItem("your-name", document.getElementById("your-name").value)
                    console.log(LS.getItem("your-name"))
                    console.log("click")
                })
                break;
            case "Sports Salad":
                _your_image_.setAttribute("src", gravatar("michael.erdmann@snafu.de", 120));
                fetchData("https://api.football-data.org/v2/competitions/CL/matches");
                _your_image_.setAttribute("src", gravatar("Michael.erdmann@snafu.de"))
                

                _btn_search_.addEventListener("click", function () {
                    
                })

                console.log(_your_image_.className);
                FillTable("Summary-Table", data.matches);


                // when logged in  in show your face on the screen.

                break;

            default:
                console.log("Default" + pageTitle);
        }
    }

    // this function will take a list of names sorted accoring to engagment of the person.
    function FillTable(root, data) {
        let tbdy = document.getElementById(root);
        if (tbdy == null) return;


        data.forEach(function (item) {
            var tr = tbdy.insertRow(-1)
            var td = tr.insertCell(0)

            td.appendChild(document.createTextNode(item.utcDate))

            // missed votes
            td = tr.insertCell(-1)
            td.appendChild(document.createTextNode(item.homeTeam.name))

            // missed votes in %
            td = tr.insertCell(-1)
            td.appendChild(document.createTextNode(item.awayTeam.name))

            tbdy.appendChild(tr)
        }) // end for each
    }



    // do the per page rendering of the received data
    function ProcessAndRender(data) {
        let pageTitle = document.title;

        console.log("ProcessAndRender nbr of data items: " + data.matches.length + " for " + pageTitle + ")");

        FillTable("Summary-Table", data.matches);
    
        switch (pageTitle) {
            case "Settings":
                update("google-id");
                update("avatar-id");
                break;
            case "Sport Salad":
                _your_image_.setAttribute("src", gravatar("Michael.erdmann@snafu.de"))

        }
    }

    // fetches data from the  server
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
