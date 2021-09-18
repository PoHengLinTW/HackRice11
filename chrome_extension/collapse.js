

var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }

   var query = { active: true, currentWindow: true };

    chrome.tabs.query(query, callback);
  function callback(tabs) {
  var injectionResults;
  currentTab = tabs[0];
  console.log('currentTab'); 
  console.log(currentTab); 
  var tabId = currentTab['id'];
  console.log(tabId); 
  chrome.scripting.executeScript(
    {
      target: {tabId: tabId},	

      files: ['content.js','jquery-3.6.0.min.js']
    },
    injectionResults
    );
 
chrome.scripting.insertCSS(
    {
      target: {tabId: tabId},	
      css: ['floating-window.css']
    },
    injectionResults
    );

 


}


  });
}