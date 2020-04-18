import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        name: 'tg_chat_id',
    })
    tgChatId: string

    @Column()
    name: string

    @Column({
        name: 'create_at',
        type: 'datetime',
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
    })
    createAt: Date
}
