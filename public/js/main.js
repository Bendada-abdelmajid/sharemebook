const lodear = document.getElementById("loade-animation");

function  showSittings(){
    document.querySelector(".body-cont").classList.add("show-rightSide")
  

    document.querySelector(".mini-menu").classList.add("move")
  
}
function  hideSittings(){
  document.querySelector(".body-cont").classList.remove("show-rightSide")
 
    document.querySelector(".mini-menu").classList.remove("move")
  
}
function refrech (){
  document.location.reload();
}
function onSuccess(type, msg, fSuccess) {
  lodear.querySelector(".circle").classList.add("hide");
  lodear.querySelector(".alert").classList.add("show",type);
  lodear.querySelector(".alert p").innerHTML = msg;
  lodear.querySelector(".alert .btn").addEventListener("click", () => {
    
    if (typeof(fSuccess) != "string" ){
      fSuccess()
    }
   
  lodear.classList.remove("show");

  lodear.querySelector(".circle").classList.remove("hide");
  lodear.querySelector(".alert").classList.remove("show", type);
  lodear.querySelector(".alert p").innerHTML = "";
  });
}

function submitForm(e, fSuccess) {
  lodear.classList.add("show");
  $.ajax({
    type: "POST",
    url: e.attr("action"),

    data: e.serialize(),
    success: function (json) {
      const {
        type,
        alert
      } = json.responce;
      onSuccess(type, alert, fSuccess);
    },
    error: function (err) {
      onSuccess("error", "somting rong pleas try again", fSuccess);
    },
  });
}

function flipcard(n) {
  
  const iinerCard = document.querySelector(".flip-card-inner ");
  const frontCard = document.querySelector(".flip-card-front ");
  const backcard = document.querySelector(".flip-card-back ");

  frontCard.classList.toggle("hidden", n == 1);
  backcard.classList.toggle("hidden", n == 0);

  iinerCard.style = `transform: rotateY(${180 * n}deg );`;
}

function seepassWord(e) {
  const input= e.parentElement.querySelector('input')
  
  if(e.classList.contains('fa-eye-slash')){
    
    input.type="password"
    e.classList.replace('fa-eye-slash', "fa-eye")
  } else {
    input.type="text"
    e.classList.replace("fa-eye", 'fa-eye-slash')
  }
}




function clickBook() {

  const booksBox = [...document.querySelectorAll(".book-box")];
  booksBox.forEach((el) => {
    el.addEventListener("click", (e) => {
      
      if (e.target.classList.contains('content') || e.target.classList.contains('book-cover') || e.target.classList.contains('fa-expand')) {
        createBookPopup(el.dataset.bookId);
        document.querySelector(".book-detail-cont").classList.add("show");
      }
     
    });
  });
}
clickBook()
async function getBook(id) {
  try {
    let res = await fetch("/book/" + id);
    let data = await res.json();

    return data;
  } catch (error) {
    
  }
}
async function createBookPopup(id) {
  if (document.getElementById("review-form")) {
    document.getElementById("review-form").setAttribute("data-form-id", id);
  }
  const data = await getBook(id);
  const book = await data.book;

  const reviews = await data.reviews;
  const userImg= book.user.userImage ? `<img src=${book.user.userImage}/>`: `  <svg stroke="currentColor" fill="none" stroke-width="1.5" viewBox="0 0 24 24" aria-hidden="true" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"></path></svg>`
  document.querySelector(".book-detail").innerHTML = `
   
    <div class="fl">
    <div class='left'>
      <div class="book-cover">
      <img src="${book.coverImage}" alt="">
    </div>
    <div style="padding-left:15px;">
    <h3 id="genre-1" class="genre"> <span> Genre :</span>${book.genre.title}</h3>
    <h4 class="review-cont">${reviews.length} reviews</h4>
    </div>

    </div>
    <div class="book-info">
        
        <div>
        <h1 id="title"> ${book.title}</h1>
        <h3 id="auther" class="f-start"> 
        <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><desc></desc><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M3 19c3.333 -2 5 -4 5 -6c0 -3 -1 -3 -2 -3s-2.032 1.085 -2 3c.034 2.048 1.658 2.877 2.5 4c1.5 2 2.5 2.5 3.5 1c.667 -1 1.167 -1.833 1.5 -2.5c1 2.333 2.333 3.5 4 3.5h2.5"></path><path d="M20 17v-12c0 -1.121 -.879 -2 -2 -2s-2 .879 -2 2v12l2 2l2 -2z"></path><path d="M16 7h4"></path></svg>
       BY  ${book.auther}
        </h3>
        </div>
        <h3 id="genre-2" class="genre"> <span> Genre :</span>${book.genre.title}</h3>
  
    </div>
    <div id="share">
            <div class="center">
                <div class="s-img center">
                ${userImg}
              </div>
              <div>
                <h5>${book.user.username}</h5>
                <p class="s-p"> ${book.createdAt}</p>
              </div>
            </div>
            <div id="description">
        
       
        ${book.description}
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Adipisci, nobis! Laboriosam consectetur, sit tenetur magnam aperiam itaque blanditiis nostrum similique ducimus ipsa, dolore sequi perferendis fugiat id rerum repellendus tempore.
        </div>
            
      </div>
      <div class="review-cont">
      <h1> <span>${reviews.length} </span>review </h1>
      <div id="reviews">
      </div>
    </div>
    </div>
    
    `;
  reviews.forEach((el) => {
    document.getElementById("reviews").innerHTML += `
    <div class="review f-start">
      
        <div class="s-img center">
        ${userImg}
        </div>
        <div>
          <h4>${el.user.username}</h4>
          <p> ${el.review}</p>
          <p class="s-p"> ${el.createdAt}</p>
        </div>
      
     
    </div>
    `;
  });
}

function closeBookPopup() {
  document
    .querySelector(".book-detail-cont")
    .classList.remove("show", "s-show");
}




function activeLink(){
  const ids=["users", "my-books", "saved"]
  const link = document.location.pathname
   for (let i of ids){
    if(link.includes(i)){
      document.getElementById(i).classList.add('active')
    }
  }
  if(link==="/") {
    document.getElementById("home").classList.add('active')
  }
}

window.addEventListener("load", () => { 
  activeLink()
})


const linksBtn= document.getElementById('links-btn')
linksBtn.addEventListener("click", () => { 
  document.querySelector("header").classList.toggle('show-nav')
 })




