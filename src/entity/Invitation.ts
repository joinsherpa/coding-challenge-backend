import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from "typeorm"
import { Event } from "./Event"
import { Invitee } from "./Invitee"

export enum RSVPStatus {
    NOTYETINVITED = "not_yet_invited",
    WAITINGFORREPLY = "waiting_for_reply",
    NOTCONFIRMED = "not_confirmed",
    CONFIRMED = "confirmed",
}


@Entity()
export class Invitation {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    public eventId!: number

    @Column()
    public inviteeId!: number

    @Column({
        type: "simple-enum",
        enum: RSVPStatus,
        default: RSVPStatus.NOTYETINVITED,
    })
    rsvpStatus!: RSVPStatus

    @ManyToOne(() => Event, (event) => event.invitations)
    public event!: Event


    @ManyToOne(() => Invitee, (invitee) => invitee.events)
    public invitee!: Invitee
}