window.addEventListener('load', ()=>{
    document.addEventListener('mousemove', display);
});

function display(event){
    let x = Math.random();
    document.getElementById("demo").innerHTML = x;
}