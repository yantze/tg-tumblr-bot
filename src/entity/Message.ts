import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity()
export class Message {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        name: 'tg_channel_name',
    })
    tgChannelName: string

    @Column({
        name: 'tg_channel_id',
    })
    tgChannelId: string

    @Column({
        name: 'tumblr_post_id',
    })
    tumblrPostId: string

    @Column({
        name: 'create_at',
        type: 'datetime',
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
    })
    createAt: Date
}
