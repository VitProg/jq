import { Column, Index, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Entity } from '../common/entity'
import { RelatedSubjectEntity } from './relatedSubject.entity'

@Index("last_message", ["idLastMsg", "idBoard"], { unique: true })
@Index("first_message", ["idFirstMsg", "idBoard"], { unique: true })
@Index("poll", ["idPoll", "idTopic"], { unique: true })
@Index("is_sticky", ["isSticky"], {})
@Index("approved", ["approved"], {})
@Index("id_board", ["idBoard"], {})
@Index("member_started", ["idMemberStarted", "idBoard"], {})
@Index("last_message_sticky", ["idBoard", "isSticky", "idLastMsg"], {})
@Index("board_news", ["idBoard", "idFirstMsg"], {})
@Entity("topics", { schema: "jq" })
export class TopicEntity {
  @PrimaryGeneratedColumn({
    type: "mediumint",
    name: "id_topic",
    unsigned: true,
  })
  idTopic: number;

  @Column("smallint", { name: "is_sticky", default: () => "'0'" })
  isSticky: number;

  @Column("smallint", {
    name: "id_board",
    unsigned: true,
    default: () => "'0'",
  })
  idBoard: number;

  @Column("int", { name: "id_first_msg", unsigned: true, default: () => "'0'" })
  idFirstMsg: number;

  @Column("int", { name: "id_last_msg", unsigned: true, default: () => "'0'" })
  idLastMsg: number;

  @Column("mediumint", {
    name: "id_member_started",
    unsigned: true,
    default: () => "'0'",
  })
  idMemberStarted: number;

  @Column("mediumint", {
    name: "id_member_updated",
    unsigned: true,
    default: () => "'0'",
  })
  idMemberUpdated: number;

  @Column("mediumint", {
    name: "id_poll",
    unsigned: true,
    default: () => "'0'",
  })
  idPoll: number;

  @Column("smallint", { name: "id_previous_board", default: () => "'0'" })
  idPreviousBoard: number;

  @Column("mediumint", { name: "id_previous_topic", default: () => "'0'" })
  idPreviousTopic: number;

  @Column("int", { name: "num_replies", unsigned: true, default: () => "'0'" })
  numReplies: number;

  @Column("int", { name: "num_views", unsigned: true, default: () => "'0'" })
  numViews: number;

  @Column("tinyint", { name: "locked", default: () => "'0'" })
  locked: number;

  @Column("smallint", { name: "unapproved_posts", default: () => "'0'" })
  unapprovedPosts: number;

  @Column("tinyint", { name: "approved", default: () => "'1'" })
  approved: number;

  @Column("tinyint", {
    name: "is_sticky_first_post",
    unsigned: true,
    default: () => "'0'",
  })
  isStickyFirstPost: number;

  @Column("varchar", { name: "description", nullable: true, length: 255 })
  description: string | null;

  @Column("varchar", { name: "url", length: 255, default: () => "''" })
  url: string;

  @Column("varchar", { name: "banner", length: 128, default: () => "''" })
  banner: string;

  @Column("varchar", { name: "sponsor_name", length: 128, default: () => "''" })
  sponsorName: string;

  @Column("varchar", { name: "sponsor_link", length: 128, default: () => "''" })
  sponsorLink: string;

  /// relations

  // @OneToOne(type => RelatedSubjectEntity, {eager: true, lazy: false, persistence: false, deferrable: 'INITIALLY IMMEDIATE'})
  // @JoinColumn({name: 'id_topic', referencedColumnName: 'idTopic'})
  // subject?: RelatedSubjectEntity
}
