import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class Location {
    @PrimaryGeneratedColumn()
    id!: number

    @Column({ length: 70, unique: true })
    name!: string
}