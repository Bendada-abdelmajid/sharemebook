const lodear = document.getElementById("loade-animation");
const bodyCont = document.querySelector(".body-container");
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

function showRegisterSide(e, a="login") {
 
    if(a=== "users") {
      if(bodyCont.classList.contains("show-login")){
        bodyCont.classList.remove("show-rightSide", "show-login");
        bodyCont.classList.add("show-rightSide", "show-users")
       
      }
      else if(bodyCont.classList.contains("show-users")) {
       
        bodyCont.classList.remove("show-rightSide", "show-users")
      } else {
        bodyCont.classList.add("show-rightSide", "show-users");
      }
      
    } else {
      if(bodyCont.classList.contains("show-users")){
        bodyCont.classList.remove("show-rightSide", "show-users")
        bodyCont.classList.add("show-rightSide", "show-login");
      }
      else if(bodyCont.classList.contains("show-login")) {
       
        bodyCont.classList.remove("show-rightSide", "show-logi")
      } else {
        bodyCont.classList.add("show-rightSide", "show-login");
      }
    }
  
  
   
  
  
  

}

function hideRegisterSide(e) {
  bodyCont.classList.remove("show-rightSide", "show-users", "show-login");

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
      if (e.target.classList.contains('info')) {
        const userId = e.target.dataset.userId
        
        showRandomAcount(userId);
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
  
  document.querySelector(".book-detail").innerHTML = `
   
    <div class="fl">
    <div class='left'>
      <div class="book-cover">
      <img src="${book.coverImage}" alt="">
    </div>
    <h3 id="genre-1" class="genre"> <span> Genre :</span>${book.genre.title}</h3>

    </div>
    <div class="book-info">
        
        <div>
        <h1 id="title"> ${book.title}</h1>
        <h3 id="auther"> 
        <span class="h l"></span>
        <span class="h r"></span>
       BY  ${book.auther}
        </h3>
        </div>
        <h3 id="genre-2" class="genre"> <span> Genre :</span>${book.genre.title}</h3>
  
    </div>
    <div id="share">
            <div class="center">
                <div class="s-img center">
                <i class="fa fa-user"></i>
              </div>
              <div>
                <h5>${book.user.username}</h5>
                <p class="s-p"> ${book.createdAt}</p>
              </div>
            </div>
            <div id="description">
        <div class="cube tl"></div>
        <div class="cube br"></div>
       
        ${book.description}
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Adipisci, nobis! Laboriosam consectetur, sit tenetur magnam aperiam itaque blanditiis nostrum similique ducimus ipsa, dolore sequi perferendis fugiat id rerum repellendus tempore.
        </div>
            
        </div>
        
    </div>
    <div class="review">
      <h1> <span> review </span></h1>
      <div id="reviews">
      </div>
    </div>
    `;
  reviews.forEach((el) => {
    document.getElementById("reviews").innerHTML += `
    <div id="share">
      <div class="center">
        <div class="s-img center">
        <i class="fa fa-user"></i>
        </div>
        <div>
          <h5>${el.user.username}</h5>
          <p class="s-p"> ${el.createdAt}</p>
        </div>
      </div>
      <div id="description">
        ${el.review}
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











// show random acount 
const randomAcountCont = document.querySelector('.random-acount-cont')
async function showRandomAcount(id) {
  try {
    let res = await fetch("/user/" + id);
    let data = await res.json();
    let isAuth = await data.isautincat
    if (isAuth) {
      showAcount()
    } else {
      
      const randomAcount = document.querySelector('.random-acount')
      const username = await data.username
      const userImage = await data.userImage
      const userBooks = await data.userbooks
      randomAcount.querySelector('.user').innerHTML = `
      <div class="user-img center">${userImage}</div>
      <div>
        <h2 >${username}</h2>
        <div class="book-count">
            <i class="fa fa-book"></i>${userBooks.length} 
      </div>
      </div>`
      randomAcount.querySelector('.grid').innerHTML = ''
      for (let book of userBooks) {
        randomAcount.querySelector('.grid').innerHTML += `
        
        <div class="book-box" data-book-id="${book._id}">
        <div class="book-cover">
         <i class="fa fa-expand book-i"></i>
         <img src="${book.coverImage}" />
       </div>
       <div class="content">
         <h3>${book.title}</h3>
         <p>${book.auther}</p>
       </div>
        `
      }
      clickBook()

      randomAcountCont.classList.add("show")
      
    }

  } catch (error) {
    
  }


}
document.getElementById('closeAcount').addEventListener('click', () => {
  randomAcountCont.classList.remove("show")
})

function activeLink() {
  const id = document.location.pathname
  document.getElementById(id).classList.add('active')
}
window.addEventListener('load', () => { 
  activeLink()
  
 })