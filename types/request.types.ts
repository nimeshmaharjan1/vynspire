export interface GetPostsParams {
	page?: number;
	limit?: number;
	search?: string;
	category?: string;
	tags?: string[];
	published?: boolean;
}
