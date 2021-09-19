
var colormap = {
    true: "green",
    false: "red"
};



class App extends React.Component {
refresh = () => {
             var username = event.target.id;
              var ret = isonline(username); 
            this.setState({
               color: colormap[ret]
            });
           }
      render() {
        return (
              getAlluser().map(name,i) =>
            <tr id = {i}> <td id = {name} class = "circle"> </td> <td> {name}</td>
           </tr>
           )



      }

}




function isonline(username) {
   // get user status from database
   // return true/false
}

function getAlluser(){
  //get all users
  
}