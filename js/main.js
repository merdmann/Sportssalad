'use strict'


document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM Tree loaded')

    let searchText = "";
    const _your_image_ = document.getElementById("your-image");
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
                break;
            case "Sports Salad": // the main page
                _your_image_.setAttribute("src", gravatar("michael.erdmann@snafu.de", 240));
                fetchData("https://api.football-data.org/v2/competitions/CL/matches");

            default:
                console.log("Default" + pageTitle);
        }
    }


    // this function will take a list of names sorted accoring to engagment of the person.
    function FillTable(root, data, filter) {
        let shownLines=0;
        let tbdy = document.getElementById(root);
        if (tbdy == null) {
            consoe.log(root + "not found.....")
            return;
        }
   
        // for all data
        data.forEach(function (item) {
            var tr = tbdy.insertRow(-1)
            var td = tr.insertCell(0)

            let line = item.getUTCDate + ' ' + item.homeTeam.name + ' ' + item.awayTeam.name;
            if (line.includes(filter)) {

                td.appendChild(document.createTextNode(' ' + item.utcDate))

                // home team
                td = tr.insertCell(-1)
                td.appendChild(document.createTextNode(' ' + item.homeTeam.name))

                // 
                td = tr.insertCell(-1)
                td.appendChild(document.createTextNode(' ' + item.awayTeam.name))
                td.classList.add("last-col");

                tbdy.appendChild(tr);
                
                if (shownLines++ % 18 == 0) {}
                
            }
        }) // end for each
    }

    // do the per page rendering of the received data
    function ProcessAndRender(data) {
        let pageTitle = document.title;

        console.log("ProcessAndRender nbr of data items: " + data.matches.length + " for " + pageTitle + ")");

        switch (pageTitle) {
            case "Settings":
                update("google-id");
                update("avatar-id");
                break;

            case "Sports Salad":
                _your_image_.setAttribute("src", gravatar("Michael.erdmann@snafu.de"))
                FillTable("summary-table", data.matches, searchText);
                
                _search_text_.addEventListener('keypress', function (e) {
                    console.log( searchText )
                    searchText = _search_text_.value;
                    document.getElementById("summary-table").innerHTML = "";
                    FillTable( "summary-table", data.matches, searchText )
                });
                break;
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

                ProcessAndRender(myJson)
            })
            .catch(err => console.log(err))
    }

    main();
}) // DOMContentLoaded handler
