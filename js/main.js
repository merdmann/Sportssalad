'use strict'

document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM Tree loaded')
    var config = new Map();

    var searchableContents = new Map;

    function main() {
        //fetchData("http://api.football-data.org/v2/competitions/PL/matches/?matchday=22");
        const _your_image_ = document.getElementById("your-image");

        _your_image_.setAttribute("src", gravatar("michael.erdmann@snafu.de",200));
    }

    main();


 function gravatar(email, option) {
	// using md5() from here: http://www.myersdaily.org/joseph/javascript/md5-text.html

    return "https://www.gravatar.com/avatar/"+ md5(email.toLowerCase().trim()) + "?s=" + option;
}

}) // DOMContentLoaded handler
