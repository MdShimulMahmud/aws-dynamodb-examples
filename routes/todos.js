const express = require("express");
const { v4: uuidv4 } = require("uuid");
const { docClient, TABLE_NAME } = require("../db");
const {
  PutCommand,
  ScanCommand,
  DeleteCommand,
} = require("@aws-sdk/lib-dynamodb");

const router = express.Router();

// Get all todos
router.get("/todos", async (req, res) => {
  try {
    const data = await docClient.send(
      new ScanCommand({ TableName: TABLE_NAME })
    );
    res.json(data.Items || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new todo
router.post("/todos", async (req, res) => {
  const { text } = req.body;
  const item = { id: uuidv4(), text };
  try {
    await docClient.send(new PutCommand({ TableName: TABLE_NAME, Item: item }));
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a todo
router.delete("/todos/:id", async (req, res) => {
  try {
    await docClient.send(
      new DeleteCommand({
        TableName: TABLE_NAME,
        Key: { id: req.params.id },
      })
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
