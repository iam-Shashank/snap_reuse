//show list of instructables by clicking icon


function fetchData(id){
  console.log(id[5]);
  var item='';
  if(id[5]==0){

    item="cardboard";
    console.log("item:",item);
    displayData(item);

  } else if(id[5]==1){

    item="glass bottle";
    console.log("item:",item);
    displayData(item);

  } else if(id[5]==2){

    item="glass bottle";
    console.log("item:",item);
    displayData(item);

  } else if(id[5]==3){

    item="paper";
    console.log("item:",item);
    displayData(item);

  } else if(id[5]==4){

    item="plastic bottle";
    console.log("item:",item);
    displayData(item);

  } else if(id[5]==5){

    item="plastic container";
    console.log("item:",item);
    displayData(item);

  }


}


function displayData(item){

document.getElementById("parent-link").remove();
var divParent=document.createElement("div");
divParent.id="parent-link";

 let url = 'https://raw.githubusercontent.com/iam-Shashank/snap_reuse/main/assets/json/links.json';
  console.log(url);
  fetch(url)
  .then(res => res.json())
  .then((out) => {
    console.log(item);
    console.log(out[item].length);
    console.log(out[item][0].title);


    for (var i = 0; i < out[item].length; i++) { 
    
    var div = document.createElement('div');   
    var h3 = document.createElement('h3');  
    var a= document.createElement('a');

    h3.innerHTML= out[item][i].title;
    a.title = out[item][i].title;   
    a.href = out[item][i].url; 
    // console.log(a);
    a.appendChild(h3);

    div.className="all-links";
    div.appendChild(a);
    // console.log(div);


    divParent.appendChild(div);
    console.log(divParent); 

    }

    document.getElementById("explore-all").appendChild(divParent);


  })
  .catch(err => { throw err });

}