try {
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

}


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
    var query = {
        active: true,
        currentWindow: true
    };

    chrome.tabs.query(query, callback);
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

function loadFrequentUser() {

}

function loadGroups() {

}

function addStarredUser() {
    var addStarredButton = document.getElementsByClassName("addStarredUser");
    var i;
    for (i = 0; i < addStarredButton.length; i++) {
        addStarredButton[i].addEventListener("click", function () {
            var table = document.getElementByClassName("starredUsers");
            var row = table.insertRow(0);

            // 5 columns: online status, profile, name, video call button, starred button
        })
    };
}

function addGroup() {
    var addGroupButton = document.getElementsByClassName("addGroup");
    var i;
    for (i = 0; i < addGroupButton.length; i++) {
        addGroupButton[i].addEventListener("click", function () {
            var groupList = document.getElementById("groupCollapsible");
            var li = document.createElement("li");
            var groupCollapse = document.createElement("BUTTON");
            groupCollapse.innerHTML = "Fill the group number, APP!"; // need webpage information to get group number
            groupCollapse.setAttribute("class", "groupCollapsible");

            // HERE: need to load the group members if the group already exists, otherwise the empty group

            li.appendChild(groupCollapse);
            li.setAttribute("id", groupList.length.toString());
            groupList.appendChild(li);
            //alert(li.id);
        })
    };
}

function videoCall() {

}



// function calls
dropDown();
loadFrequentUser();
loadGroups();
addStarredUser();
addGroup();
videoCall();