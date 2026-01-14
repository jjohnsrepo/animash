// Declare vaciables
const img1 = document.getElementById('img1');
const img2 = document.getElementById('img2');
const loader1 = document.getElementById("loader1");
const loader2 = document.getElementById("loader2");
const c1 = document.getElementById("c1");
const c2 = document.getElementById("c2");
const cutest = document.getElementById("current_cutest")
const cutest_score = document.getElementById("cutest_score")
const score1 = document.getElementById("score1")
const score2 = document.getElementById("score2")
let cutestdata
let current_streak1 = 0
let current_streak2 = 0
let database
let current_animal1_index
let current_animal2_index

//Start code
init()
setInterval(get_cutest, 5000);
// End code

async function init(){
await get_database()    
await first_load()  
get_cutest()       
}


img1.addEventListener("click", async () => {
  await update_database(current_animal1_index, current_animal2_index);
  current_animal2_index= random_animal()
  img2.src =  await fetch_animal(database[current_animal2_index]["local_path"])
  score2.innerHTML = database[current_animal2_index]["score"]
  score1.innerHTML = database[current_animal1_index]["score"]
  current_streak1 += 1
  if(current_streak1 >= 5){
    first_load()
  }
});

img2.addEventListener("click", async () => {
  await update_database(current_animal2_index, current_animal1_index);
  current_animal1_index = random_animal()
  img1.src =  await fetch_animal(database[current_animal1_index]["local_path"])
  score1.innerHTML = database[current_animal1_index]["score"]
  score2.innerHTML = database[current_animal2_index]["score"] 
  current_streak2 += 1
  if(current_streak2 >= 5){
    first_load()
  }
});

c1.addEventListener("click", function(){
  window.open(img1.src, '_blank')
})

c2.addEventListener("click",()=>{
  window.open(img2.src, '_blank')
})

async function get_cutest() {
  let response = await fetch("/cutest");
  cutestdata = await response.json();
  console.log("cutest is",cutestdata)
  if (cutestdata["Path"]) {
    cutest.src = await fetch_animal(cutestdata["Path"]);
    cutest_score.innerHTML = cutestdata["Score"]
  }
}

async function first_load(){
  current_streak1 = 0
  current_streak2 = 0
  current_animal1_index = random_animal()
  img1.src =  await fetch_animal(database[current_animal1_index]["local_path"])
  score1.innerHTML += database[current_animal1_index]["score"]
  current_animal2_index = random_animal()
  img2.src =  await fetch_animal(database[current_animal2_index]["local_path"])
  score2.innerHTML += database[current_animal2_index]["score"]
}

async function get_database(){
  let response = await fetch("/get-database")
  database = await response.json()
  console.log(database)
}



function random_animal(){
  const random = Math.random()
  const rand_int = Math.floor(random * database.length)
  return rand_int
}

async function fetch_animal(path) {
console.log("the path is", path)
  const response = await fetch("/random-animal", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      path: path
    })
   
  });
  const animalBlob = await response.blob();
  console.log("blob is", animalBlob)
  return URL.createObjectURL(animalBlob);
}


function update_database(winner,loser){
  if(database[winner]["score"] < database[loser]["score"]){
    database[winner]["score"] = (database[loser]["score"] + 50)
  database[loser]["score"] -= 50
  }
  else{
  database[winner]["score"] += 50
  database[loser]["score"] -= 50
  }

fetch("/update-database",
  {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(database)
}
)
}
