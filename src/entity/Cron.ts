import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity()
export class Cron {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        name: 'tg_chat_id',
    })
    tgChatId: string

    @Column({
        name: 'type',
    })
    type: string

    @Column({
        name: 'json_data',
    })
    jsonData: string

    @Column({
        name: 'create_at',
        type: 'datetime',
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
    })
    createAt: Date
}
