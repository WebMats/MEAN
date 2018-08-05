import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { ClientPost } from './post.model';
import { MongoDBPost } from './post.model';

interface MongoDBData {message: string, posts: MongoDBPost[], maxPosts: number};


@Injectable({providedIn: 'root'})
export class PostsService {
	private posts: ClientPost[] = [];
	postsUpdated = new Subject<{posts: ClientPost[], postCount: number}>();

	constructor(private httpClient: HttpClient, private router: Router) {}


	getPosts = (postsPerPage: number, currentPage: number) => {
		const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
		this.httpClient.get<MongoDBData>(`http://localhost:3000/api/posts${queryParams}`).pipe(map((mongoDBdata) => {
			return {fetchedPosts: mongoDBdata.posts.map((post: MongoDBPost) => {
				return {
					title: post.title,
					content: post.content,
					id: post._id,
					imagePath: post.imagePath
				}
			}), maxPosts: mongoDBdata.maxPosts};
		})).subscribe((dataForClient: {fetchedPosts: ClientPost[], maxPosts: number}) => {
			this.posts = dataForClient.fetchedPosts
			this.postsUpdated.next({posts: this.posts.slice(), postCount: dataForClient.maxPosts});
		});
	}

	getPost = (idRequested: string) => {
		return this.httpClient.get<MongoDBPost>(`http://localhost:3000/api/posts/${idRequested}`);
	}

	addPost = (postToBeAdded: ClientPost, image: File) => {
		const postData = new FormData();
		Object.keys(postToBeAdded).forEach(key => {
			key === "id" ? postData.append('_id', postToBeAdded[key]) : postData.append(key, postToBeAdded[key]);
		})
		postData.append('image', image);
		this.httpClient.post<{message: string, post: MongoDBPost}>('http://localhost:3000/api/posts', postData).subscribe((resData) => {
			this.router.navigate(["/"]);
		})
	}

	updatePost = (postRequested: ClientPost, image: File | string ) => {
		let postData: FormData | MongoDBPost;
		const postForDB = {...postRequested, _id: postRequested.id}
		delete postForDB.id 
		if (typeof image === "object") {
			const postDataCopy = new FormData();
			Object.keys(postForDB).forEach(key => {
				postDataCopy.append(key, postForDB[key]);
			})
			postData = postDataCopy;
			postData.append('image', image);
		} else {
			postData = postForDB;
		}
		this.httpClient.patch(`http://localhost:3000/api/posts/${postRequested.id}`, postData).subscribe(res => {
			this.router.navigate(["/"]);
		})
	}

	deletePost = (postId: string) => {
		return this.httpClient.delete(`http://localhost:3000/api/posts/${postId}`)
	}

}