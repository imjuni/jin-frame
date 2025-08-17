import type { IFrameInternal } from '#tools/type-utilities/IFrameInternal';
import type { IFrameOption } from '#tools/type-utilities/IFrameOption';

export type TMethodEntry = Readonly<{ option: Readonly<IFrameOption>; data: Readonly<IFrameInternal> }>;
