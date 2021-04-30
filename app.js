// require .env
require('dotenv').config();
// requring modules
const express=require('express');
const cors=require('cors');
const mongoose=require('mongoose');
const bodyParser=require('body-parser');
const port=4040;


// initialize express application
const app= express();

// configure application
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended:true
}));




// initialize mongoose
const mongo_db=mongoose.connection;
mongoose.Promise = global.Promise;
mongoose.set('useFindAndModify', false);

// connect to database
mongoose.connect(process.env.DATABASE_URL
                 ,{useNewUrlParser:true,
                   useFindAndModify:false,
                   useCreateIndex:true,
                   useUnifiedTopology:true});

mongo_db.on('error',(error)=> console.log('\n mongodb connection error'+error) );
mongo_db.once('open',()=> console.log('connected to mongo db') );



//entry point of application
app.get('/',(req,res)=>{
    res.json({status:'success'})
});

// require routers
app.use('/user',require('./routers/user.router'));
app.use('/images', express.static(__dirname + '/Images'));//serving images




app.listen(port,()=>{
    console.log(`\n ${port} is active`)
});


