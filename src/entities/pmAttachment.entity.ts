import { Column, Index, PrimaryGeneratedColumn } from "typeorm";
import { Entity } from '../common/entity'

@Index("id_pm", ["idPm"], {})
@Entity("pm_attachments", { schema: "jq" })
export class PmAttachmentEntity {
  @PrimaryGeneratedColumn({ type: "int", name: "id_attach", unsigned: true })
  idAttach: number;

  @Column("int", { name: "id_thumb", unsigned: true, default: () => "'0'" })
  idThumb: number;

  @Column("int", { name: "id_pm", unsigned: true, default: () => "'0'" })
  idPm: number;

  @Column("int", { name: "pm_report", unsigned: true, default: () => "'0'" })
  pmReport: number;

  @Column("tinyint", { name: "id_folder", default: () => "'1'" })
  idFolder: number;

  @Column("tinyint", {
    name: "attachment_type",
    unsigned: true,
    default: () => "'0'",
  })
  attachmentType: number;

  @Column("tinytext", { name: "filename" })
  filename: string;

  @Column("varchar", { name: "file_hash", length: 40, default: () => "''" })
  fileHash: string;

  @Column("varchar", { name: "fileext", length: 8, default: () => "''" })
  fileext: string;

  @Column("int", { name: "size", unsigned: true, default: () => "'0'" })
  size: number;

  @Column("mediumint", {
    name: "downloads",
    unsigned: true,
    default: () => "'0'",
  })
  downloads: number;

  @Column("mediumint", { name: "width", unsigned: true, default: () => "'0'" })
  width: number;

  @Column("mediumint", { name: "height", unsigned: true, default: () => "'0'" })
  height: number;

  @Column("varchar", { name: "mime_type", length: 20, default: () => "''" })
  mimeType: string;
}
