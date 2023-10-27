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

  static enum = {
    STATUS: {
      ACTIVE: 1,
      INACTIVE: -1,
    },
    TYPE: {
      GLOBAL: 1,
    },
    SIZES: {
      THUMP: 240,
      RESOLUTIONS: [1080, 720, 480, 360, 240, 128, "thumbnail"],
    },
  };
}
