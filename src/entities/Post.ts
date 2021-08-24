// This file was generated by running the command typeorm init --database postgres

// In typeORM entities are like models

import {
  Entity as TOEntity,
  Column,
  Index,
  BeforeInsert,
  ManyToOne,
  JoinColumn,
  OneToMany,
  AfterLoad,
} from "typeorm";
import { Exclude, Expose } from "class-transformer";

// we import our abstract entity which we will extend
import Entity from "./Entity";
import User from "./User";
import { makeId, slugify } from "../util/helpers";
import Sub from "./Sub";
import Comment from "./Comment";
import Vote from "./Vote";

@TOEntity("posts")
export default class Post extends Entity {
  // in a partial , some of the fields are allowed to be nullable
  constructor(post: Partial<Post>) {
    super();
    Object.assign(this, post);
  }

  // 7 character id for posts
  @Index()
  @Column()
  identifier: string;

  @Column()
  title: string;

  @Index()
  @Column()
  slug: string;

  @Column({ nullable: true, type: "text" })
  body: string;

  @Column()
  subName: string;

  //   we must explicity add this foreign key even though we defined the many to one relationship below. Otherwise it will not be given a column
  // in the table

  @Column()
  username: string;

  // here we are defining a many to one relationship between posts and users
  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: "username", referencedColumnName: "username" })
  user: User;

  @ManyToOne(() => Sub, (sub) => sub.posts)
  @JoinColumn({ name: "subName", referencedColumnName: "name" })
  sub: Sub;

  // The second arugment here is specifying the inverse relationship.

  @Exclude()
  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  // we will not display the votes objects to maintain user privacy
  @Exclude()
  @OneToMany(() => Vote, (vote) => vote.post)
  votes: Vote[];

  @Expose() get url(): string {
    return `/r/${this.subName}/${this.identifier}/${this.slug}`;
  }

  // returns the number of comments a post has

  @Expose() get commentCount(): number {
    return this.comments?.length;
  }

  // returns the vote count of a post

  @Expose() get voteScore(): number {
    return this.votes?.reduce((prev, cur) => prev + (cur.value || 0), 0);
  }

  //   Below is an additional implementation of the above logic. Here we are creating a virtual field

  //   protected url: string;
  //   @AfterLoad()
  //   createFields() {
  //     this.url = `/r/${this.subName}/${this.identifier}/${this.slug}`;
  //   }

  // function to allow us to determine if a user has already voted on a post
  protected userVote: number;
  setUserVote(user: User) {
    const index = this.votes?.findIndex(
      (vote) => vote.username === user.username
    );
    this.userVote = index > -1 ? this.votes[index].value : 0;
  }

  @BeforeInsert()
  makeIdAndSlug() {
    this.identifier = makeId(7);
    this.slug = slugify(this.title);
  }
}
