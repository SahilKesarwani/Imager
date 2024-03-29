const express = require("express");
const multer = require("multer");
const path = require("path");
const auth = require("../../middleware/auth");

const router = express.Router();

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "public/images");
	},
	filename: (req, file, cb) => {
		cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
	},
});

const upload = multer({ storage });

// Item Model
const Item = require("../../models/Item");

// @route   GET api/items/:userId
// @desc    Get All Items
// @access  Private
router.get("/:userId", auth, (req, res) => {
	const userId = req.params.userId;
	Item.find({ userId })
		.sort({ date: -1 })
		.then(items => res.json(items));
});

// @route   POST api/items
// @desc    Create an Item
// @access  Private
router.post("/", auth, upload.single("file"), (req, res) => {
	const newItem = new Item({
		img: req.file.filename,
		userId: req.body.userId,
	});

	newItem
		.save()
		.then(item => res.json(item))
		.catch(err => res.status(404).json({ message: "Item was not saved." }));
});

// @route   DELETE api/items/:id
// @desc    Delete an Item
// @access  Private
router.delete("/:id", auth, (req, res) => {
	Item.findById(req.params.id)
		.then(item => {
			item.remove()
				.then(() => res.json({ success: true, message: "Item was deleted successfully." }))
				.catch(err => res.status(404).json({ message: "Item not deleted." }));
		})
		.catch(err => res.status(404).json({ success: false, message: "Item was not found." }));
});

module.exports = router;
