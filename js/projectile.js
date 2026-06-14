function simulateProjectile(){

let angle =
parseFloat(
document.getElementById("angle").value
);

let velocity =
parseFloat(
document.getElementById("velocity").value
);

let theta =
angle * Math.PI / 180;

let g = 9.8;

let range =
(velocity*velocity*Math.sin(2*theta))/g;

let maxHeight =
(velocity*velocity*Math.sin(theta)**2)/(2*g);

let flightTime =
(2*velocity*Math.sin(theta))/g;

document.getElementById("results").innerHTML=
`
<h2>Results</h2>

<p>Range:
${range.toFixed(2)} m</p>

<p>Maximum Height:
${maxHeight.toFixed(2)} m</p>

<p>Flight Time:
${flightTime.toFixed(2)} s</p>
`;

let x=[];
let y=[];

for(let i=0;i<=100;i++){

let xi=range*i/100;

let yi=
xi*Math.tan(theta)
-
(g*xi*xi)
/
(
2*
velocity*
velocity*
Math.cos(theta)**2
);

x.push(xi);

y.push(yi);
}

new Chart(
document.getElementById("graph"),
{
type:"line",
data:{
labels:x,
datasets:[{
label:"Trajectory",
data:y
}]
}
});
}