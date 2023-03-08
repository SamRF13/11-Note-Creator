const express = require('express');
const path = require('path');
const dbjson = require("./db/db.json")
const fs = require('fs');
// Helper method for generating unique ids
const uuid = require('./helpers/uuid');
const PORT = 3001;


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('/api/notes', (req, res) => {
fs.readFile('./db/db.json','utf8', (err, data) =>{
  res.json(JSON.parse(data))
  
  //res.json(dbjson)//

})
});

app.post('/api/notes', (req, res) =>
{ 
const { title, text} = req.body;

if (title && text ) {
    // Variable for the object we will save
    const notes = {
    
        title,
        text,
        id: uuid(),
    };

fs.readFile('./db/db.json','utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      // Convert string into JSON object
      const parsedNotes = JSON.parse(data);
// Parsed means it changed from String to JSON (object).
      // Add a new note
    parsedNotes.push(notes);

      // Write updated reviews back to the file
      fs.writeFile(
        './db/db.json',
        JSON.stringify(parsedNotes, null, 4),
        (writeErr) =>
            writeErr
            ? res.json(writeErr)
            : res.json('Successfully updated notes!')
      );
    }
  });
}});
app.get('/*', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.listen(PORT, () =>
console.log(`App listening at http://localhost:${PORT} 🚀`)
);