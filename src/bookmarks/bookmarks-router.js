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

bookmarksRouter
  .route("/bookmarks/:id")
  .get((req, res) => {
    const { id } = req.params;
    const bookmark = bookmarks.find(bookmark => bookmark.id == id);

    if (!bookmark) {
      logger.error(`Bookmark id-${id} not found`);
      return res.status(404).send("Invalid request");
    }

    res.json(bookmark);
  })
  .delete((req, res) => {
    const { id } = req.params;
    const bookmarkIndex = bookmarks.findIndex(bookmark => bookmark.id == id);

    if (bookmarkIndex === -1) {
      logger.error(`Bookmark with id-${id} was not found`);
      return res.status(404).send("Nope, not found");
    }

    bookmarks.splice(bookmarkIndex, 1);

    const dateStamp = Date();

    logger.info(`Bookmark id-${id} removed on ${dateStamp}`);

    res.status(204).send();
  });

module.exports = bookmarksRouter;
