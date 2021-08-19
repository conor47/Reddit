
// This is an abstract entity which we will extend our other entities with. These helps us to write DRY code.
// Provides a base class from which we can extend to add additional functionality for each entity

import {PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, UpdateDateColumn} from "typeorm";
import { classToPlain , Exclude} from 'class-transformer'

export default abstract class Entity extends BaseEntity {

    // imported from class-transformer. Allows us to remove properties from objects
    @Exclude()
    @PrimaryGeneratedColumn()
    id: number;

    // a build in typeorm property decorator that allows us to create a created at column
    @CreateDateColumn()
    createdAt : Date

    // a build in typeorm property decorator that allows us to create an updated at column
    @UpdateDateColumn()
    updatedAt : Date

    // here we are overriding the toJson method. This will transform the class object to a plain object.
    // Will also go through and if the property has the exclude decorator it will hide it. This means that our 
    // responses returned to the user will not contain the id or password
    toJSON(){
        return classToPlain(this)
    }
}
