import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  Timestamp,
  UpdateDateColumn,
  CreateDateColumn,
} from "typeorm";

/**
 * @author Marvin Ambrose
 */
@Entity()
export class BlogPost {
  @PrimaryGeneratedColumn({
    type: "integer",
    comment: "The id of the comment",
  })
  blog_id: number;

  @Column({
    type: "varchar",
    comment: "Title of the Blog",
  })
  title: string;

  @Column({
    type: "text",
    comment: "Description of the Blog",
  })
  description: string;

  @CreateDateColumn({
    type: "timestamp",
    comment: "Creation data",
    default: Timestamp,
  })
  created_on: Date;

  @UpdateDateColumn({
    type: "timestamp",
    comment: "Time of Update",
    default: Timestamp,
  })
  updated_on: Date;
}