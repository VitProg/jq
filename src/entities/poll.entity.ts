import { Column, Index, PrimaryGeneratedColumn } from "typeorm";
import { Entity } from '../common/entity'

@Index("id_topic", ["idTopic"], {})
@Entity("polls", { schema: "jq" })
export class PollEntity {
  @PrimaryGeneratedColumn({
    type: "mediumint",
    name: "id_poll",
    unsigned: true,
  })
  idPoll: number;

  @Column("varchar", { name: "question", length: 255, default: () => "''" })
  question: string;

  @Column("tinyint", { name: "voting_locked", width: 1, default: () => "'0'" })
  votingLocked: boolean;

  @Column("tinyint", {
    name: "max_votes",
    unsigned: true,
    default: () => "'1'",
  })
  maxVotes: number;

  @Column("int", { name: "expire_time", unsigned: true, default: () => "'0'" })
  expireTime: number;

  @Column("tinyint", {
    name: "hide_results",
    unsigned: true,
    default: () => "'0'",
  })
  hideResults: number;

  @Column("tinyint", {
    name: "change_vote",
    unsigned: true,
    default: () => "'0'",
  })
  changeVote: number;

  @Column("tinyint", {
    name: "guest_vote",
    unsigned: true,
    default: () => "'0'",
  })
  guestVote: number;

  @Column("int", {
    name: "num_guest_voters",
    unsigned: true,
    default: () => "'0'",
  })
  numGuestVoters: number;

  @Column("int", { name: "reset_poll", unsigned: true, default: () => "'0'" })
  resetPoll: number;

  @Column("mediumint", { name: "id_member", default: () => "'0'" })
  idMember: number;

  @Column("varchar", { name: "poster_name", length: 255, default: () => "''" })
  posterName: string;

  @Column("mediumint", {
    name: "id_topic",
    unsigned: true,
    default: () => "'0'",
  })
  idTopic: number;

  @Column("tinyint", {
    name: "show_voters",
    unsigned: true,
    default: () => "'0'",
  })
  showVoters: number;
}
