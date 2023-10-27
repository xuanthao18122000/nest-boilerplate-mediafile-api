import {
    BaseEntity,
    CreateDateColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn
  } from 'typeorm';
  
  /**
   * custom base entity
   */
  export abstract class CustomBaseEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;
  
    @CreateDateColumn({
      name: 'created_at',
      type: 'timestamptz',
      default: () => 'CURRENT_TIMESTAMP'
    })
    createdAt: Date;
  
    @UpdateDateColumn({
      name: 'updated_at',
      type: 'timestamptz',
      default: () => 'CURRENT_TIMESTAMP',
      onUpdate: 'CURRENT_TIMESTAMP'
    })
    updatedAt: Date;
  }
  