import type { ConstructorFunction } from '#tools/type-utilities/ConstructorFunction';
import type { PublicFieldsOf } from '#tools/type-utilities/FieldsOf';

export interface WithDefaultValues<C extends ConstructorFunction<unknown>> {
  getDefaultValues?: () => Partial<PublicFieldsOf<InstanceType<C>>>;
}
