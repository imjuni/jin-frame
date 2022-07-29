import IBodyFieldOption from '@interfaces/IBodyFieldOption';
import IHeaderFieldOption from '@interfaces/IHeaderFieldOption';
import IParamFieldOption from '@interfaces/IParamFieldOption';
import IQueryFieldOption from '@interfaces/IQueryFieldOption';

type TRequestPart =
  | IQueryFieldOption['type']
  | IParamFieldOption['type']
  | IBodyFieldOption['type']
  | IHeaderFieldOption['type'];

export default TRequestPart;
