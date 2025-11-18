import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RoleCategory } from '../enums/role-category.enum';
import { EducationLevel } from '../enums/education-level.enum';
import { MaritalStatus } from '../enums/marital-status.enum';
import { UserStatus } from '../enums/user-status.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  birthDate: string;

  @Column({ default: false })
  isAdmin: boolean;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;

  @Column({ type: 'timestamp with time zone', nullable: true })
  lastLogin: Date | null;

  // ---- Datos para analítica ----

  @Column({
    type: 'enum',
    enum: RoleCategory,
    default: RoleCategory.UNKNOWN,
  })
  roleCategory: RoleCategory;

  @Column({
    type: 'enum',
    enum: EducationLevel,
    nullable: true,
  })
  educationLevel: EducationLevel | null;

  @Column({
    type: 'enum',
    enum: MaritalStatus,
    nullable: true,
  })
  maritalStatus: MaritalStatus | null;

  @Column({ type: 'int', default: 0 })
  dependents: number;

  @Column({ type: 'varchar', length: 120, nullable: true })
  occupation: string | null;

  @Column({ type: 'varchar', length: 120, nullable: true })
  country: string | null;

  @Column({ type: 'varchar', length: 120, nullable: true })
  city: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string | null;

  @Column({ type: 'bool', default: false })
  firstFormShowed: boolean;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  status: UserStatus;
}
