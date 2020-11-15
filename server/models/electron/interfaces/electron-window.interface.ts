import BrowserWindow = Electron.BrowserWindow;

export interface ElectronWindowInterface {
	enumWindow: number;
	nameWindow: string;
	url?: string;
	browserWindow?: BrowserWindow;
}