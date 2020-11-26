const isLinkRule = /^(https?)?:\/\//

export function isExternalLink(link?: string) {
  return !!link && isLinkRule.test(link)
}
