// In typeORM entities are like models

import { Entity as ToEntity, Column, ManyToOne, JoinColumn } from "typeorm";
// we import our abstract entity which we will extend
import Entity from "./Entity";
import Post from "./Post";
import User from "./User";
import Comment from "./Comment";

@ToEntity("votes")
export default class Vote extends Entity {
  // in a partial , some of the fields are allowed to be nullable
  constructor(vote: Partial<Vote>) {
    super();
    Object.assign(this, vote);
  }

  @Column()
  value: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: "username", referencedColumnName: "username" })
  user: User;

  @Column()
  username: User;

  @ManyToOne(() => Post)
  post: Post;

  @ManyToOne(() => Comment)
  comment: Comment;
}
