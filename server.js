const express = require('express');
const cors = require('cors');
const corsOptions = require('./config/corsOption')
const app = module.exports = express();
const PORT = 8080;

app.use(express.json());
app.use(cors(corsOptions));

app.use('/users', require('./routes/users'));
app.use('/tiers', require('./routes/tiers'));
app.use('/tags', require('./routes/tags'));
app.use('/categories', require('./routes/categorie'));
app.use('/', require('./routes/medias'));

app.listen(PORT, () => {
    console.log(`The api is working on http://localhost:${PORT}`);
});
