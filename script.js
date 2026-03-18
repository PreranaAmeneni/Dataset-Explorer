let originalData = [];

document.getElementById("fileInput").addEventListener("change", function(e){

let file = e.target.files[0];

Papa.parse(file,{
header:true,
complete:function(result){

let data = result.data;

originalData = data;

displayTable(data);
displaySummary(data);
createCharts(data);
fillFilterOptions(data);

}
});

});

function displayTable(data){

let table = "<table><tr>";

for(let key in data[0]){
table += "<th>"+key+"</th>";
}

table += "</tr>";

for(let i=0;i<Math.min(10,data.length);i++){
table += "<tr>";

for(let key in data[i]){
table += "<td>"+data[i][key]+"</td>";
}

table += "</tr>";
}

table += "</table>";

document.getElementById("tableArea").innerHTML = table;

}

function displaySummary(data){

let rows = data.length;
let cols = Object.keys(data[0]).length;

document.getElementById("summaryArea").innerHTML =
"Rows: "+rows+"<br>Columns: "+cols;

}

function createCharts(data){

let container = document.getElementById("chartsContainer");
container.innerHTML = "";

for(let column in data[0]){

let values = data.map(row => row[column]);

let numericValues = values
.map(v => parseFloat(v))
.filter(v => !isNaN(v));

let canvas = document.createElement("canvas");
canvas.style.marginBottom = "30px";
container.appendChild(canvas);

if(numericValues.length > values.length/2){

new Chart(canvas,{
type:"line",
data:{
labels:numericValues,
datasets:[{
label:column,
data:numericValues
}]
}
});

}else{

let counts = {};

values.forEach(v=>{
counts[v] = (counts[v] || 0) + 1;
});

new Chart(canvas,{
type:"bar",
data:{
labels:Object.keys(counts),
datasets:[{
label:column,
data:Object.values(counts)
}]
}
});

}

}

}

function fillFilterOptions(data){

let columnSelect = document.getElementById("columnSelect");
columnSelect.innerHTML = "";

for(let key in data[0]){
let option = document.createElement("option");
option.value = key;
option.text = key;
columnSelect.appendChild(option);
}

}

document.getElementById("columnSelect").addEventListener("change", function(){

let column = this.value;

let valueSelect = document.getElementById("valueSelect");
valueSelect.innerHTML = "";

let uniqueValues = [...new Set(originalData.map(row => row[column]))];

uniqueValues.forEach(val=>{
let option = document.createElement("option");
option.value = val;
option.text = val;
valueSelect.appendChild(option);
});

});

function applyFilter(){

let column = document.getElementById("columnSelect").value;
let value = document.getElementById("valueSelect").value;

let filtered = originalData.filter(row => row[column] == value);

displayTable(filtered);
displaySummary(filtered);
createCharts(filtered);

}