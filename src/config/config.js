process.env.PORT = process.env.PORT || 3000;


//=======================================
//           BASE DE DATOS
//========================================
if (!process.env.URLDB) {

    process.env.URLDB = 'mongodb://localhost:27017/Education'

}

//=======================================
//    SENDGRID_API_KEY
//=======================================
let sg_key;

if (!process.env.SG_KEY) {
    require("../../sg_key");
    sg_key = process.env.SG_KEY;
} else {
    sg_key = process.env.SG_KEY;
}
process.env.SENDGRID_API_KEY = sg_key;


