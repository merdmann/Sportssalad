'use strict'
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM Tree loaded')
    let Teams = new Map();
    let searchText = "";
    const _your_image_ = document.getElementById("your-image");
    const _search_text_ = document.getElementById("search-text");
    const MS = 1000 /* 1000 ms == 1 seconds */
    const HR = 60 /* 60 min /  hr */
    const SEC = 60 /* 60 sec / min */
    const LS = window.localStorage;
    // grvatar access to pictures based on http://en.gravatar.com/site/implement/ and using md5.
    function gravatar(email, option) {
        const result = "https://www.gravatar.com/avatar/" + md5(email.toLowerCase().trim()) + "?s=" + option;
        console.log(result);
        return result;
    }
    
    function Restore(name) {
        return LS.getItem(name);
    }


    function IsVsible(name) {
        let item = document.getElementById(name);

        return item.display == "none";
    }
    //
    // This function is expectd to update the settings page and to place th
    // input fields.
    //
    function update(name) {
        const LS = window.localStorage;
        console.log("update(" + name + ")");
        let _elem_ = document.getElementById(name);
        if (_elem_.value !== "" && _elem !== null) {
            _elem_.value = LS.setItem(name, _elem_.value);
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
                console.log(Restore("your-city"))
                update("google-id");
                update("avatar-id");
                update("your-city");
                break;
            case "flash":
                fetchData("https://api.football-data.org/v2/competitions/2018/teams");
            case "Sports Salad": // the main page
                _your_image_.setAttribute("src", gravatar("michael.erdmann@snafu.de", 240));
                fetchData("https://api.football-data.org/v2/competitions/CL/matches");
                break;
            default:
                console.log("Default" + pageTitle);
        }
    }
    /*
     * calculae the winner team 
     */
    function TheWinnerIs(item) {
        if (item.score.winner != "DRAW") {
            let winner = item.score.winner == "AWAY_TEAM" ?
                item.awayTeam.name : item.homeTeam.name;
            return winner;
        }
    }
    
    function TeamLogo( id ){ 
        let _img_ = document.createElement("img");        
        _img_.setAttribute("src", getLogoURL( id ))
        _img_.classList.add("logoImg");
        
        return _img_;
    }


    // this function will take a list of names sorted accoring to engagment of the person.
    function FillTable(root, data, filter) {
        let shownLines = 0;
        let tbdy = document.getElementById(root);
        if (tbdy == null) {
            consoe.log(root + " not found.")
            return;
        }
        
        const by_status = function (a,b) {
            if (a.status < b.status)
                return -1;
    	    if (a.status > b.status)
                return 1;
            return 0;
        }

        
        let lastState = null;
        // for all data
        data.sort(by_status).forEach(function (item) {
            var tr = tbdy.insertRow(-1)
            var td = tr.insertCell(0)

            console.log(item);
            // this implemnt the filter for a givem Teams or anyhing else
            let line = item.getUTCDate + ' ' + item.homeTeam.name + ' ' + item.awayTeam.name + "!" + TheWinnerIs(item);
            if (line.includes(filter) /* || item.status == "SCHEDULED" */) {
                let date = item.utcDate.split('T')
                td.appendChild(document.createTextNode(' ' + item.startDate))
                td.classList.add("last-col");
                console.log(td.classList);
                // home team
                
                td = tr.insertCell(-1)
                
                td.appendChild(document.createTextNode(' ' + item.homeTeam.name + "="+ item.homeTeam.id));
                td = tr.insertCell(-1)
    
                td.appendChild(document.createTextNode(' ' + item.awayTeam.name + "=" + item.awayTeam.id));
    
                if (item.score.winner != "DRAW") {
                    let winner = TheWinnerIs(item);
                    td = tr.insertCell(-1)
                    td.appendChild(document.createTextNode(winner))
                }
                td.classList.add("last-col");
                td = tr.insertCell(-1);
                
                td.appendChild( TeamLogo( item.awayTeam.id));
                td.appendChild( TeamLogo( item.homeTeam.id))
       
                tbdy.appendChild(tr);
            
                console.log( item.status)
                if(lastState == null) {
                	lastState = item.status;
                	return  // continue to next item
                }

                if ( lastState !== item.status) { 
                    lastState = item.status;
                    console.log( lastState );
                    // paginatiomn will be put if the state is changing
                    /* <li class="page-item"><a class="page-link" href="#">1</a></li>*/
                    const li = document.createElement("li");
                    li.classList.add("page-item");
                    const a = document.createElement("a")
                    console.log(item.status)
                    
                    li.appendChild(a);
                    a.setAttribute("href", lastState);
                    a.classList.add("page-link")
                    a.innerHTML = lastState;
                    
                    td.appendChild(li);
                }
            }
        }) // end for each
    }

    // do the per page rendering of the received data
    function ProcessAndRender(data) {
        let pageTitle = document.title;
        switch (pageTitle) {
            case "flash":
                console.log(data.teams);
                Array.from(data.teams).forEach(function (item) {
                    console.log(item.id);

                    Teams.set(item.id, {
                        venue: item.venue,
                        address: item.addess
                    })

                })
                break;
            case "Settings":
                update("google-id");
                update("avatar-id");
                update("your-city");
                break;
            case "Sports Salad":
                console.log("ProcessAndRender nbr of data items: " + data.matches.length + " for " + pageTitle + ")");
                _your_image_.setAttribute("src", gravatar("Michael.erdmann@snafu.de"))
                FillTable("summary-table", data.matches, searchText);
                _search_text_.addEventListener('keypress', function (e) {
                    console.log(searchText)
                    searchText = _search_text_.value;
                    document.getElementById("summary-table").innerHTML = "";
                    FillTable("summary-table", data.matches, searchText)
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
