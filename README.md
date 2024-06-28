DevShelf- Error_204

In the public folder we have stored all the html and css files. When files are to be downloaded then they are to be put in the same manner for it to work properly.
Rough structure should be something like this

project-root/
│
├── node_modules
|
├── public/
│   ├──about.html
│   ├── index.html
│   ├── profile.html
│   ├── register.html
│   ├── search_profile.html
│   ├── stylef.css
│   └── search.html   
│
├── index.js
│
├── users.json
├── UpdatedDatasetSOI.json
│
├── package.json
└── package-lock.json

node modules had a lot of files withing the folder so havent uploaded them

index.js- provides endpoints for user registration, login, book search, adding books to cart with stock management, and user profile retrieval, all backed by JSON file storage
users.json- stores data of the user
UpdatedDatasetSOI.json- dataset that was provided
about.html- structure of our design page
index.html- structure of our home page
profile.html- structure of our profile page
register.html- structure of our registeration page
search_profile.html- structure of our search page that opens when you search once you have logged in
search.html- structure of our search page that opens when the user search for a book from home page
stylef.css- stores design of out pages

Team Members:-
RICHA RAJASHEKHAR
DEV KAUSHAL

