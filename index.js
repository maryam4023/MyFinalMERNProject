const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path'); // Import path module for serving static files
var user=require('./models/user')

const connectDB = require('./db/connection');
const productRoutes = require('./routes/productRoutes');
const errorHandler = require('./middleware/errorHandler');
const config = require('./config/config');





// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'Telwaind-project/Public/images/'); // Ensure this directory exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

const app = express();
app.use(cors());

// Connect to MongoDB
connectDB();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // In case you're handling URL-encoded data


app.post("/register",(req,res)=>
{
    user.create(req.body).then(()=>
    {
        res.send("user register")
    })
})
app.post("/login", (req, res) => 
{
    var email = req.body.email;

    if (email) 
            {
        user.findOne({ email: email }).then((resp) => {
            if (resp) 
                {
                if (req.body.password === resp.password) {
                    res.send(resp); 
                } else {
                    res.send("Incorrect password"); 
                }
            } else {
                res.send("User not found"); 
            }
        })
            }
         else {
        res.send("Email is required");
    }
  })



// Serve static files
app.use('/images', express.static(path.join(__dirname, 'Telwaind-project/Public/images/')));

// Routes
app.use('/products', productRoutes(upload)); // Pass upload middleware to product routes if needed

// Error handling middleware
app.use(errorHandler);

// Start the server
app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});
