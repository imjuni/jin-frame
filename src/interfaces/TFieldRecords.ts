import IBodyFieldOption from '@interfaces/IBodyFieldOption';
import IHeaderFieldOption from '@interfaces/IHeaderFieldOption';
import IParamFieldOption from '@interfaces/IParamFieldOption';
import IQueryFieldOption from '@interfaces/IQueryFieldOption';

type TFieldRecords = Record<IParamFieldOption['type'], Array<{ key: string; option: IParamFieldOption }>> &
  Record<IQueryFieldOption['type'], Array<{ key: string; option: IQueryFieldOption }>> &
  Record<IBodyFieldOption['type'], Array<{ key: string; option: IBodyFieldOption }>> &
  Record<IHeaderFieldOption['type'], Array<{ key: string; option: IHeaderFieldOption }>>;

export default TFieldRecords;
