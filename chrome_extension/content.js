
console.log("addgroup");


var me = document.getElementsByClassName("fs-exclude ic-avatar");
//var myname = me.getElementsByTagName('img');
console.log(me);

var x = document.getElementsByClassName("roster_user_name student_context_card_trigger");
var arr = Array.prototype.slice.call( x );
var id = 0;
//console.log(arr);


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
//div.innerText="testing";

//arr.forEach(element => 
//chrome.storage.sync.set({ 'student'.concat(id): element }, function(){
//})
//);
console.log('Video begin ');
chrome.storage.local.set({'video': 'videostart'}, function() {
  console.log('Video begin flag set');
});
//chrome.storage.sync.set({ 'tmp':"2x" }, function(){
 //   console.log(x);
//});