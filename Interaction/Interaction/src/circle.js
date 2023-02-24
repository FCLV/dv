const canvas = document.querySelector('#canvas');
   
// Context for the canvas for 2 dimensional operations
const ctx = canvas.getContext('2d');

function draw(){
	const color = Math.round(Math.random() * 0xFFFFFF);
	const fill = '#' + color.toString(16).padStart(6,'0');
	ctx.beginPath();
	ctx.fillStyle = fill;
	ctx.fillRect(20,20,100,100);
	ctx.stroke();
}
