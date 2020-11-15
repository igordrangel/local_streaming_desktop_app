import { Express } from "express";
import { Electron } from "../../models/electron/electron";
import { ElectronWindowInterface } from "../../models/electron/interfaces/electron-window.interface";
import { ResponseInterface } from "../../interfaces/response.interface";
import { ElectronWindowEnum } from "../../enums/electron-window.enum";

module.exports = (app: Express) => {
	app.post('/electron/open', async (req, res) => {
		const dados = req.body as ElectronWindowInterface;
		
		await Electron.openWindow(dados);
		res.status(200).send({
			error: false,
			message: "Ação realizada com sucesso."
		} as ResponseInterface);
	});
	
	app.post('/electron/restore', async (req, res) => {
		await Electron.focusWindowByEnum(ElectronWindowEnum.home);
		res.status(200).send({
			error: false,
			message: "Ação realizada com sucesso."
		} as ResponseInterface);
	});
	
	app.post('/electron/close', async (req, res) => {
		const dados = req.body as { enumWindow: ElectronWindowEnum[] };
		
		for (let enumWindow of dados.enumWindow.values()) {
			await Electron.closeWindowByEnum(enumWindow);
		}
		res.status(200).send({
			error: false,
			message: "Ação realizada com sucesso."
		} as ResponseInterface);
	});
};
