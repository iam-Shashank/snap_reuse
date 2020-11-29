$(document).ready(function() {
  tf = window.tf;

  async function loadMobilenet() {
    const modelWeigths = await tf.loadModel('https://raw.githubusercontent.com/iam-Shashank/snap_reuse/main/assets/model/model.json');
    // const modelWeigths = await tf.loadModel('model/model.json');

    // console.log(modelWeigths);

    // Return a model that outputs an internal activation.
    const layer = modelWeigths.getLayer('dense');
    model = await tf.model({inputs: modelWeigths.inputs, outputs: layer.output});
  };

  canvas = document.createElement('canvas');
  canvas.width  = 224;
  canvas.height = 224;
  ctx = canvas.getContext("2d");
  loadMN = loadMobilenet();

  swiperSide = new Swiper('.product-photos-side .swiper-container', {
    direction: 'horizontal',
    centeredSlides: true,
    spaceBetween: 30,
    slidesPerView: 'auto',
    touchRatio: 0.2,
    slideToClickedSlide: true,
  })
  swiperProduct = new Swiper('.product-photo-main .swiper-container', {
    direction: 'horizontal',
    pagination: '.swiper-pagination',
    paginationClickable: true,
  })

  swiperSide.params.control = swiperProduct;
  swiperProduct.params.control = swiperSide;

  swiperSide.on('transitionEnd', function () {
    if (swiperSide.activeIndex == 12){
      if($("#imageFromUser")[0].src != ""){
        inferImage($("#imageFromUser")[0]);
      }
      else {
        $("#results_title").text("");
        $("#first_place").text("");

      }
    } else {
      inferImage($('.swiper-slide-active img')[0]);
    }
  });

  loadMN.then(function(){
    inferImage($('.swiper-slide-active img')[0]);
  });
});

function uploadImage(){
  document.getElementById("userImageInput").click();
}

async function startUserImage() {
  // $("#textInfoSendImage").remove();
  var imgDataURL = window.URL.createObjectURL(document.getElementById('userImageInput').files[0]);
  $("#imageFromUser")[0].src = imgDataURL;
  if(swiperProduct.activeIndex != 12){
    swiperProduct.slideTo(12);
  }
  await new Promise(resolve => setTimeout(resolve, 500));
  inferImage($("#imageFromUser")[0]);
};

async function inferImage(image){
  // Set text as "Processing" and erase old results
  $("#results_title").text("Processingassets.");
  $("#first_place").text("");
  $("#second_place").text("");

  // Deep Learning Inference
  console.log(image.naturalWidth,image.naturalHeight);
  ctx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight, 0, 0, 224, 224);
  imageData = ctx.getImageData(0, 0, 224, 224);
  imagePixels = tf.fromPixels(imageData).expandDims(0).toFloat().div(tf.scalar(255));
  // console.log(imagePixels);
  predictedArray = await model.predict(imagePixels).as1D().data();

  response = {}

  for (i = 0; i <= 5; i++) {
    if(Number.isFinite(response[labels[i][1]])){
      response[labels[i][1]] += predictedArray[i];
    }
    else {
      response[labels[i][1]] = predictedArray[i];
    }
  };

  response = Object.keys(response).map(item => [item, response[item]]);

  response.sort(function(a, b) {
      return a[1] < b[1] ? 1 : -1;
  });

  // Print top 2 on html elements
  $("#results_title").text("Results");
  $("#first_place").text(buildLabel(response,  0) );

  let url = 'https://raw.githubusercontent.com/iam-Shashank/snap_reuse/main/assets/json/links.json';
  console.log(url);
  fetch(url)
  .then(res => res.json())
  .then((out) => {
    console.log(response);
    console.log(response[0][0]);
    console.log(out[response[0][0]][0].title);


    var a = document.createElement('a');    
    // Create the text node for anchor element. 
    var link = document.createTextNode(out[response[0][0].toLowerCase()][0].title); 
    // Append the text node to anchor element. 
    a.appendChild(link); 
    // Set the title. 
    a.title = out[response[0][0].toLowerCase()][0].title;  
    // Set the href property. 
    a.href = out[response[0][0].toLowerCase()][0].url;  
    // Append the anchor element to the body.
    var list=document.getElementById("link1");
    if (list.children.length){
      list.removeChild(list.childNodes[0]);
    }
    list.appendChild(a); 


    var a = document.createElement('a');    
    // Create the text node for anchor element. 
    var link = document.createTextNode(out[response[0][0].toLowerCase()][1].title); 
    // Append the text node to anchor element. 
    a.appendChild(link); 
    // Set the title. 
    a.title = out[response[0][0].toLowerCase()][1].title;  
    // Set the href property. 
    a.href = out[response[0][0].toLowerCase()][1].url;  
    // Append the anchor element to the body.
    var list=document.getElementById("link2");
    if (list.children.length){
      list.removeChild(list.childNodes[0]);
    }
    list.appendChild(a);  


    var a = document.createElement('a');    
    // Create the text node for anchor element. 
    var link = document.createTextNode(out[response[0][0].toLowerCase()][2].title); 
    // Append the text node to anchor element. 
    a.appendChild(link); 
    // Set the title. 
    a.title = out[response[0][0].toLowerCase()][2].title;  
    // Set the href property. 
    a.href = out[response[0][0].toLowerCase()][2].url;  
    // Append the anchor element to the body.
    var list=document.getElementById("link3");
    if (list.children.length){
      list.removeChild(list.childNodes[0]);
    }
    list.appendChild(a);

    if(response[0][0]=="cardboard"){
      console.log($("#item-icon-1")[0]);
      $("#item-icon-1")[0].src="assets/img/icons/0-box.png";
      $("#item-icon-2")[0].src="assets/img/icons/0-box.png";
      $("#item-icon-3")[0].src="assets/img/icons/0-box.png";
      

    } else if(response[0][0]=="glass bottle"){
      $("#item-icon-1")[0].src="assets/img/icons/1-soda-bottle.png";
      $("#item-icon-2")[0].src="assets/img/icons/1-soda-bottle.png";
      $("#item-icon-3")[0].src="assets/img/icons/1-soda-bottle.png";

    } else if(response[0][0]=="glass jar"){
      $("#item-icon-1")[0].src="assets/img/icons/2-honey.png";
      $("#item-icon-2")[0].src="assets/img/icons/2-honey.png";
      $("#item-icon-3")[0].src="assets/img/icons/2-honey.png";

    } else if(response[0][0]=="paper"){
      $("#item-icon-1")[0].src="assets/img/icons/3-document.png";
      $("#item-icon-2")[0].src="assets/img/icons/3-document.png";
      $("#item-icon-3")[0].src="assets/img/icons/3-document.png";

    } else if(response[0][0]=="plastic bottle"){
      $("#item-icon-1")[0].src="assets/img/icons/4-plastic-bottle.png";
      $("#item-icon-2")[0].src="assets/img/icons/4-plastic-bottle.png";
      $("#item-icon-3")[0].src="assets/img/icons/4-plastic-bottle.png";

    } else if(response[0][0]=="plastic container"){
      $("#item-icon-1")[0].src="assets/img/icons/5-container.png";
      $("#item-icon-2")[0].src="assets/img/icons/5-container.png";
      $("#item-icon-3")[0].src="assets/img/icons/5-container.png";

    } else {

    }



  })
  .catch(err => { throw err });

}

//add error handling for other than those 5 tags.

function buildLabel(response, index){
  return response[index][0]+" detected with "+(response[index][1]*100).toFixed(2)+"% accuracy";
}


var w,h;
canvas = document.querySelector("canvas");
context = canvas.getContext("2d");
video = document.querySelector('#myVidPlayer');
canvas.style.display = "none";

function startWebcam(){
window.navigator.mediaDevices.getUserMedia({video:{width:300,height:150}})
.then(stream=>{
  video.srcObject=stream;
  $('#camera')[0].style.display='block';
  $('#camerabutton')[0].style.display='none';
  $('#uploadbutton')[0].style.display='none';
  video.onloadedmetadata = (e) => {
    video.play();

    w = video.videoWidth;
    h = video.videoHeight;

    canvas.width = w;
    canvas.height = h;
    
  }
})
.catch( () => {
  alert('You have to give camera permission to your browser');
});

}

async function snapshot(){
  $('#camera')[0].style.display='none';
  $('#camerabutton')[0].style.display='inline';
  $('#uploadbutton')[0].style.display='inline';
  context.fillRect(0, 0, w, h);
  context.drawImage(video, 0, 0, w, h);
  // inferImage(video);
  canvas.style.display = "block";
  // console.log("context canvas",context.canvas.toDataURL("image/png"));

  if (swiperProduct.activeIndex!=12){
    swiperProduct.slideTo(12);
  }
  $("#imageFromUser")[0].src = context.canvas.toDataURL("image/png");
    await new Promise(resolve => setTimeout(resolve, 500));
    inferImage($("#imageFromUser")[0]);

  // if(swiperProduct.activeIndex == 12){
  //   await new Promise(resolve => setTimeout(resolve, 500));
  //   inferImage($("#imageFromUser")[0]);
  // } else{
  //   swiperProduct.slideTo(12);
  // };

  tracks=video.srcObject.getTracks();
  tracks.forEach(function(track) {
    track.stop();
  });
  video.srcObject=null;

}