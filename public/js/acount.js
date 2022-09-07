

$(document).on("submit", "#profileForm", function (e) {
  e.preventDefault();
  lodear.classList.add("show");
  let Data = {};
  Data = new FormData();

  Data.append("username", $("#id_username").val());
  Data.append("email", $("#id_email").val());
  const img = $("#id_userImage")[0].files[0];
  

  Data.append("userImage", img);
  Data.append("action", "post");

  $.ajax({
    type: "POST",
    url: $(this).attr("action"),
    processData: false,
    contentType: false,
    cache: false,
    mimeType: "multipart/form-data",
    data: Data,

    success: function (json) {
      const res = JSON.parse(json);
      
      const { type, alert, user } = res.responce;

      onSuccess(type, alert, "");
      if (type == "success" && img) {
        const htmlImg = ` <img src="${URL.createObjectURL(img)}" >`;
        document.getElementById("userImage--header").innerHTML = htmlImg;
        document.getElementById("userImage--nav").innerHTML = htmlImg;
      }
    },
    error: function (response) {
      
    },
  });
});
function videPasswordInput (){
  document.querySelectorAll('#passwordForm input').forEach((input) => { input.value="" })
}
$(document).on("submit", "#passwordForm", function (e) {
  e.preventDefault();
  submitForm($(this), videPasswordInput);
});

function clickCover(e) {
  e.parentElement.querySelector("input").click();
}
function changeCover(e) {
  const img = e.files[0];
  
  const url = URL.createObjectURL(img);
  e.parentElement.querySelector(
    ".image-previw"
  ).innerHTML = ` <img class="cover" src="${url}" width='150' alt="Book">`;
}

$(document).on("submit", "#bookForm", function (e) {
  e.preventDefault();
  submitBookForm($(this));
});





function submitBookForm(e) {
  const form = e[0];
  lodear.classList.add("show");
  let Data = {};
  Data = new FormData();

  Data.append("title", document.getElementById("id_title").value);
  Data.append("auther", document.getElementById("id_auther").value);
  Data.append("genre", document.getElementById("id_genre").value);

  Data.append("description", document.getElementById("id_des").value);

  const img = document.getElementById("id_coverImage").files[0];



  Data.append("coverImage", img);
  Data.append("action", "post");

  $.ajax({
    type: "POST",
    url: e.attr("action"),
    processData: false,
    contentType: false,
    cache: false,
    mimeType: "multipart/form-data",
    data: Data,

    success: async function (json) {
      const res = await JSON.parse(json);
    
      const { type, alert } = res.responce;

      onSuccess(type, alert, refrech);
    
      
    },
    error: function (response) {
      
    },
  });
}




const shareBtn =document.getElementById('shareBtn')

const shareBookForm =document.getElementById('shareBookForm')
const closeShareBookForm =document.getElementById('closeShareBookForm')
shareBtn.addEventListener('click', ()=> {
  shareBookForm.classList.add('show')

})
closeShareBookForm.addEventListener('click', (e)=> {
  shareBookForm.classList.remove('show')
})

function showUserModel(){
 document.querySelector('.user-model').classList.toggle('active')
}