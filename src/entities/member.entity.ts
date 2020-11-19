import { Column, Index, PrimaryGeneratedColumn } from "typeorm";
import { Entity } from '../common/entity'

@Index("member_name", ["memberName"], {})
@Index("real_name", ["realName"], {})
@Index("date_registered", ["dateRegistered"], {})
@Index("id_group", ["idGroup"], {})
@Index("birthdate", ["birthdate"], {})
@Index("posts", ["posts"], {})
@Index("last_login", ["lastLogin"], {})
@Index("lngfile", ["lngfile"], {})
@Index("id_post_group", ["idPostGroup"], {})
@Index("warning", ["warning"], {})
@Index("total_time_logged_in", ["totalTimeLoggedIn"], {})
@Index("id_theme", ["idTheme"], {})
@Index("groups", ["idGroup", "additionalGroups"], {})
@Entity('members', { schema: "jq" })
export class MemberEntity {
  @PrimaryGeneratedColumn({
    type: "mediumint",
    name: "id_member",
    unsigned: true,
  })
  idMember: number;

  @Column("varchar", { name: "member_name", length: 80, default: () => "''" })
  memberName: string;

  @Column("varchar", { name: "real_name", length: 255, default: () => "''" })
  realName: string;

  @Column("varchar", { name: "full_name", length: 255, default: () => "''" })
  fullName: string;

  @Column("int", {
    name: "date_registered",
    unsigned: true,
    default: () => "'0'",
  })
  dateRegistered: number;

  @Column("mediumint", { name: "posts", unsigned: true, default: () => "'0'" })
  posts: number;

  @Column("smallint", {
    name: "id_group",
    unsigned: true,
    default: () => "'0'",
  })
  idGroup: number;

  @Column("varchar", { name: "lngfile", length: 255, default: () => "''" })
  lngfile: string;

  @Column("int", { name: "last_login", unsigned: true, default: () => "'0'" })
  lastLogin: number;

  @Column("smallint", { name: "instant_messages", default: () => "'0'" })
  instantMessages: number;

  @Column("smallint", { name: "unread_messages", default: () => "'0'" })
  unreadMessages: number;

  @Column("tinyint", { name: "new_pm", unsigned: true, default: () => "'0'" })
  newPm: number;

  @Column("varchar", { name: "buddy_list", length: 255, default: () => "''" })
  buddyList: string;

  @Column("varchar", {
    name: "pm_ignore_list",
    length: 255,
    default: () => "''",
  })
  pmIgnoreList: string;

  @Column("mediumint", { name: "pm_prefs", default: () => "'0'" })
  pmPrefs: number;

  @Column("varchar", { name: "mod_prefs", length: 20, default: () => "''" })
  modPrefs: string;

  @Column("varchar", {
    name: "message_labels",
    length: 64,
    default: () => "''",
  })
  messageLabels: string;

  @Column("varchar", { name: "passwd", length: 64, default: () => "''" })
  passwd: string;

  @Column("varchar", { name: "openid_uri", length: 64, default: () => "''" })
  openidUri: string;

  @Column("varchar", {
    name: "email_address",
    length: 255,
    default: () => "''",
  })
  emailAddress: string;

  @Column("varchar", {
    name: "personal_text",
    length: 255,
    default: () => "''",
  })
  personalText: string;

  @Column("tinyint", { name: "gender", unsigned: true, default: () => "'0'" })
  gender: number;

  @Column("date", { name: "birthdate", default: () => "'0001-01-01'" })
  birthdate: string;

  @Column("varchar", {
    name: "website_title",
    length: 255,
    default: () => "''",
  })
  websiteTitle: string;

  @Column("varchar", { name: "website_url", length: 255, default: () => "''" })
  websiteUrl: string;

  @Column("varchar", { name: "location", length: 255, default: () => "''" })
  location: string;

  @Column("varchar", { name: "icq", length: 255, default: () => "''" })
  icq: string;

  @Column("varchar", { name: "aim", length: 255, default: () => "''" })
  aim: string;

  @Column("varchar", { name: "yim", length: 32, default: () => "''" })
  yim: string;

  @Column("varchar", { name: "msn", length: 255, default: () => "''" })
  msn: string;

  @Column("tinyint", { name: "hide_email", default: () => "'0'" })
  hideEmail: number;

  @Column("tinyint", { name: "show_online", default: () => "'1'" })
  showOnline: number;

  @Column("varchar", { name: "time_format", length: 80, default: () => "''" })
  timeFormat: string;

  @Column("varchar", { name: "signature", length: 255, default: () => "''" })
  signature: string;

  @Column("float", { name: "time_offset", precision: 12, default: () => "'0'" })
  timeOffset: number;

  @Column("varchar", { name: "avatar", length: 255, default: () => "''" })
  avatar: string;

  @Column("tinyint", { name: "pm_email_notify", default: () => "'1'" })
  pmEmailNotify: number;

  @Column("smallint", { name: "karma_bad", default: () => "'0'" })
  karmaBad: number;

  @Column("smallint", { name: "karma_good", default: () => "'0'" })
  karmaGood: number;

  @Column("float", { name: "karma", precision: 12, default: () => "'0'" })
  karma: number;

  @Column("varchar", { name: "usertitle", length: 255, default: () => "''" })
  usertitle: string;

  @Column("tinyint", { name: "notify_announcements", default: () => "'1'" })
  notifyAnnouncements: number;

  @Column("tinyint", { name: "notify_regularity", default: () => "'1'" })
  notifyRegularity: number;

  @Column("tinyint", { name: "notify_send_body", default: () => "'0'" })
  notifySendBody: number;

  @Column("tinyint", { name: "notify_types", default: () => "'2'" })
  notifyTypes: number;

  @Column("varchar", { name: "member_ip", length: 255, default: () => "''" })
  memberIp: string;

  @Column("varchar", { name: "member_ip2", length: 255, default: () => "''" })
  memberIp2: string;

  @Column("varchar", {
    name: "secret_question",
    length: 255,
    default: () => "''",
  })
  secretQuestion: string;

  @Column("varchar", { name: "secret_answer", length: 64, default: () => "''" })
  secretAnswer: string;

  @Column("tinyint", { name: "id_theme", unsigned: true, default: () => "'0'" })
  idTheme: number;

  @Column("tinyint", {
    name: "is_activated",
    unsigned: true,
    default: () => "'1'",
  })
  isActivated: number;

  @Column("varchar", {
    name: "validation_code",
    length: 32,
    default: () => "''",
  })
  validationCode: string;

  @Column("int", {
    name: "id_msg_last_visit",
    unsigned: true,
    default: () => "'0'",
  })
  idMsgLastVisit: number;

  @Column("varchar", {
    name: "additional_groups",
    length: 255,
    default: () => "''",
  })
  additionalGroups: string;

  @Column("varchar", { name: "smiley_set", length: 48, default: () => "''" })
  smileySet: string;

  @Column("smallint", {
    name: "id_post_group",
    unsigned: true,
    default: () => "'4'",
  })
  idPostGroup: number;

  @Column("int", {
    name: "total_time_logged_in",
    unsigned: true,
    default: () => "'0'",
  })
  totalTimeLoggedIn: number;

  @Column("varchar", {
    name: "password_salt",
    length: 255,
    default: () => "''",
  })
  passwordSalt: string;

  @Column("varchar", {
    name: "ignore_boards",
    length: 255,
    default: () => "''",
  })
  ignoreBoards: string;

  @Column("tinyint", { name: "warning", default: () => "'0'" })
  warning: number;

  @Column("varchar", { name: "passwd_flood", length: 12, default: () => "''" })
  passwdFlood: string;

  @Column("tinyint", {
    name: "pm_receive_from",
    unsigned: true,
    default: () => "'1'",
  })
  pmReceiveFrom: number;

  @Column("decimal", { name: "lng", nullable: true, precision: 18, scale: 15 })
  lng: string | null;

  @Column("decimal", { name: "lat", nullable: true, precision: 18, scale: 15 })
  lat: string | null;

  @Column("int", { name: "aeva_items", default: () => "'0'" })
  aevaItems: number;

  @Column("int", { name: "aeva_comments", default: () => "'0'" })
  aevaComments: number;

  @Column("int", { name: "aeva_unseen", default: () => "'-1'" })
  aevaUnseen: number;

  @Column("varchar", { name: "aeva", length: 255, default: () => "''" })
  aeva: string;

  @Column("varchar", { name: "vkontakte", length: 50, default: () => "''" })
  vkontakte: string;

  @Column("tinyint", { name: "subs", unsigned: true, default: () => "'1'" })
  subs: number;

  @Column("varchar", { name: "join_reason", length: 50, default: () => "''" })
  joinReason: string;

  @Column("varchar", { name: "skype", length: 50, default: () => "''" })
  skype: string;

  @Column("varchar", { name: "url_name", length: 80, default: () => "''" })
  urlName: string;

  @Column("int", { name: "hide_ads", unsigned: true, default: () => "'0'" })
  hideAds: number;

  @Column("int", {
    name: "custom_view_permisson",
    unsigned: true,
    default: () => "'2'",
  })
  customViewPermisson: number;

  @Column("int", { name: "tmp", unsigned: true, default: () => "'0'" })
  tmp: number;

  @Column("tinyint", { name: "is_spammer", default: () => "'0'" })
  isSpammer: number;
}
