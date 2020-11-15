import { Express } from "express";
import { rootPathApp } from "../../main";

const express = require("express");
const consign = require("consign");
const bodyParser = require("body-parser");
const cors = require('cors');

module.exports = () => {
	const api: Express = express();
	api.use(bodyParser.json());
	api.use(cors({origin: "*"}));
	consign({cwd: rootPathApp, extensions: ['.js']}).include('/server/controllers').into(api);
	
	return api;
};
