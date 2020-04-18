import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity()
export class Channel {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        nullable: true,
        name: 'user_id',
    })
    userId: string

    @Column({
        name: 'tg_channel_id',
    })
    tgChannelId: string

    @Column({
        name: 'tg_channel_name',
    })
    tgChannelName: string

    @Column({
        name: 'tumblr_blog_name',
    })
    tumblrBlogName: string

    @Column({
        name: 'tumblr_token',
    })
    tumblrToken: string

    @Column({
        name: 'create_at',
        type: 'datetime',
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
    })
    createAt: Date
}
