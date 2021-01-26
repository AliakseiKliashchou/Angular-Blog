import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from 'src/app/shared/interfaces';
import { PostsService } from 'src/app/shared/posts.service';
import { AlertService } from '../shared/services/alert.service';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit, OnDestroy {

  public posts: Post[] = [];
  private pSub: Subscription;
  private dSub: Subscription;
  public searchStr: string = '';

  constructor(
    private readonly postService: PostsService,
    private readonly alert: AlertService
  ) { }

  ngOnInit(): void {
    this.pSub = this.postService.getAll().subscribe( posts => {
      this.posts = posts;
    });
  }

  public remove(id: string): void {
    this.dSub = this.postService.remove(id).subscribe( () => {
      this.posts = this.posts.filter( post => post.id !== id);
      this.alert.warning('Post was deleted');
    });
  }

  ngOnDestroy(): void {

    if (this.pSub) {
      this.pSub.unsubscribe();
    }

    if (this.dSub) {
      this.dSub.unsubscribe();
    }

  }

}
