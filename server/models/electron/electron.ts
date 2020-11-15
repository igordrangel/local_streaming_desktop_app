import { ElectronWindowInterface } from "./interfaces/electron-window.interface";
import { app, BrowserWindow } from "electron";
import * as url from "url";
import * as path from 'path';
import { ElectronWindowEnum } from "../../enums/electron-window.enum";
import BrowserWindowConstructorOptions = Electron.BrowserWindowConstructorOptions;

export class Electron {
	public static defaultWindowConfig: BrowserWindowConstructorOptions = {
		titleBarStyle: 'hidden',
		autoHideMenuBar: true,
		title: "Local Streaming",
		width: 1280,
		height: 720,
		frame: false,
		webPreferences: {
			nodeIntegration: true
		}
	};
	private static _windows: ElectronWindowInterface[] = [];
	
	public static async openWindow(windowConfig: ElectronWindowInterface, showSplashScreen: boolean = false) {
		let windowOpened = this.getWindowOpened(windowConfig.enumWindow);
		
		if (windowOpened) {
			windowOpened.focus();
		} else {
			this._windows.push(windowConfig);
			const newWindow = await this.createWindow(windowConfig, showSplashScreen);
			windowConfig.browserWindow = newWindow;
			await this.loadURL(newWindow, windowConfig.url);
			newWindow.focus();
			
			return newWindow;
		}
		
		return windowOpened;
	}
	
	public static async loadURL(browserWindow: BrowserWindow, routePath: string = '/') {
		await browserWindow.loadURL(
			url.format({
				pathname: 'localhost:8080' + routePath,
				protocol: "http:",
				slashes: true,
				hash: app.getVersion()
			})
		);
	}
	
	public static async focusWindowByEnum(windowEnum: ElectronWindowEnum) {
		let browserWindow = this.getWindowOpened(windowEnum);
		if (browserWindow) {
			browserWindow.focus();
		}
	}
	
	public static async closeWindowByEnum(windowEnum: ElectronWindowEnum) {
		let browserWindow = this.getWindowOpened(windowEnum);
		if (browserWindow) {
			await this.closeWindow(browserWindow);
			browserWindow.close();
		}
	}
	
	public static async closeWindow(browserWindow: BrowserWindow) {
		if (this._windows.filter(window =>
			window.browserWindow.id == browserWindow.id
		).length > 0) {
			app.exit();
		}
		
		this._windows = this._windows.filter(window => window.browserWindow.id != browserWindow.id);
	}
	
	public static async splashScreen() {
		const splash = new BrowserWindow({
			titleBarStyle: 'hidden',
			autoHideMenuBar: true,
			title: "Local Streaming",
			width: 500,
			height: 280,
			frame: false,
			hasShadow: true,
			webPreferences: {
				nodeIntegration: true
			},
			resizable: false
		});
		await splash.loadURL(`file://${path.join(__dirname, '../../../public/assets/splash.html')}`);
		
		return splash;
	}
	
	private static async createWindow(windowConfig: ElectronWindowInterface, showSplashScreen: boolean = false) {
		let options = this.defaultWindowConfig;
		options.title = windowConfig.nameWindow;
		options.show = !showSplashScreen;
		
		const window = new BrowserWindow(options);
		
		app.on('window-all-closed', function () {
			if (process.platform !== 'darwin') {
				app.quit()
			}
		});
		app.on('activate', async () => {
			if (window === null) {
				await this.createWindow(windowConfig);
			}
		});
		window.on('close', () => {
			Electron.closeWindow(window);
		});
		
		return window;
	}
	
	private static getWindowOpened(enumWindow: number): BrowserWindow {
		let windowsOpened = this._windows.filter(window => window.enumWindow == enumWindow);
		
		return windowsOpened.length > 0 ? windowsOpened[0].browserWindow : null;
	}
}
