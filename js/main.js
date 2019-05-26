'use strict'
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM Tree loaded')
    main("Sports Salad");
});
    //const date = moment();
    let searchText = "";
    const _your_image_ = document.getElementById("your-image");
    const _search_text_ = document.getElementById("search-text");
    const _display_name_ = document.getElementById("span-display-name");

    const MS = 1000 /* 1000 ms == 1 seconds */
    const HR = 60 /* 60 min /  hr */
    const SEC = 60 /* 60 sec / min */
    const _ListOfInt_ = "listOfInt";

    let CurrentTeam = null;
    let userName = null;    /* this is set by login */
    let currentFilter = filter_scheduled;
    let database = firebase.database();
    let loggedIn = false;
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
                userName = user.displayName;
                _display_name_.innerHTML = userName;
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
} /* logout */

function writeNewPost(userInput) {
        // A post entry.
        var postData = {
            author: userName,
            body: userInput,
            date: new Date().toISOString()
        };
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

/*
 * show elements with the givem class name.
 */
function show(name) {
    const cls = document.querySelectorAll(name);
    cls.forEach( function( elem ) { elem.style.display = "initial"; })

    return cls;
}

/*
 * hide all elements using the given class name
 */
function hide(name) {
    const cls = document.querySelectorAll(name);
    cls.forEach( function( elem ) { elem.style.display = "none"; })

    return cls;
}

/*
 * This is the main driver performing an initial request of data after the page has been
 * rendered. It will also make all elements visible-lets call the pageTitle the title of 
 * a logical page.
 */
    function main(pageTitle, args) {
        const LS = window.localStorage;
        console.log("main :" + pageTitle);
        switch (pageTitle) {
            case "Sports Salad":    // the main page. provide greeting
            	hide(".settings");  // dont show the settings
                hide(".pitch");     // hide the tactical view
                show(".homepage")   // show the homrpage info
                hide(".chat")       // hide the chat results

                fetchData("https://api.football-data.org/v2/competitions/CL/matches","Sports Salad");
                console.log("fetch returned")
                break;

            case "Team":
                fetchData("http://api.football-data.org/v2/teams/" + args, "Team");
                break;


            default:
                console.log("Fallthrought in main for page" + pageTitle);
        }
} /* main */

/*
 * this function is beeing called when the relevant data has been received from the 
 * end point.
 */
function ProcessAndRender(data, pageTitle) {
    console.log("ProcessAndRender " + pageTitle );
    let position = [];

    switch (pageTitle) {
        case "Team":
            let template = "";
            let position = [];
            data.squad.forEach( function( item ) {
                let nbr = NbrPosition( position, item.position );  // elaborate the position number, e.g. defender4

                position.push(item.position)
                template += `<div class="${item.position+""+nbr}">${item.name}</div>`
            })
            const _names_list_ = document.getElementById("names");
            _names_list_.innerHTML = template;
            position = [];
            break;
        case "Sports Salad":
            console.log("ProcessAndRender nbr of data items: " + data.matches.length + " for " + pageTitle + ")");
            FillTable("summary-table", data.matches, currentFilter );
            break;
    }
} /* ProcessAndRender */

/*
 * fetching data from an endpoint and call ProcessAndRende when all
 * data has been received.
 */
function fetchData(url, page) {
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
            ProcessAndRender(myJson, page);
        })
        .catch(err => console.log(err))
} /* fetchData */

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
    fetchData("http://api.football-data.org/v2/teams/"+team, "Team");
}

/*
 * mark a scheduled game
 */
function filter_scheduled(item) {
        return item.status  == "SCHEDULED";
}

function monthName(mon) {
    return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'November', 'December'][mon - 1];
 }
 


/* 
 * FillTable: this function builds the table of all teams.
 */
    function FillTable(root, data, filter) {
        let tbdy = document.getElementById(root);
        if (tbdy == null) {
            console.log(root + " not found.")
            return;
        }

        console.log("FillTable( nbr of data items: " + data.length);

        const by_status = function (a, b) {
            if (a.status < b.status)
                return -1;
            if (a.status > b.status)
                return 1;
            return 0;
        }

        const by_time = function(a,b) {
            let  date_a = moment.utc(a.utcDate);
            let  date_b = moment.utc(b.utcDate);

            if (date_a.milliseconds < date_b.milliseconds)
                return -1;
            if (date_a.milliseconds > date_b.milliseconds)
                return 1;
            return 0;
        }

        removeTable();
        const _summary_table_ = document.getElementById("summary-table");

        // for all data
        let row = ``
        let currentMonth  = null;
        data.sort(by_time).forEach(function (item, index) {
            //console.log(item);
            let dateLine = null;
            const homeTeamScore = item.score.fullTime.homeTeam;
            const awayTeamScore =  item.score.fullTime.awayTeam;
            const date = moment.utc(item.utcDate)

            if( filter != null  && filter(item)) {
                let dateLine = `${monthName(currentMonth)}`
                console.log(moment(date).get('month'))

                if( currentMonth != moment(date).get('month')) {
                    currentMonth = moment(date).get('month');
                    dateLine = `${moment(date).get ("year")} ${monthName(currentMonth+1)}`
                } else
                    dateLine = "";
                    
                console.log(moment(date).get('month'))

                row = `<tr id="{item.homeTeam.id}">
                        <td onclick="select_team(${item.homeTeam.id})" id=${"game-"+item.homeTeam.id}">
                           <h1>${dateLine}${moment(date).format( " HH:mm " )}</h1>
                              <span>${item.homeTeam.name} vs ${item.awayTeam.name}</span><br>
                              <div class="scores">
                                 <div class="scoreplate" onclick="select_team(${item.homeTeam.id})">${homeTeamScore==null? " - ":homeTeamScore}</div>
                                 <div class="middlePlate">:</div>
                                 <div class="scoreplate" onclick="select_team(${item.awayTeam.id})">${awayTeamScore==null?" - ": awayTeamScore}</div>
                              </div>${moment(date)}</br>
                        Location <a href="https://www.google.com/maps/search/?api=1&query=${getStadion(item.awayTeam.id)}">${getStadion(item.awayTeam.id)}</a>
                        </td>
                        <td class="td-center">${item.homeTeam.name}
                             <img id="${"team-"+item.awayTeam.id}" src="${getLogoURL(item.homeTeam.id)}" class="img-logo" alt="not available"></img>
                             <img id=${"team-"+item.homeTeam.id}" src="${getLogoURL(item.awayTeam.id)}" class="img-logo" alt="not aviailable"></img>
                             <span class="td-center">${item.awayTeam.name}</span>
                           </div>
                        </td>
                    </tr>`;

                _summary_table_.innerHTML += row;
            } /* end if filter ... */
        }) /* end forEach */;
    } // end FillTable

    /*
     * remove  table of all teams from screen
     */
    function removeTable() {
        const _summary_table_ = document.getElementById("summary-table");
        _summary_table_.innerHTML="";
    }

    /*
    * This function handles the numbering of identical rows, like "defender4".
    */
    function NbrPosition(positions, string){
        let result = 0;

        if(string!= null) {
            positions.forEach( function(item) {
                if( item.includes(string) ) {
                    ++result;
                    console.log(string + "/" + result);
                }
            })
        }
        return result;
    }


function writeNewPost() {
    console.log("in write post");
    const userInput = document.getElementById("chat-in").value;
    const LS = window.localStorage;

    // A post entry.
    var postData = {
        author: userName,
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

function waiting(o) {
    var count = 0;

    for (var k in o) if (o.hasOwnProperty(k)) count++;

    return count;
}


function getPosts() {
    const LS = window.localStorage;
    const postsDiv = document.querySelector("#posts");

    firebase
        .database()
        .ref("posts")
        .on("value", function (data) {

            let key = null
            console.log("data.val():" + data.val());

            const allPosts = data.val();
            const _chat_out_ = document.getElementById("chat-out")
            const _messages_ = document.getElementById("messages")

            _messages_.innerHTML = waiting(allPosts);
            console.log(allPosts);

            let template = "";
            let messages = [];
            for (key in allPosts) {
                template += `
            <div class="chat-container">
            <p>Author: ${allPosts[key].author}</p>
            <p>Message: ${allPosts[key].body}</p>
            <p>Date: ${moment(allPosts[key].date).fromNow()}</p>
            </div>
            `;
            messages.push({'author': allPosts[key].author, 'date': allPosts[key].data, 'body': allPosts[key].body});

            }
            messages.forEach( function(x) { console.log( x )})
            _chat_out_.innerHTML += template;
        });
}

/*
 *  Display the match data
 */
function display_scheduled() {

    currentFilter = function(item) {
        return item.status == "SCHEDULED";    
    }
    main("Sports Salad");
}

/*
 * Saerchfilter is using any string
 */
function search_filter(item) {
    let line = "";

    line += item.status + item.awayTeam.name + item.homeTeam.name;

    return line.includes( searchText );
} // search_team

/* 
 * this is the button handler for search
 */
function display_search() {
    currentFilter = function(item) {
        let line = "";

        line += item.status + item.awayTeam.name + item.homeTeam.name;
    
        return line.includes( searchText );
    };

    let _search_text_ = document.getElementById("search-text");
    searchText = _search_text_.value;
    console.log(searchText)
    clearTable();
    main("Sports Salad");
} /* display_all */

/*
 * display all finished games.
 */
function display_finished() {
    console.log("display_finished")
    currentFilter = function(item) { return item.status == 'FINISHED'}

    show(".all-results");
    main("Sports Salad");
}

/*
 * Display the player on the pitch 
 */
function display_players() {
    console.log("display_players")
    show(".pitch");
    main("Team", CurrentTeam )
}

function select_team(id) {
    console.log("select_team("+id+")");
    CurrentTeam = id;
    hide(".overview");
    show(".pitch");
    main("Team", CurrentTeam);
}
/* 
 * open the  chat 
 */
function open_chat() {
    removeTable();
    hide(".pitch")
    show(".chat");
    const _chat_in_ = document.getElementById("chat-in");
    const _btm_chat_ = document.getElementById("btm-chat");
    if( _btm_chat_.innerHTML=="Send" ) {
        writeNewPost(_chat_in_.value);
    }
}

/* 
 * if some chat contents been given we toggle the meaning of 
 * the CHAT button to Send
 */
function chat_input_received( ) {
    const _chat_in_ = document.getElementById("chat-in");

    console.log(_chat_in_.value.length)
    if( _chat_in_.value.length > 0) {
        const _btm_chat_ = document.getElementById("btm-chat");
        _btm_chat_.innerHTML = "Send";
    }

}