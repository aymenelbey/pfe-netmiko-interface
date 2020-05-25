const express = require('express')
const bodyParser = require('body-parser');
const { exec } = require('child_process');

const cors = require('cors')

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/show-ip-int-br', (req, res, next) => {
    exec('python ./python/show-ip-int-br.py', (err, stdout, stderr) => {
        if(!err && stderr == '') return res.json({message: 'Data was receieved', stdout: JSON.parse(stdout), success: true});
        return res.status(500).json({message: 'An error has occured', err, stderr, success: false});
    });
});
app.post('/interface-updown', (req, res, next) => {
    let { name, status } = req.body;
    console.log(name, status);
    exec(`python ./python/interface-updown.py ${name} "${status}"`, (err, stdout, stderr) => {
        console.log(stdout);
        if(!err && stderr == '') return res.json({message: 'Data was receieved', stdout, success: true});
        return res.status(500).json({message: 'An error has occured', err, stderr, success: false});
    });
});
app.post('/update-ip', (req, res, next) => {
    let { name, ip } = req.body;
    exec(`python ./python/update-ip.py "${name}" ${ip}`, (err, stdout, stderr) => {
        if(!err && stderr == '') return res.json({message: 'Data was receieved', stdout, success: true});
        return res.status(500).json({message: 'An error has occured', err, stderr, success: false});
    });
});
app.listen(3000, () => console.log('Server started on port: 3000'))