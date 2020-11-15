import { Express } from "express";
import { rootPathApp } from "../../main";
import * as path from "path";

const express = require("express");
const cors = require('cors');

module.exports = () => {
	const app: Express = express();
	app.use(express.static(path.join(rootPathApp, './public')));
	app.use(cors({origin: "*"}));
	app.get('**/*', (req, res) => {
		res.sendFile(path.join(rootPathApp, './public/index.html'));
	});
	
	return app;
};
