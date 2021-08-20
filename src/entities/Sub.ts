// This file was generated by running the command typeorm init --database postgres

// In typeORM entities are like models 


import {Entity as TOEntity, Column, Index, BeforeInsert, ManyToOne, JoinColumn, Unique, OneToMany} from "typeorm";

// we import our abstract entity which we will extend
import Entity from "./Entity"
import User from "./User";
import Post from "./Post";

@TOEntity('subs')
export default class Sub extends Entity {

    // in a partial , some of the fields are allowed to be nullable
    constructor(sub: Partial<Sub>){
        super()
        Object.assign(this,sub)
    }

    
    @Index()
    @Column({unique:true})
    name : string

    @Column({unique:true})
    title : string

    @Column({type : 'text', nullable : true})
    description : string

    @Column({nullable : true})
    imageUrn : string

    @Column({nullable : true})
    bannerUrn : string 

    @ManyToOne(() => User)
    @JoinColumn({name:"username", referencedColumnName:"username"})
    user: User;

    @OneToMany(() => Post, post => post.sub)
    post : Post[]
}
