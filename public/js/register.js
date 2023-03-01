const lodear = document.getElementById("loade-animation");
function refrech (){
    document.location.reload();
  }

function onSuccess(type, msg, fSuccess) {
    lodear.querySelector(".circle").classList.add("hide");
    lodear.querySelector(".alert").classList.add("show",type);
    lodear.querySelector(".alert p").innerHTML = msg;
    lodear.querySelector(".alert .btn").addEventListener("click", () => {
      
      if (typeof(fSuccess) != "string" ){
        if(type === "success"){
            fSuccess()
        }
        
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
  