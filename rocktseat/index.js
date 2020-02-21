const app = require('express')();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

require('./src/app/controllers/index')(app);

app.listen(3001, () => {
    console.log(`Servidor rodando na porta 3001`)
});