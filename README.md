# NewsScraper

New York Times Scraper

The goal of the New York Time Scraper app is to scrape the New York Times website for news articles. 

* The Nav Bar on the top has three links and a button.
    * The "Home" link allows a user to return to the main page, where the user can see their articles and notes. 
    * The "Saved Articles" link allows a user to view all of their saved articles or notes for review. 
    * The "Notes" link allows the user to review all of their notes and delete notes if they desire. 
    * Scrape Articles button on the top right aims to scrape the data from the New York Times.

On the left side of the Home page are the articles. When a user clicks on the summary of the article, a Notes section will appear on the right side of the page. A user is able to save a Title and a Note and save it for further review. The user is also able to save articles by clicking the Save Article button. Saved articles can be viewed in the Saved Articles page.

The Saved Articles page allows a user to also click and save notes. Once the user is done with their articles, they can click on the Delete Article to delete the record.

The Notes page has all of the notes the user has created. This is the page where the user can delete the notes they have created, as creating and updating can be done through the Home and Saved Articles pages.

![New York Times Scraper](/public/img/NYTScrape.PNG)

* Node packages downloaded for use in this app:
    * [Axios](https://www.npmjs.com/package/axios)
    * [Cheerio](https://www.npmjs.com/package/cheerio)
    * [Express](https://www.npmjs.com/package/express)
    * [Handlebars](https://www.npmjs.com/package/express-handlebars)
    * [Mongoose](https://www.npmjs.com/package/mongoose)
    * [Morgan](https://www.npmjs.com/package/morgan)

* Tools Used:
    * MongoDB
    * Node.js
    * Javascript
    * Git Bash/Terminal
    * Morgan - logging, debugging of API calls
    * Handlebars - HTML templating

* Concepts Applied
    * ORM - Object Relational Mapping
        * Mongoose
    * Website Scraping
        * Cheerio
        * Axios for the API call to the website 
    * MVC - Model View Controller