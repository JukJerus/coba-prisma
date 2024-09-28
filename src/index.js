const express = require("express");
const dotenv = require("dotenv");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

dotenv.config();
const app = express();

const PORT = process.env.PORT;

app.use(express.json());  // for parsing application/json

app.get("/api", (req, res) => {
  res.send("adaf");
});

app.get('/products', async (req, res) =>{
  const products = await prisma.product.findMany();

  res.send(products);
})

app.get('/products/:id', async (req, res) =>{
  const productId = req.params.id;

  const product = await prisma.product.findUnique({
    where:{
      id: parseInt(productId)
    },
  });
  if (!product){
    res.status(404).send({
      message: 'Product not found'
    });
  }
  res.send(product);
})

app.post('/products', async (req, res)=>{
  const newProductData = req.body;
  const product = await prisma.product.create({
    data:{
      name: newProductData.name,
      price: newProductData.price,
      description: newProductData.description,
      image: newProductData.image
    }
  })

  res.send({
    data: product,
    message: 'New product has been created'
  });
});

app.delete('/products/:id', async (req, res)=>{
  const productId  = req.params.id;

  await prisma.product.delete({
    where:{
      id: parseInt(productId),
    }
  })
  res.send("product has been deleted");
})

//put harus ganti semua field
app.put('/products/:id', async (req, res) => {
  const productId = req.params.id;
  const updatedProductData = req.body;

  if(!updatedProductData.name || !updatedProductData.price || !updatedProductData.description || !updatedProductData.image){
    res.status(400).send({
      message: "Some fields are missing"
    });
    return;
  }

  const product = await prisma.product.update({
    where:{
      id: parseInt(productId)
    },
    data:{
      name: updatedProductData.name,
      price: updatedProductData.price,
      description: updatedProductData.description,
      image: updatedProductData.image
    }
  });
  res.send({
    data: product,
    message: 'Product has been updated'
  });
})

//field boleh ganti satu field saja
app.patch('/products/:id', async (req, res) => {
  const productId = req.params.id;
  const updatedProductData = req.body;

  const product = await prisma.product.update({
    where:{
      id: parseInt(productId)
    },
    data: updatedProductData
  });
  res.send({
    data: product,
    message: 'Product has been updated'
  });
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
