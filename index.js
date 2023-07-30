import express from "express";
import bodyParser from "body-parser";
import mongoose from 'mongoose';

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"));

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);

  const { Schema } = mongoose;

  const itemsSchema = new Schema({
    name: String
  });

  const Item = mongoose.model('Item', itemsSchema)

  const sampleItem1 = new Item({ 
    name: 'Welcome to your todolist!' 
  });
  const sampleItem2 = new Item({ 
    name: 'Hit the add button to add a new item' 
  });
  const sampleItem3 = new Item({ name: 'Hit the checkbox to delete an item' });

  
  app.get("/", async(req, res)=>{

    const allItems = await Item.find()

    if (allItems.length===0){
        const defaultItems = [sampleItem1,sampleItem2,sampleItem3]
        await Item.insertMany(defaultItems);
        res.redirect("/")
    }else{
      res.render("index.ejs", {data:allItems})
    }
  })

  app.post("/",(req, res)=>{
    let newContent = req.body.newItem;
    const newItem = new Item({name: newContent})
    newItem.save();
    res.redirect("/")
  })

  app.post("/delete", async (req,res)=>{
    const itemID= req.body.deleteBtn;
    await Item.deleteOne({ _id: itemID });
    res.redirect("/")
  })

}
  

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

main()