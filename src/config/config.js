process.env.PORT = process.env.PORT || 3000;
//process.env.URLDB = 'mongodb://localhost:27017/Education';

if (!process.env.URLDB) {

    process.env.URLDB = 'mongodb://localhost:27017/Education'

}

/*process.env.NODE_ENV = process.env.NODE_ENV || 'local';


let urlDB
if (process.env.NODE_ENV === 'local'){
	urlDB = 'mongodb://localhost:27017/Education';
}
else {
	urlDB = 'mongodb+srv://isamuor:S3N6R8qeuLapq9FP@cluster0-fts48.mongodb.net/Education?retryWrites=true'
}

process.env.URLDB = urlDB*/