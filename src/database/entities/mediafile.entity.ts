import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity({ name: "mediafiles" })
export class Mediafile {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    nullable: true,
  })
  name: string;

  @Column({
    name: "key_name",
    nullable: true,
  })
  keyName: string;

  @Column({
    name: "physical_path",
    nullable: true,
  })
  physicalPath: string;

  @Column({
    nullable: true,
    name: "mime_type",
  })
  mimeType: string;

  @Column({
    nullable: true,
  })
  size: number;

  @Column({
    nullable: true,
  })
  extension: string;

  @Column({
    nullable: true,
    type: "jsonb",
  })
  variants: object;

  @Column({
    nullable: true,
  })
  status: number;

  @Column({
    nullable: true,
  })
  type: number;

  @Column({
    nullable: true,
    type: "jsonb",
    default: {},
  })
  logs: object;

  @CreateDateColumn({
    name: "created_at",
    type: "timestamptz",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: "updated_at",
    type: "timestamptz",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updatedAt: Date;
}
