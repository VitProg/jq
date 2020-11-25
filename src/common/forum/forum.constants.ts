

export enum Gender {
  Male = 'Male',
  Female = 'Female',
  Unknown = 'Unknown',
}


export const ForumConfiguration = {
  defaultAvatar: process.env.FORUM_DEFAULT_AVATAR ?? '/static/avatars/default.jpg',
  avatarBaseUrl: process.env.FORUM_AVATAR_BASE_URL ?? '/static/avatars/',
  galleryBaseUrl: process.env.FORUM_GALLERY_BASE_URL ?? '/static/gallery/',
  attachmentsBaseUrl: process.env.FORUM_ATTACHMENTS_BASE_URL ?? '/static/attachments/',
  userLinkPattern: process.env.FORUM_USER_LINK_PATTERN ?? '/user/{id}-{url}',
}
