import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { PostsService } from '../posts.service'
import { MongoDBPost } from '../post.model';
import { ClientPost } from '../post.model';
import { mineType } from './mime-type.validator';


@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  private mode: string = 'create';
  postForm: FormGroup;
  imagePreview: string;
  isLoading: boolean = false;
  private postId: string;

  constructor(private postsService: PostsService, private route: ActivatedRoute) {}


  ngOnInit() {
    this.postForm = new FormGroup({
      'title': new FormControl(null, {validators: [Validators.required, Validators.minLength(4)]}),
      'content': new FormControl(null, {validators: Validators.required}),
      'image': new FormControl(null, {validators: Validators.required, asyncValidators: mineType })
    })

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.isLoading = true;
        this.postsService.getPost(paramMap.get('postId')).subscribe((postData: MongoDBPost) => {
          this.isLoading = false;
          this.postId = postData._id;
          this.imagePreview = postData.imagePath;
          this.postForm.setValue({'title': postData.title, 'content': postData.content, 'image': postData.imagePath});
        })
      } else {
        this.mode = 'create';
      }
    });
  }

  onImagePicked = (event: Event) => {
    const file = (event.target as HTMLInputElement).files[0];
    this.postForm.patchValue({image: file});
    this.postForm.get('image').updateValueAndValidity();
    if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    }
    reader.readAsDataURL(file);
  }
  }

  onSavePost = () => {
    this.isLoading = true;
    const post: ClientPost = {
      id: this.postId ||  null, 
      title: this.postForm.value.title, 
      content: this.postForm.value.content, 
      imagePath: typeof(this.postForm.value.image) === "string" ? this.postForm.value.image : null
    }
    if (this.mode ==='create') {
      this.postsService.addPost(post, this.postForm.value.image)
    } else {
      this.postsService.updatePost(post, this.postForm.value.image);
    }
  	
  	this.postForm.reset();
  }

}
