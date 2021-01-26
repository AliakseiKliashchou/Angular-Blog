import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { FbCreateResponce, Post } from "./interfaces";

@Injectable({ providedIn: 'root' })
export class PostsService {

  constructor( private readonly http: HttpClient ) {}

  public create(post: Post): Observable<Post> {
    return this.http.post(`${environment.fbDbUrl}/posts.json`, post)
      .pipe(map( (responce: FbCreateResponce) => {
        return {
          ...post,
          id: responce.name,
          date: new Date(post.date)
        }
      }));
  }

  public getAll(): Observable<Post[]> {
    return this.http.get(`${environment.fbDbUrl}/posts.json`)
      .pipe(map( (response: {[key: string]: any}) => {
        return Object.keys(response).map( key => ({
          ...response[key],
          id: key,
          date: new Date(response[key].date)
        }))
      }));
  }

  public remove(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.fbDbUrl}/posts/${id}.json`);
  }

  public getById(id: string): Observable<Post> {
    return this.http.get(`${environment.fbDbUrl}/posts/${id}.json`)
    .pipe(map( (post: Post) => {
      return {
        ...post,
        id,
        date: new Date(post.date)
      }
    }));
  }

  public update(post: Post): Observable<Post> {
    return this.http.patch<Post>(`${environment.fbDbUrl}/posts/${post.id}.json`, post);
  }

}
