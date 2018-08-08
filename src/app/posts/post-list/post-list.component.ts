import { Component, OnInit, OnDestroy} from '@angular/core';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';

import { PostsService } from '../posts.service';
import { ClientPost } from '../post.model';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../auth/auth-data.model'


@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
	isLoading: boolean = false;
	posts: ClientPost[] = [];
  defaultUser = {email: 'user@public.com', password: 'password'};
  totalPost: number = 10;
  postsPerPage: number = 2;
  currentPage: number = 1;
  pageSizeOptions =  [1, 2, 5, 10];
  user: User = {id: null, token: null};
  private postsSub: Subscription;
  private authStatusSub: Subscription;
  userIsAuthenticated: boolean = false;


  constructor(private postsService: PostsService, private authService: AuthService) { }

  ngOnInit() {
    this.isLoading = true;
  	this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.postsSub = this.postsService.postsUpdated.subscribe((clientData: {posts: ClientPost[], postCount: number}) => {
      this.isLoading = false;
      this.totalPost = clientData.postCount;
      this.posts = clientData.posts;
    });
    this.user = this.authService.getUser();
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService.authStatusListener.subscribe(isAuthenticated => {
      this.isLoading = false;
      this.userIsAuthenticated = isAuthenticated;
      this.user = this.authService.getUser();
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
    }, () => {
      this.isLoading = false;
    })
  }

  loginDefault = () => {
    this.isLoading = true;
    this.authService.login(this.defaultUser);
  }


  ngOnDestroy() {
  	this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

}
