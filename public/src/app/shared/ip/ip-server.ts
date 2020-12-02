export class IpServer {
	private static ipStorageName = 'localStorageIpLocalServer';
	
	public static getHost() {
		return `http://${IpServer.getIp()}:3000`;
	}
	
	public static getIp() {
		return localStorage.getItem(this.ipStorageName);
	}
	
	public static setIp(ip: string) {
		localStorage.setItem(this.ipStorageName, ip);
	}
}
