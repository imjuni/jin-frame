/* eslint-disable import/no-extraneous-dependencies */

import { format, parse } from "date-fns";
import { ObjectBody } from "../src/decorators/fields/ObjectBody";
import { Param } from "../src/decorators/fields/Param";
import { Query } from "../src/decorators/fields/Query";
import { Get } from "../src/decorators/methods/Get";
import { JinFrame } from "../src/frames/JinFrame";

interface IFirstBody {
  name: string;
  data: {
    signDate: string;
    age: number;
    more: {
      birthday: string;
      weddingAnniversary: Date;
    };
  };
}

/**
 * Complex date formatting In jin-frame
 */
@Get({ host: "http://some.api.google.com", path: "/jinframe/:passing" })
export default class ComplexFormatGetFrame extends JinFrame {
  @Param()
  public declare readonly passing: string;

  @Query()
  public declare readonly name: string;

  @Query()
  public declare readonly skill: string[];

  @ObjectBody({
    formatters: [
      {
        findFrom: "data.more.weddingAnniversary",
        dateTime: (value: Date) => format(value, "yyyy-MM-dd HH:mm:ss"),
      },
      {
        findFrom: "data.more.birthday",
        string: (value: string) => parse(value, "yyyy-MM-dd'T'HH:mm:ss", new Date()),
        dateTime: (value: Date) => format(value, "yyyy-MM-dd HH:mm:ss"),
      },
      {
        findFrom: "data.signDate",
        string: (value: string) => parse(value, "yyyy-MM-dd'T'HH:mm:ss", new Date()),
        dateTime: (value: Date) => format(value, "yyyy-MM-dd HH:mm:ss"),
      },
    ],
  })
  public declare readonly body: IFirstBody;
}
