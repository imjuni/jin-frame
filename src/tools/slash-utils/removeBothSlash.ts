import removeEndSlash from '#tools/slash-utils/removeEndSlash';
import removeStartSlash from '#tools/slash-utils/removeStartSlash';

export default function removeBothSlash(value: string): string {
  return removeStartSlash(removeEndSlash(value));
}
