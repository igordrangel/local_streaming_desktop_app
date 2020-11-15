import { app, BrowserWindow } from "electron";
import { Express } from "express";
import { Electron } from "./server/models/electron/electron";
import { autoUpdater } from 'electron-updater';
import { ElectronWindowEnum } from "./server/enums/electron-window.enum";

export const rootPathApp = __dirname;

let mainWindow: BrowserWindow;

app.allowRendererProcessReuse = true;
app.on('ready', async () => {
	const splashScreen = await Electron.splashScreen();
	
	const apiExpress = require("./server/config/api-express");
	const api: Express = apiExpress();
	api.listen(9090, () => {
		console.log('Servidor Iniciado!');
	});
	
	const appExpress = require("./server/config/app-express");
	const appPublic: Express = appExpress();
	appPublic.listen(8080, () => {
		console.log('App Iniciado!');
	});
	
	mainWindow = await Electron.openWindow({
		nameWindow: 'Local Streaming',
		enumWindow: ElectronWindowEnum.home
	}, true);
	
	mainWindow.once('ready-to-show', () => {
		if (splashScreen) {
			splashScreen.close();
		}
		mainWindow.show();
	});
	
	await mainWindow.webContents.session.clearStorageData({
		storages: ['localStorage']
	});
	
	mainWindow.on('closed', () => {
		mainWindow = null
	});
	
	autoUpdater.on('checking-for-update', (e) => {
		splashScreen.webContents.send('checking-for-update', "Buscando atualizações");
	});
	autoUpdater.on('update-not-available', async () => {
		splashScreen.webContents.send('update-not-available', true);
		await Electron.loadURL(mainWindow);
	});
	autoUpdater.on('download-progress', (progressObj) => {
		splashScreen.webContents.send('download-progress', progressObj.percent);
	});
	autoUpdater.on('update-downloaded', () => {
		autoUpdater.quitAndInstall();
	});
	
	await autoUpdater.checkForUpdates().catch();
});
