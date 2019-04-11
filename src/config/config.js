process.env.PORT = process.env.PORT || 3000;
//process.env.URLDB = URLDB || 'mongodb://localhost:27017/Education';


process.env.NODE_ENV = process.env.NODE_ENV || 'local';

let urlDB
if (process.env.NODE_ENV === 'local'){
	urlDB = 'mongodb://localhost:27017/Education';
}
else {
	urlDB = 'mongodb+srv://isamuor:Isa1990@cluster0-fts48.mongodb.net/test?retryWrites=true'
}

process.env.URLDB = urlDB