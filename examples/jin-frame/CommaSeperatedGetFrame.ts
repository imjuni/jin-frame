import { Param } from "../src/decorators/fields/Param";
import { Query } from "../src/decorators/fields/Query";
import { Get } from "../src/decorators/methods/Get";
import { JinFrame } from "../src/frames/JinFrame";

/**
 * In case of array parameter in querystring, apply comma sepearted string
 *
 * eg.
 * before encoding: http://some.api.google.com/jinframe/pass?passing=pass&name=ironman&skills=beam,flying!
 * after encoding: http://some.api.google.com/jinframe/pass?passing=pass&name=ironman&skills=beam%2Cflying%21
 */
@Get({ path: "/jinframe/:passing" })
export default class CommaSeperatedGetFrame extends JinFrame {
  @Param()
  public declare readonly passing: string;

  @Query()
  public declare readonly name: string;

  @Query({ comma: true })
  public declare readonly skill: string[];
}
