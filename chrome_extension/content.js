
console.log("addgroup");


var me = document.getElementsByClassName("fs-exclude ic-avatar");
//var myname = me.getElementsByTagName('img');
console.log(me);

var x = document.getElementsByClassName("roster_user_name student_context_card_trigger");
var arr = Array.prototype.slice.call( x );
var id = 0;
console.log(arr);




//div.innerText="testing";
/*
var count = 0;
arr.forEach(element => 
{var str = "student" + count + "";
chrome.storage.local.set({ str : element.textContent }, function(){
	//console.log("the value of "+str+" is "+ element.textContent);
});
count = count + 1;
}
);

chrome.storage.local.set({ 'studentcount': count }, function(){
});

console.log("store "+count+" students");



chrome.storage.local.set({ 'url': url }, function(){
});
*/
/**
console.log('Video begin ');
chrome.storage.local.set({'video': 'videostart'}, function() {
  console.log('Video begin flag set');
});
*/




//chrome.storage.sync.set({ 'tmp':"2x" }, function(){
 //   console.log(x);
//});

function addVideotopage(){
	 var body = document.getElementsByTagName('body');
 var div = document.createElement('div');
 div.setAttribute("id", "videopan");
 var iframe = document.createElement('iframe');


iframe.src = "https://www.youtube.com/embed/SF4aHwxHtZ0?enablejsapi=1&rel=0&showinfo=0&controls=0";
iframe.id="featured-video";
iframe.frameborder="0";
div.appendChild(iframe);
div.display='block';
div.position='relative';
div.padding='0 0 70% 0';
document.body.appendChild(div);

}