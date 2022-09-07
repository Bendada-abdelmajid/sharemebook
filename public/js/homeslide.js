const newBook_slide = document.getElementById("newBook-list");
const newBooks = document.querySelectorAll("#newBook-list .book-box");
const observer = new ResizeObserver((entries) => {

  const boxElement = entries[0];
  const boxWidth = boxElement.contentRect.width;
  const slide_chileds = Math.round(boxWidth / 250);
  const bookWidth = boxWidth / slide_chileds;
  newBooks.forEach((book) => {
    
    book.style = `min-width: ${bookWidth}px;max-width: ${bookWidth}px;`;
  });
});
observer.observe(newBook_slide);
var splide = new Splide(newBook_slide, {
  cover: true,
  lazyLoad: "nearby",
  
  pagination: false,
});

splide.mount();