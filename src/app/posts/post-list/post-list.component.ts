import { Component, OnInit, OnDestroy} from '@angular/core';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';

import { PostsService } from '../posts.service';
import { ClientPost } from '../post.model';


@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
	isLoading: boolean = false;
	posts: ClientPost[] = [];

  totalPost: number = 10;
  postsPerPage: number = 2;
  currentPage: number = 1;
  pageSizeOptions =  [1, 2, 5, 10];

  private postsSub: Subscription;


  constructor(private postsService: PostsService) { }

  ngOnInit() {
    this.isLoading = true;
  	this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.postsSub = this.postsService.postsUpdated.subscribe((clientData: {posts: ClientPost[], postCount: number}) => {
      this.isLoading = false;
      this.totalPost = clientData.postCount;
      this.posts = clientData.posts;
    });
  }

  onChangePage = (pageData: PageEvent) => {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage)
  }

  onDelete = (postId: string) => {
    this.isLoading = true;
    this.postsService.deletePost(postId).subscribe(() => {
      this.postsService.getPosts(this.postsPerPage, this.currentPage);
    })
  }


  ngOnDestroy() {
  	this.postsSub.unsubscribe();
  }

}
