import { JinFrame } from '../src/frames/JinFrame';
import { Query } from '../src/decorators/fields/Query';
import { Param } from '../src/decorators/fields/Param';
import { Get } from '../src/decorators/methods/Get';

/**
 * In case of array parameter in querystring, apply comma sepearted string
 *
 * eg.
 * before encoding: http://some.api.google.com/jinframe/pass?passing=pass&name=ironman&skills=beam,flying!
 * after encoding: http://some.api.google.com/jinframe/pass?passing=pass&name=ironman&skills=beam%2Cflying%21
 */
@Get({ path: '/jinframe/:passing' })
export default class CommaSeperatedGetFrame extends JinFrame {
  @Param()
  declare public readonly passing: string;

  @Query()
  declare public readonly name: string;

  @Query({ comma: true })
  declare public readonly skill: string[];
}
