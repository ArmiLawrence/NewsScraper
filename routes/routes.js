// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");


// Require all models
var db = require("../models");

module.exports = function (app) {

// Get Handlebars pages, MAIN PAGE
    app.get("/", function(req, res) {
        // Grab every unsaved document in the Articles collection
        db.Article.find({ saved: false }, function(error, data) {
                var hbsObject = {
                articles: data
                };
                console.log(hbsObject);
                res.render("index", hbsObject);
        });
    });
  
  
    // A GET route for scraping the NYT website
    app.get("/scrape", function(req, res) {
        // First, we grab the body of the html with axios
        axios.get("https://www.nytimes.com/section/world/").then(function(response) {
            // Then, we load that into cheerio and save it to $ for a shorthand selector
            var $ = cheerio.load(response.data);
  
            // Now, we grab every h2 within an article tag, and do the following:
            $("article").each(function(i, element) {
            // Save an empty result object
            var result = {};
  
            // Add the text and href of every link, and save them as properties of the result object
            result.link = $(element).find("a").attr("href");
            result.title = $(element).find("span").text().trim();
            result.summary = $(element).find("li").text().trim();
  
            // Create a new Article using the `result` object built from scraping
            db.Article.create(result)
                .then(function(dbArticle) {
                // View the added result in the console
                console.log(dbArticle);
                })
                .catch(function(err) {
                // If an error occurred, log it
                console.log(err);
                });
            });
  
            // Send a message to the client
            res.send("Scrape Complete");
            res.redirect("/");
        });
    });
  
    //ARTICLES
    // Route for getting all Articles from the db
    app.get("/articles", function(req, res) {
    // Grab every document in the Articles collection
      db.Article.find({})
          .then(function(dbArticle) {
          // If we were able to successfully find Articles, send them back to the client
          res.json(dbArticle);
          })
          .catch(function(err) {
          // If an error occurred, send it to the client
          res.json(err);
          });
    });
  
    // Route for grabbing a specific Article by id, populate it with it's note
    app.get("/articles/:id", function(req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
      db.Article.findOne({ _id: req.params.id })
          // ..and populate all of the notes associated with it
          .populate("note")
          .then(function(dbArticle) {
          // If we were able to successfully find an Article with the given id, send it back to the client
          res.json(dbArticle);
          })
          .catch(function(err) {
          // If an error occurred, send it to the client
          res.json(err);
          });
    });
  
    // Route for saving/updating an Article's associated Note
    app.post("/articles/:id", function(req, res) {
    // Create a new note and pass the req.body to the entry
      db.Note.create(req.body)
          .then(function(dbNote) {
          // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
          // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
          // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
          return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
          })
          .then(function(dbArticle) {
          // If we were able to successfully update an Article, send it back to the client
          res.json(dbArticle);
          })
          .catch(function(err) {
          // If an error occurred, send it to the client
          res.json(err);
          });
    });
  
  
    // Route for saving a specific Article by id, Update saved column to true - UPDATE, 20190331
    app.put("/articles/:id", function(req, res) {
        // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
        db.Article.findOneAndUpdate({ _id: req.params.id }, { saved: true})
            .then(function(dbArticle) {
            // If we were able to successfully find an Article with the given id, send it back to the client
            res.json(dbArticle);
            })
            .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
            });
    });
  
    //SAVED
    // Route for getting saved Articles from the db, 20190331
    app.get("/saved", function(req, res) {
        // Grab every document in the Articles collection
        db.Article.find({ saved: true }, function(error, data) {
              var hbsObject = {
              articles: data
              };
              console.log(hbsObject);
              res.render("saved", hbsObject);
          });
    });
  
    // Route for grabbing a specific Saved Article by id, populate it with it's note, 20190331
    app.get("/saved/:id", function(req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
        db.Article.findOne({ _id: req.params.id })
            // ..and populate all of the notes associated with it
            .populate("note")
            .then(function(dbArticle) {
            // If we were able to successfully find an Article with the given id, send it back to the client
            res.json(dbArticle);
            })
            .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
            });
    });
  
     // Route for saving/updating an Article's associated Note
     app.post("/saved/:id", function(req, res) {
        // Create a new note and pass the req.body to the entry
        db.Note.create(req.body)
            .then(function(dbNote) {
            // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
            // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
            // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
            })
            .then(function(dbArticle) {
            // If we were able to successfully update an Article, send it back to the client
            res.json(dbArticle);
            })
            .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
            });
    });
  
  
    // Route for delete a Saved Article - DELETE, 20190331
    app.delete("/saved/:id", function(req, res) {
    // Create a new note and pass the req.body to the entry
      db.Article.deleteOne({ _id: req.params.id })
          .then(function(dbArticle) {
          // If we were able to successfully update an Article, send it back to the client
          res.json(dbArticle);
          })
          .catch(function(err) {
          // If an error occurred, send it to the client
          res.json(err);
          });
    });
  
  
  //NOTES
  
    // Route for getting saved Articles from the db, 20190331
    app.get("/notes", function(req, res) {
      // Grab every document in the Articles collection
      db.Note.find({}, function(error, data) {
            var hbsObject = {
            notes: data
            };
            console.log(hbsObject);
            res.render("notes", hbsObject);
        });
    });
  
    // Route for delete a Saved Note - DELETE, 20190331
    app.delete("/notes/:id", function(req, res) {
      // Create a new note and pass the req.body to the entry
        db.Note.deleteOne({ _id: req.params.id })
            .then(function(dbNote) {
            // If we were able to successfully update an Article, send it back to the client
            res.json(dbNote);
            })
            .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
            });
      });
  
}