import { Component, OnInit, OnDestroy} from '@angular/core';
import { Subscription } from 'rxjs';

import { PostsService } from '../posts.service';
import { Post } from '../post.model';


@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
	// posts: [] = [
	// 	{title: 'First Post', content: 'This is some content for the First Post'},
	// 	{title: 'Second Post', content: 'This is some content for the Second Post'},
	// 	{title: 'Third Post', content: 'This is some content for the Third Post'}
	// ]
	posts: Post[] = [];
	private postsSub: Subscription;


  constructor(private postsService: PostsService) { }

  ngOnInit() {
  	this.posts = this.postsService.getPosts();
    this.postsSub = this.postsService.postsUpdated.subscribe((posts: Post[]) => {
      this.posts = posts;
    });
  	// this.postsSub = this.postsService.getPostsUpdateListener().subscribe((posts: Post[]) => {
  	// 	this.posts = posts;
  	// });
  }


  ngOnDestroy() {
  	this.postsSub.unsubscribe();
  }

}
