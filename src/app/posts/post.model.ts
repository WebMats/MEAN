interface PostBody {
	title: string;
	content: string;
	imagePath: string;
	creator: string
}


export interface ClientPost extends PostBody {
	id: string;
}

export interface MongoDBPost extends PostBody {
	_id: string;
}