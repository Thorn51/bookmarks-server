const express = require("express");
const logger = require("../logger");
const uuid = require("uuid/v4");
const bookmarks = require("../store");

const bookmarksRouter = express.Router();
const bodyParser = express.json();

bookmarksRouter
  .route("/bookmarks")
  .get((req, res) => {
    res.json(bookmarks);
  })
  .post(bodyParser, (req, res) => {
    const { title, url, description, rating = 1 } = req.body;

    if (!title) {
      logger.error("Title is required");
      return res.status(400).send("Invalid request");
    }

    if (!url) {
      logger.error("URL is required");
      return res.status(400).send("Invalid request");
    }

    if (!description) {
      logger.error("Description is required");
      return res.status(400).send("Invalid request");
    }

    let id = uuid();

    const newBookmark = {
      id,
      title,
      url,
      description,
      rating
    };

    bookmarks.push(newBookmark);

    logger.info(`A new bookmark id-${id} was created`);

    res.status(201).send(`Bookmark ${id} posted`);
  });

module.exports = bookmarksRouter;
