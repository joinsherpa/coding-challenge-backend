import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class Location {
    @PrimaryGeneratedColumn()
    id!: number

    @Column({ length: 70 })
    name!: string
}