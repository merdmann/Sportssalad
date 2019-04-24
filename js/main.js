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


	function login() {
  		var provider = new firebase.auth.GoogleAuthProvider();

  	firebase
    	.auth()
    	.signInWithPopup(provider)
    	.then(function(result) {
      // The signed-in user info.
      	var user = result.user;
     	console.log("Login successful!");
      	console.log(user.displayName);
      	userName = user.displayName;
      	console.log(user.email);
      	userEmail = user.email;
      	getPosts();
    	})
    	.catch(function(error) {
      	// Handle Errors here.
      	var errorCode = error.code;
      	var errorMessage = error.message;
      	console.log(errorCode, errorMessage);
    });
}


    // grvatar access to pictures based on http://en.gravatar.com/site/implement/ and using md5.
    function gravatar(email, option) {
        const result = "https://www.gravatar.com/avatar/" + md5( email.toLowerCase().trim()) +  "?s=" + option;
        console.log(result);
        return result;
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
        if (_elem_ !== null) {
            _elem_.value = LS.getItem(name);
            _elem_.addEventListener('change', function() {
            	LS.setItem(name,_elem_.value ) });
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
                update("google-Id");
                update("your-name");
                update("gravatar-id");
                update("your-city");
                break;
            case "flash":
                fetchData("https://api.football-data.org/v2/competitions/2018/teams");
            case "Sports Salad": // the main page. provide greeting
                var _span_greeting_ = document.getElementById("span-greeting");
                _span_greeting_.innerHTML = "Hi " + LS.getItem("your-name");

                _your_image_.setAttribute("src", gravatar(LS.getItem("gravatar-id"), 240));
                fetchData("https://api.football-data.org/v2/competitions/CL/matches");
                const _signIn_ = document.getElementById("btn-signIn");
                _signIn_.addEventListener("click", function() {
                	console.log("***doing login");
                	login();
                	console.log("***doing login");
                })
                break;
            case "list of interest":
                let liOfInt = JSON.parse(LS.getItem("listOfInt"));
                console.log(liOfInt);
                let template = ` `;
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
    
    function TeamLogo( id ) { 
        let _img_ = document.createElement("img");        
        _img_.setAttribute("src", getLogoURL( id ))
        _img_.classList.add("logoImg");
        _img_.setAttribute("alt", id + getLogoURL(id))
        
        return _img_;
    }


    function HL( id ) {
        const _row_ = document.getElementById(id);
        _row_.classList.add( "HL");
    }

    // this function will take a list of names sorted accoring to engagment of the person.
    function FillTable(root, data, filter) {
        const LS = window.localStorage;
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
        data.sort(by_status).forEach(function (item, index) {
            const tr = tbdy.insertRow(-1)
            const td = tr.insertCell(-1);
            tbdy.classList.add( "gamesTable");
            var liOfInt = JSON.parse( LS.getItem("liOfInt") );
            if( !Array.isArray(liOfInt))
                liOfInt = [];

			tr.classList.add(item.status) // handle the click on the game
            tr.addEventListener("click", function() { 
                let id = this.id.split('-')[1];
                liOfInt.push( data[id] )
                console.log( liOfInt.length )
                let jason = JSON.stringify(liOfInt);
                console.log( jason );
                LS.setItem("liOfInt", JSON.stringify(jason));
                HL(this.id)
            })
            tr.setAttribute("id", "match-"+index);

            console.log(item);
            // this implemnt the filter for a givem Teams or anyhing else
            let line = item.getUTCDate + ' ' + item.homeTeam.name + ' ' + item.awayTeam.name + "!" + TheWinnerIs(item);
            if (line.includes(filter)) {
                let Days = 0;
         		if(item.satus == "SCHEDULED") {
            		const date1 = new Date();
					const date2 = new Date(item.season.startDate);
					const diffTime = Math.abs(date2.getTime() - date1.getTime());
					Days = Math.ceil(diffTime / (MS * SEC * HRS * 24));

					td = tr.insertCell(0);
					td.classList.add(item.status)
					td.appendChild(document.createTextNode(' ' + item.season.startDate + "in " + Days + "days"));
				} 

                td.classList.add("last-col");
                // home team
                
                let td = tr.insertCell(-1)
                td.appendChild( TeamLogo( item.awayTeam.id));
                td.appendChild(document.createTextNode(' ' + item.homeTeam.name + "="+ item.homeTeam.id + "  vs   ")) ;
                td = tr.insertCell(-1)
    
                td.appendChild(document.createTextNode(' ' + item.awayTeam.name + "=" + item.awayTeam.id));
    
    			if(item.status == "FINISHED") {
                	if (item.score.winner != "DRAW") {
                    	let winner = TheWinnerIs(item);
                    	td = tr.insertCell(-1)
                    	td.appendChild(document.createTextNode(winner))
                	}
            	}
            	if(item.satus == "SCHEDULED") {
            		tr.classList.add( "scheduled");
            	}
                td.classList.add("last-col");
                td = tr.insertCell(-1);
                
                //td.appendChild( TeamLogo( item.awayTeam.id));
                td.appendChild( TeamLogo( item.homeTeam.id))
                
                tbdy.appendChild(tr);
            
                console.log( item.status)
                if(lastState == null) {
                	lastState = item.status;
                	return  // continue to next item
                }

                if ( lastState !== item.status) { 
                    lastState = item.status;
                    console.log( "insert" + lastState );
                    // paginatiomn will be put if the state is changing
                    /* <li class="page-item"><a class="page-link" href="#">1</a></li>*/
                    const li = document.createElement("li");
                    li.classList.add("page-item");
                    const a = document.createElement("a")
                    a.setAttribute("name", lastState);
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
            case "list of interest":
                let liOfInt= JSON.parse(LS.getitem("listOfInt"));

                comsole.log(liOfInt);
                liOfInt.forEach(function(item) { 
                    let template = ``;
                    template += `<div class="card">
                             <div class="card-body">
                             ${item.homeTeam.name} 
                             </div>
                             </div>`
                })
                const _int_list_ = document.getElmentById("interest-list")
                _int_list_.innerHTML = template;

                           

        



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
