const sidebar = document.getElementById("sidebar");
const hamburgerBtn = document.getElementById("hamburgerBtn");
const closeBtn = document.getElementById("closeBtn");

hamburgerBtn.addEventListener("click", function() {
    sidebar.style.left = "0";
});

closeBtn.addEventListener("click", function() {
    sidebar.style.left = "-250px";
});
