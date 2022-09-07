const deleteBox=  document.getElementById("delete-box-cont");
function showDeleteBox(e) {
  deleteBox.setAttribute('data-id', e)
  deleteBox.querySelector('form').action=`/book/${e}?_method=DELETE`
  deleteBox.classList.add("show");

}
function hideDeleteBox() {
  deleteBox.classList.remove("show");
}

function deleteBook(e) {
  const BookId= deleteBox.dataset.id
  hideDeleteBox()
 document.querySelector(`[data-book-id="${BookId}"]`).remove()
}



async function showEdit(e) {
  //getBook
  const id = e.dataset.id;
  const data = await getBook(id);
  const book = await data.book;
  const genre = await data.genre;
  shareBookForm.querySelector('form').action=`/book/edit/${id}?_method=PUT`
  shareBookForm.querySelector('#id_title').value=book.title
  shareBookForm.querySelector('#id_auther').value=book.auther
  shareBookForm.querySelector('#id_des').innerHTML=book.description
  shareBookForm.querySelector('#coverImage').innerHTML=`<img class="cover" src="${book.coverImage}" width="150" alt="Book" />`
  shareBookForm.querySelector('form button').innerHTML="Edit book"
  shareBookForm.classList.add('show')
  closeShareBookForm.addEventListener('click', (e)=> {
    shareBookForm.classList.remove('show')
    shareBookForm.querySelector('form').action=`/book/new`
    shareBookForm.querySelector('#id_title').value=""
    shareBookForm.querySelector('#id_auther').value=""
    shareBookForm.querySelector('#id_des').innerHTML=""
    shareBookForm.querySelector('#coverImage').innerHTML=`<div id="coverImage" onclick="clickCover(this)" class="image-previw">
    <i class="fa fa-cloud-upload-alt"></i>
    <p>upload book cover</p>
  </div>`
    shareBookForm.querySelector('form button').innerHTML="share book"
  })
}
  
$(document).on("submit", "#deleteBook", function (e) {
  e.preventDefault();
  submitForm($(this), deleteBook);
});