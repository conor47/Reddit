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
import { Expose } from "class-transformer";

// we import our abstract entity which we will extend
import Entity from "./Entity";
import User from "./User";
import { makeId, slugify } from "../util/helpers";
import Sub from "./Sub";
import Comment from "./Comment";

@TOEntity("posts")
export default class Post extends Entity {
  // in a partial , some of the fields are allowed to be nullable
  constructor(user: Partial<Post>) {
    super();
    Object.assign(this, user);
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
  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @Expose() get url(): string {
    return `/r/${this.subName}/${this.identifier}/${this.slug}`;
  }

  //   Below is an additional implementation of the above logic. Here we are creating a virtual field

  //   protected url: string;
  //   @AfterLoad()
  //   createFields() {
  //     this.url = `/r/${this.subName}/${this.identifier}/${this.slug}`;
  //   }

  @BeforeInsert()
  makeIdAndSlug() {
    this.identifier = makeId(7);
    this.slug = slugify(this.title);
  }
}
