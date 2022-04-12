import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm"
import { Invitation } from "./Invitation";

@Entity()
export class Invitee {
    @PrimaryGeneratedColumn()
    id!: number

    @Column({ length: 320 })
    email!: string

    @OneToMany(() => Invitation, invitation => invitation.event)
    public events!: Invitation[];
}