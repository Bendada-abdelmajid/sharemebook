

const filtersSlide = document.getElementById("filtersSlide");
var filtersplide = new Splide(filtersSlide, {
  perPage: 3,
  cover: true,
  gap:15,
  arrows: false,
  lazyLoad: "nearby",
  pagination: false,
});

filtersplide.mount();
