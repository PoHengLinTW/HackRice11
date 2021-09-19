/*try {
    chrome.storage.local.get(['video'], function (result) {
        console.log('Value currently is ' + result);
        if (result.video == 'videostart') {
            var query = {
                active: true,
                currentWindow: true
            };
            chrome.tabs.query(query, callback);
            console.log('Value currently is ' + result.video);
        }
    });
} catch (error) {

}*/



var url;

var query = {
    active: true,
    currentWindow: true
};
var currentTab


function dropDown() {
    var coll = document.getElementsByClassName("collapsible");
    var i;

    for (i = 0; i < coll.length; i++) {
        coll[i].addEventListener("click", function () {
            this.classList.toggle("active");
            var content = this.nextElementSibling;
            if (content.style.display === "block") {
                content.style.display = "none";
            } else {
                content.style.display = "block";
            }
        });
    }
}

function callback(tabs) {
    var injectionResults;
    currentTab = tabs[0];
    console.log('currentTab');
    console.log(currentTab);
    var tabId = currentTab['id'];


    console.log(tabId);
    chrome.scripting.executeScript({
            target: {
                tabId: tabId
            },

            files: ['content.js', 'jquery-3.6.0.min.js']
        },
        injectionResults
    );

    chrome.scripting.insertCSS({
            target: {
                tabId: tabId
            },
            css: 'floating-window.css'
        },
        injectionResults
    );


}

function loadStarredUsers() {

}

function loadGroups() {

}

function getUrl(tabs) {
    currentTab = tabs[0];
    url = currentTab.url;
    console.log(url);
}


function addStarredUser() {
    var addStarredButton = document.getElementsByClassName("starredButton");
    var i;
    for (i = 0; i < addStarredButton.length; i++) {
        addStarredButton[i].addEventListener("click", function () {
            var table = document.getElementById("starredUsers");
            var row = table.insertRow(0);

            // 5 columns: online status, profile, name, video call button, starred button
            var statusCell = row.insertCell(0);
            var profileCell = row.insertCell(1);
            var nameCell = row.insertCell(2);
            var callButtonCell = row.insertCell(3);
            var starredButtonCell = row.insertCell(4);

            var onlineStatus = true; // need to fetch from WebRTC to know who is online
            var dot = document.createElement("div");
            dot.classList.add("dot");
            if (onlineStatus) {
                dot.style.backgroundColor = "green";
            } else {
                dot.style.background = "gray";
            }
            var profile = document.createElement("img");
            profile.src = "images/user.png";
            var name = "Di Wu";
            var callButton = document.createElement("BUTTON");
            callButton.textContent = "Video Call";
            callButton.classList.add("callButton");
            callButton.addEventListener("click", function () {
                var myemail;
                embedVideo();
            });
            var starredButton = document.createElement("BUTTON");
            starredButton.textContent = "Star";
            starredButton.classList.add("starredButton");

            statusCell.appendChild(dot);
            profileCell.appendChild(profile);
            nameCell.textContent = name;
            callButtonCell.appendChild(callButton);
            starredButtonCell.appendChild(starredButton);
            //statusCell.appendChild(dot);
            //profileCell.appendChild(profile);
            //nameCell.textContent = name;
            //callButtonCell.appendChild(callButton);
            //starredButtonCell.appendChild(starredButton);
        })
    };
}


function videoCall() {

}

function getEmail() {
    var logged_in_user
    try {
        chrome.storage.local.get(['email'], function (result) {
            console.log('Value currently is ' + result.email);
            logged_in_user = result.email;
        });
    } catch (error) {
        console.log(error);
    }

    return logged_in_user;
}

function embedVideo() {
    //var query = {
    //        active: true,
    //       currentWindow: true};

    chrome.tabs.query(query, callback);
}


let email = getEmail();

chrome.tabs.query(query, getUrl);
$("#adding").click(function () {
    //var addGroupButton = document.getElementsByClassName("addGroup");
    var i;

    console.log("breakpoint 1");
    console.log(url);

    //for (i = 0; i < addGroupButton.length; i++) {
    //addGroupButton.addEventListener("click", function () {

    url = url.replace(/[^a-zA-Z0-9]/g, "");
    console.log(url);
    var groupName = "";
    fetch('http://oneclickmeeting.tech:8081/getUser/email/' + email, {})
        .then(res => res.json())
        .then(res => {
            console.log(res)
            if (res === null) {
                var userName = prompt("Please enter your name: "); // ask for username
                fetch('http://oneclickmeeting.tech:8081/addUser', {
                        method: 'post',
                        headers: {
                            'Accept': 'application/json, text/plain, /',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            "name": userName,
                            "email": "3212"
                        })
                    }).then(res => res.json())
                    .then(res => console.log(res));
            }
            fetch('http://oneclickmeeting.tech:8081/getGroup/id/' + url, {})
                .then(res => res.json())
                .then(res => {
                    console.log(res)
                    if (res === null) {
                        groupName = prompt("Please enter your group name: "); // ask for group name
                        console.log(groupName);
                        setGroupName(groupName);
                        fetch('http://oneclickmeeting.tech:8081/addGroup', {
                                method: 'post',
                                headers: {
                                    'Accept': 'application/json, text/plain, /',
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    "name": groupName,
                                    "groupId": url
                                })
                            }).then(res => res.json())
                            .then(res => console.log(res));
                    }
                });
        });


    // HERE: need to load the group members if the group already exists, otherwise the empty group


    //})
    //};

    //embedVideo();
    //updateStatue();
});


function setGroupName(groupName) {
    console.log(groupName);
    var groupList = document.getElementById("groupList");
    var li = document.createElement("li");
    var groupHeader = document.createElement("BUTTON");
    groupHeader.textContent = groupName; // need webpage information to get group number
    groupHeader.setAttribute("class", "groupCollapsible");
    groupHeader.classList.add("collapsible");

    // li.setAttribute("id", groupList.length.toString());
    groupList.appendChild(li);
    //alert(li.id);
    var table = document.createElement("table");
    var row = table.insertRow(0);

    // 5 columns: online status, profile, name, video call button, starred button
    var statusCell = row.insertCell(0);
    var profileCell = row.insertCell(1);
    var nameCell = row.insertCell(2);
    var callButtonCell = row.insertCell(3);
    var starredButtonCell = row.insertCell(4);

    var onlineStatus = true; // need to fetch from WebRTC to know who is online
    var dot = document.createElement("div");
    dot.classList.add("dot");
    if (onlineStatus) {
        dot.style.backgroundColor = "green";
    } else {
        dot.style.background = "gray";
    }
    var profile = document.createElement("img");
    profile.src = "images/user.png";
    var name = "Di Wu";
    var callButton = document.createElement("BUTTON");
    callButton.textContent = "Video Call";
    callButton.classList.add("callButton");
    callButton.addEventListener("click", function () {
        var myemail;
        embedVideo();
    });
    var starredButton = document.createElement("BUTTON");
    starredButton.textContent = "Star";
    starredButton.classList.add("starredButton");

    statusCell.appendChild(dot);
    profileCell.appendChild(profile);
    nameCell.textContent = name;
    callButtonCell.appendChild(callButton);
    starredButtonCell.appendChild(starredButton);

    li.appendChild(groupHeader);
    li.appendChild(table);
    groupList.appendChild(li);
}
// function calls
dropDown();
loadStarredUsers();
loadGroups();
addStarredUser();
//addGroup();
videoCall();