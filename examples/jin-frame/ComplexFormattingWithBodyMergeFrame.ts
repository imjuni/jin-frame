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

interface ISecondBody {
  character: string;
  major: string;
  data: {
    age: string;
    more: { birthday: string };
  };
}

interface IThirdBody {
  name: string;
  character: string;
  data: {
    age: string;
  };
}

/**
 * Complex datetime formatting With Body Object merging
 */
@Get({ host: "http://some.api.google.com", path: "/jinframe/:passing" })
export default class ComplexFormattingWithBodyMergeFrame extends JinFrame {
  @Param()
  public declare readonly passing: string;

  @Query()
  public declare readonly name: string;

  @Query({ encode: true })
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
  public declare readonly firstBody: IFirstBody;

  @ObjectBody({
    formatters: [
      {
        findFrom: "data.more.birthday",
        string: (value: string) => parse(value, "yyyy-MM-dd'T'HH:mm:ss", new Date()),
        dateTime: (value: Date) => format(value, "yyyy-MM-dd HH:mm:ss"),
      },
    ],
  })
  public declare readonly secondBody: ISecondBody;

  @ObjectBody()
  public declare readonly thirdBody: IThirdBody;
}
