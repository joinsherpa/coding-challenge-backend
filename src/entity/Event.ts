import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from "typeorm"
import { Invitation } from "./Invitation"
import { Location } from "./Location"
import { Organizer } from "./Organizer"

@Entity()
export class Event {
    @PrimaryGeneratedColumn()
    id!: number

    @Column({ length: 70 })
    name!: string

    // TODO: Add Date
    @Column({ type: 'int' })
    date!: number

    @Column()
    isOutside!: boolean

    @ManyToOne(() => Location, (l:Location) => l.name)
    location!: Location

    @ManyToOne(() => Organizer)
    organizer!: Organizer

    @OneToMany(() => Invitation, invitation => invitation.invitee)
    invitations!: Invitation[]
}