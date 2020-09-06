export default interface IAPIManager 
{
	close(): void;

	addRoute(method:string, path: string, functionToCall: (req: any, res: any, next: any) => void );
}
