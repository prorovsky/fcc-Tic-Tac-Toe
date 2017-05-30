table = document.querySelector("table");

table.addEventListener("click", e => {
    if(e.target.tagName == "TD"){
        console.log(e);
    }
});