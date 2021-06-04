const express = require("express");
const app = express();
const axios = require("axios");
// small middlewares
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
// created local store and for me example below
const myNewObject = new Object();
let myExampleObject = {
  ASIN: {
    sellerName: "iPuzzle Online",
    fullPrice: "$569.00",
    title: "Microsoft",
    url: "dsfgfd",
    description: "sfdg dfgsthr",
    keyword: "xbox s",
  },
};
const myNewArray = new Array();
// getting data from api
axios
  .get(
    "https://api.apify.com/v2/datasets/z0PzhOM8YnDpNxPLw/items?token=ioRdCccgWATA4qfSt4nASYxkH"
  )
  .then((res) => {
    const newData = res.data;
    if(Object.keys(newData).length){
    newData.forEach((element) => {

      
      const mysortedAsin = element.ASIN.split("").sort();
      const myAsin = element.ASIN;
      delete element.ASIN;
      if (new Set(mysortedAsin).size !== mysortedAsin.length) {
        myNewObject[myAsin] = element;
      } else {
        myNewArray.push(element);
        myNewObject[myAsin] = myNewArray;
      }
      //   console.log(myNewObject);
    });
  }
})
  .catch((e) => {
    console.log(e);
  });
// creating new posts posting
app.post("/create", (req, res) => {
  res.json(myNewObject).status(200);
});
// getting a post with id and with the number of post
app.get("/:id/:num", (req, res) => {
  const { id } = req.params;
  const { num } = req.params;
  res.json(myNewObject[id][num]).status(201);
  console.log(Object.values(myNewObject[id][num]));
});
// updateing post selected by id and num
app.put("/update/:id/:num", (req, res) => {
  const { id } = req.params;
  const { num } = req.params;
  const { sellerName, fullPrice, title, url, description, keyword } = req.body;
  myNewObject[id][num].sellerName = sellerName
  myNewObject[id][num].fullPrice =fullPrice
  myNewObject[id][num].title = title
  myNewObject[id][num].url = url
  myNewObject[id][num].description = description
  myNewObject[id][num].keyword = keyword
  
  res.json("updated" +" " +  JSON.stringify(myNewObject[id][num]));
  
});
// deleteing post by id and num
app.delete("/delete/:id", (req, res) => {
  const { id } = req.params;
  delete myNewObject[id];
  res.json("it is done, deleted : " + id);
});

app.listen(3001, console.log("server running"));
