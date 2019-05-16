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

    var currentFilter = filter_scheduled();
    var database = firebase.database();
    var loggedIn = false;
    const _btn_login_ = document.getElementById("btn_login")
  
    _btn_login_.innerHTML = loggedIn ? "logout" : "login";

    function toggleLogin() { 
        if(loggedIn)
            logout();
        else
            login();

        _btn_login_.innerHTML = loggedIn ? "logout" : "login";
    }


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
                loggedIn = true;
                getPosts();
            })
            .catch(function (error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage);
            });

        const _btn_post_ = document.getElementById("_btn_post_");
       // _btn_post_.addEventListener( 'click', function() {
       //     console.log("Post .....");
       //     writeNewPost();
       // });

    } /*login*/


    function logout() {
        firebase.auth().signOut().then(function() {
            // Sign-out successful.
            loggedIn = false;
        }).catch(function(error) {
 // An error happened.
            console.log(error);
            loggedIn = true;
        })
    }


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

     function filter_scheduled(item) {
        console.log(item)
        return item.status  == "SCHEDULED"; 
     }


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
        let row = ``
        data.sort(by_status).forEach(function (item, index) {
            if( filter(item)) {
                row = 
                    `<tr>
            	        <td><img src="${getLogoURL(item.homeTeam.id)}" class="img-logo"></img></td>
            	        <td>${item.homeTeam.name} <span> vs </span></td>
            	        <td>${item.awayTeam.name} </td>
                        <td><img src="${getLogoURL(item.awayTeam.id)}" class="img-logo"></img></td>
                        <td><a href="https://www.google.com/maps/search/?api=1&query=${getStadion(item.awayTeam.id)}">${getStadion(item.awayTeam.id)}</a>
                    </tr>`;
            }
        })
            
        _summary_table_.innerHTML += row;
        ;
    } // end FillTable 

    
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
                _int_list_.innerHTML = template;
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
                FillTable("summary-table", data.matches, filter_scheduled);
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
