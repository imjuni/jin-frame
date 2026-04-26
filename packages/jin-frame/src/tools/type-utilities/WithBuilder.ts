import type { ConstructorFunction } from '#tools/type-utilities/ConstructorFunction';
import type { BuilderFor } from '#tools/type-utilities/BuilderFor';

export interface WithBuilder<C extends ConstructorFunction<unknown>> {
  builder: (...args: ConstructorParameters<C>) => BuilderFor<C>;
}
