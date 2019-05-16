
'use strict'
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM Tree loaded')
    main();
});

    let searchText = "";
    const _your_image_ = document.getElementById("your-image");
    const _search_text_ = document.getElementById("search-text");
    const MS = 1000 /* 1000 ms == 1 seconds */
    const HR = 60 /* 60 min /  hr */
    const SEC = 60 /* 60 sec / min */
    const LS = window.localStorage;
    const _ListOfInt_ = "listOfInt";

    var database = firebase.database();

    // login into firebase
    function login() {
        var provider = new firebase.auth.GoogleAuthProvider();

        firebase
            .auth()
            .signInWithPopup(provider)
            .then(function (result) {
                // The signed-in user info.
                var user = result.user;
                console.log("Login successful!");
                console.log(user.displayName);
                var userName = user.displayName;
                console.log(user.email);
                var userEmail = user.email;
                getPosts();
            })
            .catch(function (error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage);
            });

        const _btn_post_ = document.getElementById("_btn_post_");
        _btn_post_.addEventListener( 'click', function() {
            console.log("Post .....");
            writeNewPost();
        });

    } /*login*/


    function writeNewPost() {
        const LS = window.localStorage;
        console.log("in write post");
        const userInput = document.querySelector("post").value;

        // A post entry.
        var postData = {
            author: LS.getItem("your-name"),
            body: userInput,
            date: new Date().toISOString()
        };

        console.log(postData);

        // Get a key for a new Post.
        var newPostKey = firebase
            .database()
            .ref()
            .child("posts")
            .push().key;

        // Write the new post's data simultaneously in the posts list and the user's post list.
        var updates = {};
        updates["/posts/" + newPostKey] = postData;

        firebase
            .database()
            .ref()
            .update(updates);

        // getPosts();
    } /* writeNewPost */


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
            _elem_.addEventListener('change', function () {
                LS.setItem(name, _elem_.value)
            });
        } else {
            console.log("value=" + _elem_.value)
            LS.setItem(name, _elem_.value);
        }
}

/* turn display for all elements with the given name */
function show(name) {
    const cls = document.querySelectorAll(name);
    cls.forEach( function( elem ) { elem.style.display = "initial"; })

    return cls;
}

/* turn display class on */
function hide(name) {
    const cls = document.querySelectorAll(name);
    cls.forEach( function( elem ) { elem.style.display = "none"; })

    return cls;
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

function InitiateTeamRQ(team) {
    console.log("Team ");
    fetchData("http://api.football-data.org/v2/teams/"+team);  
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
                update("google-Id");
                update("your-name");
                update("gravatar-id");
                update("your-city");
                break;

            case "Sports Salad": // the main page. provide greeting
            	hide(".settings");
                hide(".pitch");
                show(".homepage")
                hide(".chat")
                
                var _span_greeting_ = document.getElementById("span-greeting");
                _span_greeting_.innerHTML = "Hi " + LS.getItem("your-name");

                _your_image_ /* .setAttribute("src", gravatar(LS.getItem("gravatar-id"), 240));*/
                fetchData("https://api.football-data.org/v2/competitions/CL/matches");
/*                const _signIn_ = document.getElementById("btn-signIn");
                _signIn_.addEventListener('click', function () {
                    console.log("sign in .....");
                    login();
                }); */
                break; 
                
            case "Team":
                console.log("Team ");
                fetchData("http://api.football-data.org/v2/teams/7282");
                break;
                
            case "list of interest":
                let liOfInt = JSON.parse(LS.getItem(_ListOfInt_));
                console.log(liOfInt);
                var template = ``;
                liOfInt.forEach(function (item, index) {
                    template += `<div id=${"card"+index} class="card solid">
                     		 <strong>  ${moment(item.utcDate).fromNow()} ${getStadion(item.homeTeam.id)}</strong> 
                             <div class="card-body">
                             <strong>(${item.homeTeam.name} vs ${item.awayTeam.name})</strong>
                             </div>
                             ${item.utcDate} 
                             <button type="button" id=${"bcard"+index} onclick="removecard(${index})"class="btn btn-primary">Remove</button>
                             <button type="button" class="btn btn-primary">Info</button>
                             <input> 
                             </div>`
                })
                const _int_list_ = document.getElementById("interest-list")
                _int_list_.innerHTML = template;
                break;

            default:
                console.log("Default" + pageTitle);
        }
    } /* main */



    /* highlight the picked team line */
    function HL(id) {
        const _row_ = document.getElementById(id);
        _row_.classList.add("HL");
    }

    /* this function biold the table of all teams */
    function FillTable(root, data, filter) {
        const LS = window.localStorage;
        let shownLines = 0;
        let tbdy = document.getElementById(root);
        if (tbdy == null) {
            console.log(root + " not found.")
            return;
        }

        const by_status = function (a, b) {
            if (a.status < b.status)
                return -1;
            if (a.status > b.status)
                return 1;
            return 0;
        }

        let lastState = null;
        const _summary_table_ = document.getElementById("summary-table");
        
        // for all data
        data.sort(by_status).forEach(function (item, index) {
            let row = `<tr>
            	<td><img src="${getLogoURL(item.homeTeam.id)}" class="img-logo"></img></td>
            	<td>${item.homeTeam.name} <span> vs </span></td>
            	<td>${item.awayTeam.name} ${getStadion(item.awayTeam.id)}</td>
                <td><img src="${getLogoURL(item.awayTeam.id)}" class="img-logo"></img></td>
                <td><a href="https://www.google.com/maps/search/?api=1&query=${getStadion(item.awayTeam.id)}">${getStadion(item.awayTeam.id)}</a>
            </tr>`;
            
            _summary_table_.innerHTML += row;
            console.log(row);

        /*</tr>           
            var tr = tbdy.insertRow(-1);
            var td = tr.insertCell(-1);
            tbdy.classList.add("gamesTable");
            var liOfInt = JSON.parse(LS.getItem(_ListOfInt_));
            if (!Array.isArray(liOfInt))
                liOfInt = [];

            tr.classList.add(item.status) // handle the click on the game list
            tr.addEventListener("click", function () {
                let id = this.id.split('-')[1];
                liOfInt.push(data[id])
                console.log(liOfInt.length)
                let jason = JSON.stringify(liOfInt);
                // console.log( jason );
                LS.setItem(_ListOfInt_, jason);
                HL(this.id)
            })
            tr.setAttribute("id", "match-" + index);

            // console.log(item);
            // this implemnt the filter for a givem Teams or anyhing else
            let line = item.getUTCDate + ' ' + item.homeTeam.name + ' ' + item.awayTeam.name + "!" + TheWinnerIs(item);
            if (line.includes(filter)) {
                let Days = 0;
                if (item.status == "SCHEDULED") {
                    const date1 = new Date();
                    const date2 = new Date(item.season.startDate);
                    const diffTime = Math.abs(date2.getTime() - date1.getTime());
                    Days = Math.ceil(diffTime / (MS * SEC * HRS * 24));

                    td = tr.insertCell(-1);
                    td.classList.add(item.status)
                    td.appendChild(document.createTextNode(' ' + item.season.startDate + "in " + Days + "days"));
                }

                td.classList.add("last-col");
                // home team
                td = tr.insertCell(-1);
                td.appendChild(TeamLogo(item.awayTeam.id, item.awayTeam.name));
                td = tr.insertCell(-1);
                td.appendChild(document.createTextNode(item.awayTeam.name + ' vs ' + item.homeTeam.name));
                td = tr.insertCell(-1)

                //td.appendChild(document.createTextNode(' ' + item.awayTeam.name ));

                if (item.status == "FINISHED") {
                    if (item.score.winner != "DRAW") {
                        let winner = TheWinnerIs(item);
                        td = tr.insertCell(-1)
                        td.appendChild(document.createTextNode(winner))
                    }
                }
                if (item.satus == "SCHEDULED") {
                    tr.classList.add("scheduled");
                }
                td.classList.add("last-col");
                td = tr.insertCell(-1);

                //td.appendChild( TeamLogo( item.awayTeam.id));
                td.appendChild(TeamLogo(item.homeTeam.id, item.homeTeam.name))

                tbdy.appendChild(tr);

                //console.log( item.status)
                if (lastState == null) {
                    lastState = item.status;
                    return // continue to next item
                }

                if (lastState !== item.status) {
                    lastState = item.status;
                    // IN case the state changes we add bootstrap pagination tag
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
            } */
        }) // end for each
    } /*FillTable*/
    
    function NbrOf(array, string){
        let result = 0;
        array.forEach( function(item) {
            if( item.indexOf(string))
                ++result;
        })
        return result;
    }

    // do the per page rendering of the received data
    function ProcessAndRender(data) {
        console.log("ProcessAndRender");
        let pageTitle = document.title;
        let position = [];
        
        switch (pageTitle) {
            case "flash": // not used
                break;
            case "Team":
                let template = "";
                let position = [];
                console.log(data);
                data.squad.forEach( function( item ) {            
                    let nbr = NbrOf( position, item.position );
                    
                    console.log(item.name + "/" + item.position + nbr);
                    
                    position.push(item.position)
                    template += `<div class="${item.position+""+nbr}">${item.name}</div>`
                    console.log(template);
                })
                const _int_list_ = document.getElementById("names");
                _int_list_.inerHTML = template;
                position = [];
                break;
            case "Settings":
                update("google-id");
                update("avatar-id");
                update("your-city");
                break;
            case "Sports Salad":
                console.log("ProcessAndRender nbr of data items: " + data.matches.length + " for " + pageTitle + ")");
                /* _your_image_.setAttribute("src", gravatar("Michael.erdmann@snafu.de")) */
                FillTable("summary-table", data.matches, searchText);
                _search_text_.addEventListener('keypress', function (e) {
                    console.log(searchText)
                    searchText = _search_text_.value;
                    document.getElementById("summary-table").innerHTML = "";
                    FillTable("summary-table", data.matches, searchText)
                });
                break;
            case "list of interest":
                break;
        }
    } /* ProcessAndRender */

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
                ProcessAndRender(myJson);
            })
            .catch(err => console.log(err))
    }

    function openProfile() {
        hide(".homepage")
        show(".setings")
    }
/*
 * remove a card from the local storage (ListOfInt) and the screen
 */
function removecard(id) {
    const _ListOfInt_ = "listOfInt";

    const LS = window.localStorage;
    let liOfInt = JSON.parse(LS.getItem(_ListOfInt_));
    liOfInt.splice(id, 1);
    let jason = JSON.stringify(liOfInt);
    LS.setItem(_ListOfInt_, jason);

    let _card_ = document.getElementById("card" + id)
    //_card_.style.display='none';
    _card_.parentNode.removeChild(_card_)
    console.log("removing card" + id);
} /* removecard */


function writeNewPost() {
    console.log("in write post");
    const userInput = document.getElementById("post").value;
    const LS = window.localStorage;

    // A post entry.
    var postData = {
        author: LS.getItem('your-name'),
        body: userInput,
        date: new Date().toISOString()
    };

    console.log(postData);

    // Get a key for a new Post.
    var newPostKey = firebase
        .database()
        .ref()
        .child("posts")
        .push().key;

    // Write the new post's data simultaneously in the posts list and the user's post list.
    var updates = {};
    updates["/posts/" + newPostKey] = postData;

    firebase
        .database()
        .ref()
        .update(updates);
} /* writeNewPost */



function getPosts() {
    const LS = window.localStorage;
    const postsDiv = document.querySelector("#posts");

    firebase
        .database()
        .ref("posts")
        .on("value", function (data) {
            console.log(data.val());

            const allPosts = data.val();

            let template = "";
            for (key in allPosts) {
                console.log(allPosts[key].author);
                template += `
          <div>
            <p>Author: ${allPosts[key].author}</p>
            <p>Message: ${allPosts[key].body}</p>
            <p>Date: ${allPosts[key].date}</p>
          </div>
        `;
            }
            postsDiv.innerHTML = template;
        });
}
