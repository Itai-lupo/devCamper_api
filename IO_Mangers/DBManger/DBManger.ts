
export interface DBManager {
    
    
    
	connect(url: string): void;
	close(): void;
}
