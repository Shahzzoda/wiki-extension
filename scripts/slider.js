const rangeSlider = document.getElementById("range-slider__range");
const rangeValue = document.getElementById("range-slider__value");

rangeSlider.addEventListener("input", function() {
  rangeValue.textContent = rangeSlider.value;
});
